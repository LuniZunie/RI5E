import express from "express";
import fs from "fs";
import path from "path";

import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { apply_diff } from "../client/global/module/diff.js";
import { get } from "http";
import UUID from "../client/module/uuid.js";

// logging
class Logger {
    static log(type, source, secondSource = "", message) {
        secondSource ||= "";
        const [ date, time ] = new Date().toISOString().split("T");
        const path = `server/logs/${date}.log`;

        const field = (len, msg) => (msg.slice(0, len) || "-").padEnd(len, " ");

        const logMessage = `${date} ${time.slice(0, 8)} ${field(8, type)} ${field(16, source)} ${field(16, secondSource)} ${message}\n`;
        // append log synchronously
        try {
            fs.appendFileSync(path, logMessage, "utf8");
        } catch (err) {
            console.error(`Failed to write log: ${err.message}`);
        }
    }
}

const server = JSON.parse(fs.readFileSync("server/!server.json", "utf8"));
const url_base = server.production ? `https://${server.domain}` : `http://${server.host}:${server.port}`;

const app = express();

app.use(express.json({ limit: "10mb" })); // limit to 1mb
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // limit to 1mb
app.use(express.static("client"));
app.set("views", "client/view");

// cookies
app.use(cookieParser());

// middleware
app.use(session({
    secret: server.session.secret,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

(function OAuth() {
    const get = (o, v) => {
        if (server.production) return o.production?.[v] ?? o[v];
        else return o.development?.[v] ?? o[v];
    };
    const handle = (req, res) => {
        const token = jwt.sign(req.user, server.jwt.secret, { expiresIn: get(server.auth, "expiration") });
        res.cookie("token", token, { httpOnly: true, sameSite: "Strict", secure: server.secure });
        res.redirect(get(server.auth.in, "success"));
    };

    { // Google OAuth
        const google = server.auth.in.google;
        passport.use(new GoogleStrategy({
            clientID: get(google, "id"),
            clientSecret: get(google, "secret"),
            callbackURL: `${url_base}${get(google, "callback")}`,
        }, (accessToken, refreshToken, profile, done) => {
            done(null, {
                id: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName || profile.name?.givenName || profile.name?.familyName,
                username: null, // Google does not provide a username
                avatar: profile.photos?.[0]?.value,
                auth_service: "Google"
            });
        }));

        app.get(get(google, "route"), passport.authenticate("google", { scope: get(google, "scope") }));
        app.get(get(google, "callback"), passport.authenticate("google", { session: false, failureRedirect: get(server.auth.in, "failure") }), handle);
    }

    { // GitHub OAuth
        const github = server.auth.in.github;
        passport.use(new GitHubStrategy({
            clientID: get(github, "id"),
            clientSecret: get(github, "secret"),
            callbackURL: `${url_base}${get(github, "callback")}`,
        }, (accessToken, refreshToken, profile, done) => {
            done(null, {
                id: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName || profile.username,
                username: profile.username,
                avatar: profile.photos?.[0]?.value,
                auth_service: "GitHub",
            });
        }));

        app.get(get(github, "route"), passport.authenticate("github", { scope: get(github, "scope") }));
        app.get(get(github, "callback"), passport.authenticate("github", { session: false, failureRedirect: get(server.auth.in, "failure") }), handle);
    }
})();

app.get("/api/user", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = jwt.verify(token, server.jwt.secret);
        res.status(200).json(user);
    } catch (err) { res.status(401).json({ error: "Invalid or expired token" }); }
});

app.get("/api/sync", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.status(200).json({
        time: Date.now(),
        server: {
            production: server.production,
            url: url_base
        }
    });
});

async function recursive_write(file, data, encoding = "utf8", source) {
    const dir = path.dirname(file);
    try {
        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(file, data, encoding);
    } catch (err) {
        Logger.log("ERROR", "recursive_write", source, `Failed to write file ${file}: ${err.message}`);
        throw new Error("Internal server error");
    }
}
async function read_or(file, encoding, fallback, source) {
    let resolve, reject;
    const promise = new Promise((res, rej) => ([ resolve, reject ] = [ res, rej ]));
    try {
        await fs.promises.access(file, fs.constants.R_OK);
        fs.promises.readFile(file, encoding)
            .then(data => resolve({ status: 200, data }))
            .catch(err => {
                Logger.log("ERROR", "read_or", source, `Failed to read file ${file}: ${err.message}`);
                reject({ status: 500, error: "Internal server error" });
            });
    } catch (err) {
        if (err.code === "ENOENT") {
            if (fallback) {
                recursive_write(file, fallback, encoding, "read_or")
                    .then(() => resolve({ status: 200, data: fallback }))
                    .catch(err => {
                        Logger.log("ERROR", "read_or", source, `Failed to write fallback file ${file}: ${err.message}`);
                        reject({ status: 500, error: "Internal server error" });
                    });
            } else {
                Logger.log("WARN", "read_or", source, `File not found: ${file}`);
                reject({ status: 404, error: "File not found" });
            }
        } else {
            Logger.log("ERROR", "read_or", source, `Failed to access file ${file}: ${err.message}`);
            reject({ status: 500, error: "Internal server error" });
        }
    }
    return promise;
}

function get_file_path(user, folder = "users") {
    let prefix = server.production ? "" : "dev.";
    return `server/db/${folder}/${prefix}${user.auth_service.toLowerCase()}.${Number(user.id).toString(36)}.json`;
}

app.get("/api/user/data", async (req, res) => { // all asynchronous to allow for future expansion
    res.set("Cache-Control", "no-store");
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = jwt.verify(token, server.jwt.secret);
        const file = get_file_path(user);

        read_or(file, "utf8", "{}", "get_user_data")
            .then(({ status, data }) => res.status(status).json(JSON.parse(data)))
            .catch(({ status, error }) => res.status(status).json({ error }));
    } catch (err) { res.status(401).json({ error: "Invalid or expired token" }); }
});
app.post("/api/user/data", async (req, res) => {
    res.set("Cache-Control", "no-store");
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = jwt.verify(token, server.jwt.secret);
        const file = get_file_path(user);

        try {
            await fs.promises.access(file, fs.constants.W_OK);
        } catch (err) {
            if (err.code !== "ENOENT") {
                Logger.log("ERROR", "post_user_data", null, `Failed to access file ${file}: ${err.message}`);
                return res.status(500).json({ error: "Internal server error" });
            }
        } finally {
            try {
                // is_valid_user_data(req.body);
            } catch (e) {
                Logger.log("WARN", "post_user_data", null, `Invalid user data: ${e.message}`);
                return res.status(400).json({ error: "Request failed" });
            }

            read_or(file, "utf8", "{}", "post_user_data")
                .then(({ status, data }) => {
                    let userData;
                    try {
                        userData = JSON.parse(data);
                    } catch (e) {
                        Logger.log("ERROR", "post_user_data", null, `Failed to parse existing user data: ${e.message}`);
                        return res.status(500).json({ error: "Internal server error" });
                    }

                    const inventory = userData.inventory || {};
                    let { added, changed, removed } = req.body;

                    if (added) {
                        if (!Array.isArray(added)) {
                            Logger.log("WARN", "post_user_data", null, "Invalid added data, expected array");
                            return res.status(400).json({ error: "Invalid request data" });
                        }
                        added.forEach(({ id, construct, data }) => {
                            if (typeof data !== "object") {
                                Logger.log("WARN", "post_user_data", null, `Invalid item in added: ${JSON.stringify(data)}`);
                                return res.status(400).json({ error: "Invalid request data" });
                            }
                            inventory[id] = { construct, data };
                        });
                    }
                    if (changed) {
                        if (!Array.isArray(changed)) {
                            Logger.log("WARN", "post_user_data", null, "Invalid changed data, expected array");
                            return res.status(400).json({ error: "Invalid request data" });
                        }
                        changed.forEach(({ id, data }) => {
                            if (data === undefined || data === null)
                                return; // skip if no data to change
                            if (typeof data !== "object") {
                                Logger.log("WARN", "post_user_data", null, `Invalid item in changed: ${JSON.stringify(data)}`);
                                return res.status(400).json({ error: "Invalid request data" });
                            }
                            if (!inventory[id]) {
                                Logger.log("WARN", "post_user_data", null, `Item to change not found in inventory: ${id}`);
                                return res.status(400).json({ error: "Invalid request data" });
                            }
                            inventory[id].data = apply_diff(inventory[id].data, data);
                        });
                    }
                    if (removed) {
                        if (!Array.isArray(removed)) {
                            Logger.log("WARN", "post_user_data", null, "Invalid removed data, expected array");
                            return res.status(400).json({ error: "Invalid request data" });
                        }
                        removed.forEach(id => {
                            if (typeof id !== "string") {
                                Logger.log("WARN", "post_user_data", null, `Invalid item in removed: ${id}`);
                                return res.status(400).json({ error: "Invalid request data" });
                            }
                            delete inventory[id];
                        });
                    }

                    return recursive_write(file, JSON.stringify({ inventory: inventory }, null, 2), "utf8", "post_user_data");
                })
                .then(() => res.status(200).json({ message: "User data saved successfully" }))
                .catch(err => {
                    Logger.log("ERROR", "post_user_data", null, `Failed to write file ${file}: ${err.message}`);
                    res.status(500).json({ error: "Internal server error" });
                });
        }
    } catch (err) { res.status(401).json({ error: "Invalid or expired token" }); }
});
app.delete("/api/user/data", async (req, res) => {
    res.set("Cache-Control", "no-store");
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = jwt.verify(token, server.jwt.secret);
        const file = get_file_path(user);

        try {
            await fs.promises.access(file, fs.constants.W_OK);
            await fs.promises.unlink(file);
            res.clearCookie("token");
            res.status(200).json({ message: "User deleted successfully" });
        } catch (err) {
            Logger.log("ERROR", "delete_user_data", null, `Failed to delete file ${file}: ${err.message}`);
            res.status(500).json({ error: "Internal server error" });
        }
    } catch (err) { res.status(401).json({ error: "Invalid or expired token" }); }
});

app.get(server.auth.out.route, (req, res) => {
    res.clearCookie("token");
    res.redirect(server.auth.out.success);
});

for (const page of server.router) {
    let fn;
    if ("file" in page)
        fn = res => res.render(page.file);
    else if ("redirect" in page)
        fn = res => res.redirect(page.redirect);
    else if ("json" in page)
        fn = res => res.json(page.json);
    else if ("text" in page)
        fn = res => res.send(page.text);
    else
        throw new Error("Invalid router page configuration");

    app.get(page.route,  (req, res) => fn(res.status(page.status || 200)));
}
app.use((req, res) => {
    if (req.path.endsWith(".svg"))
        res.status(404).redirect("/game/assets/null.svg");
    else res.status(404).send("404 Not Found");
});

app.listen(server.port, server.host, () => {
    console.log(`Server running at ${url_base}/`)
});
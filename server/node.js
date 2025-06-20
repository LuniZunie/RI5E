import express from "express";
import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import { WebSocketServer } from "ws";

import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { apply_diff } from "../client/global/module/diff.js";
import UUID from "../client/module/uuid.js";

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

const config = JSON.parse(fs.readFileSync("server/config.json", "utf8"));
const secrets = JSON.parse(fs.readFileSync("server/secret.hidden.json", "utf8"));
const url_base = secrets.production ? `https://${config.domain}` : `http://localhost:${config.port}`;

const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json({ limit: "10mb" })); // limit to 1mb
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // limit to 1mb
app.use(express.static("client"));
app.use(cookieParser());
app.use(session({
    secret: secrets.session.secret,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("views", "client/view");

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

(function OAuth() {
    const get = (o, v) => {
        if (secrets.production) return o.production?.[v] ?? o[v];
        else return o.development?.[v] ?? o[v];
    };
    const handle = (req, res) => {
        const token = jwt.sign(req.user, secrets.jwt.secret, { expiresIn: get(config.auth, "expiration") });
        res.cookie("token", token, { httpOnly: true, sameSite: "Strict", secure: config.secure });
        res.redirect(get(config.auth.in, "success"));
    };

    { // Google OAuth
        const google = config.auth.in.google;
        passport.use(new GoogleStrategy({
            clientID: get(secrets.google, "id"),
            clientSecret: get(secrets.google, "secret"),
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
        app.get(get(google, "callback"), passport.authenticate("google", { session: false, failureRedirect: get(config.auth.in, "failure") }), handle);
    }

    { // GitHub OAuth
        const github = config.auth.in.github;
        passport.use(new GitHubStrategy({
            clientID: get(secrets.github, "id"),
            clientSecret: get(secrets.github, "secret"),
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
        app.get(get(github, "callback"), passport.authenticate("github", { session: false, failureRedirect: get(config.auth.in, "failure") }), handle);
    }
})();

function get_file_path(user, folder = "users", suffix = ".json") {
    let prefix = secrets.production ? "" : "dev.";
    return `server/db/${folder}/${prefix}${user.auth_service.toLowerCase()}.${Number(user.id).toString(36)}${suffix}`;
}
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
            if (fallback !== null && fallback !== undefined) {
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

(function CreateWebSocket() {
    function parseCookies(cookieHeader) {
        const cookies = {};
        if (!cookieHeader) return cookies;

        cookieHeader.split(';').forEach(cookie => {
            const [name, ...rest] = cookie.trim().split('=');
            cookies[name] = decodeURIComponent(rest.join('='));
        });

        return cookies;
    }

    wss.on("connection", (ws, req) => {
        const token = parseCookies(req.headers.cookie || "").token;
        if (!token) {
            ws.close(1008, "Unauthorized");
            return;
        }

        let user;
        try {
            user = jwt.verify(token, secrets.jwt.secret);
        } catch (err) {
            ws.close(1008, "Invalid or expired token");
            return;
        }
        ws.on("message", message => {
            const msg = message.toString();
            if (typeof msg !== "string")
                return;

            switch (msg) {
                case "ping": {
                    ws.send("pong");
                } break;
                case "hash": {
                    const file = get_file_path(user, "saves", ".txt");
                    read_or(file, "utf8", "", "ws_send_save")
                        .then(({ status, data }) => ws.send(`hash:${data}`))
                        .catch(({ status, error }) => {
                            Logger.log("ERROR", "ws_send_save", user.id, `Failed to read save file ${file}: ${error}`);
                            ws.send("error:internal_server_error");
                        });
                } break;
                case "sync": {
                    ws.send(`sync:${Date.now()}`);
                } break;
            }
        });
    });
})();

app.get("/api/user", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = jwt.verify(token, secrets.jwt.secret);
        res.status(200).json(user);
    } catch (err) { res.status(401).json({ error: "Invalid or expired token" }); }
});

app.get("/api/user/data", async (req, res) => { // all asynchronous to allow for future expansion
    res.set("Cache-Control", "no-store");
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = jwt.verify(token, secrets.jwt.secret);
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

    let user;
    try {
        user = jwt.verify(token, secrets.jwt.secret);
    } catch (err) { res.status(401).json({ error: "Invalid or expired token" }); return; }

    const file = get_file_path(user);
    try {
        await fs.promises.access(file, fs.constants.W_OK);
    } catch (err) {
        if (err.code !== "ENOENT") {
            Logger.log("ERROR", "post_user_data", user.id, `Failed to access file ${file}: ${err.message}`);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    const error = { status: 400, error: "Invalid request data" };
    let hash = UUID();
    read_or(file, "utf8", "{}", "post_user_data")
        .then(({ status, data }) => {
            let userData;
            try {
                userData = JSON.parse(data);
            } catch (e) {
                error.status = 500, error.error = "Internal server error";
                Logger.log("ERROR", "post_user_data", user.id, `Failed to parse existing user data: ${e.message}`);
                throw new Error("Internal server error");
            }

            const inventory = userData.inventory || {};
            let { added, changed, removed } = req.body;

            if (added) {
                if (!Array.isArray(added)) {
                    error.status = 400, error.error = "Invalid added data, expected array";
                    throw new Error("Invalid added data");
                }
                added.forEach(({ id, construct, data }) => {
                    if (typeof data !== "object")
                        return;
                    inventory[id] = { construct, data };
                });
            }
            if (changed) {
                if (!Array.isArray(changed)) {
                    error.status = 400, error.error = "Invalid changed data, expected array";
                    throw new Error("Invalid changed data");
                }
                changed.forEach(({ id, data }) => {
                    if (data === undefined || data === null || typeof data !== "object" || !inventory[id])
                        return;
                    inventory[id].data = apply_diff(inventory[id].data, data);
                });
            }
            if (removed) {
                if (!Array.isArray(removed)) {
                    error.status = 400, error.error = "Invalid removed data, expected array";
                    throw new Error("Invalid removed data");
                }
                removed.forEach(id => {
                    if (typeof id !== "string")
                        return;
                    delete inventory[id];
                });
            }

            recursive_write(get_file_path(user, "saves", ".txt"), hash, "utf8", "write_user_save");

            const dir = path.dirname(file);
            return fs.promises.mkdir(dir, { recursive: true })
                .then(() => {
                    const stream = fs.createWriteStream(file, { flags: "w", encoding: "utf8" });

                    stream.write('{ "inventory":{');
                    const ks = Object.keys(inventory);
                    ks.forEach((k, i) => {
                        stream.write(`"${k}":${JSON.stringify(inventory[k])}`);
                        if (i < ks.length - 1) stream.write(",");
                    });
                    stream.end(" } }", "utf8");

                    return new Promise((resolve, reject) => {
                        stream.on("finish", resolve);
                        stream.on("error", err => {
                            error.status = 500, error.error = "Internal server error";
                            Logger.log("ERROR", "post_user_data", user.id, `Failed to write file ${file}: ${err.message}`);
                            reject(new Error("Internal server error"));
                        });
                    });
                })
                .catch(err => {
                    error.status = 500, error.error = "Internal server error";
                    Logger.log("ERROR", "post_user_data", user.id, `Failed to write file ${file}: ${err.message}`);
                    throw new Error("Internal server error");
                });
        })
            .then(() => res.status(200).json({ message: "User data saved successfully", hash }))
            .catch(err => res.status(error.status).json({ error: error.error }));

});

app.delete("/api/user/data", async (req, res) => {
    res.set("Cache-Control", "no-store");
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = jwt.verify(token, secrets.jwt.secret);
        const file = get_file_path(user);
        const file2 = get_file_path(user, "saves", ".txt");

        try {
            await fs.promises.access(file, fs.constants.W_OK);
            await fs.promises.unlink(file);

            await fs.promises.access(file2, fs.constants.W_OK);
            await fs.promises.unlink(file2);

            res.clearCookie("token");
            res.status(200).json({ message: "User deleted successfully" });
        } catch (err) {
            Logger.log("ERROR", "delete_user_data", null, `Failed to delete file ${file}: ${err.message}`);
            res.status(500).json({ error: "Internal server error" });
        }
    } catch (err) { res.status(401).json({ error: "Invalid or expired token" }); }
});

app.get(config.auth.out.route, (req, res) => {
    res.clearCookie("token");
    res.redirect(config.auth.out.success);
});

for (const page of config.router) {
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

server.listen(config.port, config.host, () => {
    console.log(`Server running at ${url_base}/`);
    console.log(`WebSocket server running at ${url_base.replace("http", "ws")}/`);
});
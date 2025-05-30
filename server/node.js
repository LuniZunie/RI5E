import express from "express";
import fs from "fs";

import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const server = JSON.parse(fs.readFileSync("server/!server.json", "utf8"));
const url_base = `http://${server.host}:${server.port}`;

const app = express();

app.use(express.json({ limit: "1mb" })); // limit to 1mb
app.use(express.urlencoded({ extended: true, limit: "1mb" })); // limit to 1mb
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

// strategy configuration
// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: server.auth.in.google.id,
    clientSecret: server.auth.in.google.secret,
    callbackURL: `${url_base}${server.auth.in.google.callback}`
}, (accessToken, refreshToken, profile, done) => done(null, {
    id: profile.id,
    email: profile.emails?.[0]?.value,
    name: profile.displayName || profile.name?.givenName || profile.name?.familyName,
    username: null, // Google does not provide a username
    avatar: profile.photos?.[0]?.value,
    auth_service: "Google"
})));
// GitHub OAuth strategy
passport.use(new GitHubStrategy({
    clientID: server.auth.in.github.id,
    clientSecret: server.auth.in.github.secret,
    callbackURL: `${url_base}${server.auth.in.github.callback}`
}, (accessToken, refreshToken, profile, done) => done(null, {
    id: profile.id,
    email: profile.emails?.[0]?.value,
    name: profile.displayName || profile.username,
    username: profile.username,
    avatar: profile.photos?.[0]?.value,
    auth_service: "GitHub",
})));

// Routes
function handle_auth(req, res) {
    const token = jwt.sign(req.user, server.jwt.secret, { expiresIn: server.auth.expiration });
    res.cookie("token", token, { httpOnly: true, sameSite: "Strict", secure: server.secure });
    res.redirect(server.auth.in.success);
}
// Google auth routes
app.get(server.auth.in.google.route, passport.authenticate("google", { scope: server.auth.in.google.scope }));
app.get(server.auth.in.google.callback, passport.authenticate("google", { session: false, failureRedirect: server.auth.in.failure }), handle_auth);

// GitHub auth routes
app.get(server.auth.in.github.route, passport.authenticate("github", { scope: server.auth.in.github.scope }));
app.get(server.auth.in.github.callback, passport.authenticate("github", { session: false, failureRedirect: server.auth.in.failure }), handle_auth);

// lookup
app.get("/api/user", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = jwt.verify(token, server.jwt.secret);
        res.status(200).json(user);
    } catch (err) { res.status(401).json({ error: "Invalid or expired token" }); }
});

// user data
function get_file_path(user) {
    return `server/db/users/${user.auth_service.toLowerCase()}.${Number(user.id).toString(36)}.json`;
}
function is_valid_user_data(data) { // TODO
    if (typeof data !== "object" || data === null) throw new TypeError("Invalid user data, must be an object");
    return true;
}

// get
app.get("/api/user/data", async (req, res) => { // all asynchronous to allow for future expansion
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = jwt.verify(token, server.jwt.secret);
        const file = get_file_path(user);

        try {
            await fs.promises.access(file, fs.constants.R_OK);
            fs.promises.readFile(file, "utf8")
                .then(data => res.status(200).json(JSON.parse(data)))
                .catch(err => {
                    console.error("Error reading user data file:", err);
                    res.status(500).json({ error: "Internal server error" });
                });
        } catch (err) {
            if (err.code === "ENOENT")
                fs.promises.writeFile(file, "{}", "utf8")
                    .then(() => res.status(200).json({}))
                    .catch(err => {
                        console.error("Error creating user data file:", err);
                        res.status(500).json({ error: "Internal server error" });
                    });
            else
                res.status(500).json({ error: "Internal server error" });
        }
    } catch (err) { res.status(401).json({ error: "Invalid or expired token" }); }
});
// post
app.post("/api/user/data", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = jwt.verify(token, server.jwt.secret);
        const file = get_file_path(user);

        try {
            await fs.promises.access(file, fs.constants.W_OK);
        } catch (err) {
            if (err.code !== "ENOENT") {
                console.error("Error accessing user data file:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
        } finally {
            try {
                is_valid_user_data(req.body);
            } catch (e) {
                console.error("Invalid user data:", e);
                return res.status(400).json({ error: "Request failed" });
            }

            fs.promises.writeFile(file, JSON.stringify(req.body, null, 2), "utf8")
                .then(() => res.status(200).json({ message: "User data updated successfully" }))
                .catch(err => {
                    console.error("Error writing user data file:", err);
                    res.status(500).json({ error: "Internal server error" });
                });
        }
    } catch (err) { res.status(401).json({ error: "Invalid or expired token" }); }
});
// delete
app.delete("/api/user/data", async (req, res) => {
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
            console.error("Error deleting user data file:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    } catch (err) { res.status(401).json({ error: "Invalid or expired token" }); }
});


// logout
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
app.use((req, res) => res.status(404).redirect("/404"));

app.listen(server.port, server.host, () => {
    console.log(`Server running at ${url_base}/`)
});
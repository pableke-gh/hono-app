
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { sessionMiddleware, MemoryStore } from "hono-sessions";

import { lang, init } from "./controllers/index.tsx"; // Init. language
import { error404, error500 } from "./controllers/errors.tsx"; // Error handlers

import config from "./config.js"; // Configurations
import routes from "./routes/app.js"; // Routes

const app = new Hono(); // Application instance
const mwStatic = serveStatic({ root: "./dist/" }); // Stastic middleware
const mwSimule = serveStatic({ root: "./dist/", rewriteRequestPath: path => "/views" + path });
app.use("/public/*", mwStatic).use("/views/*", mwStatic); // Static paths
app.use("*", (ctx, next) => { // simule static path
    return ctx.req.path.endsWith(".html") ? mwSimule(ctx, next) : next();
});

app.use("*", sessionMiddleware({ // Session configration
    store: new MemoryStore(), // interface for getting and setting
    encryptionKey: config.SESSION_KEY, // Required for CookieStore
    expireAfterSeconds: 900, // Expire session after 15 minutes of inactivity
    cookieOptions: {
        sameSite: "Lax", // Recommended for basic CSRF protection in modern browsers
        path: "/", // Required for this library to work properly
        httpOnly: true, // Recommended to avoid XSS attacks
    }
}));

/*app.use("*", langByQuery);*/
const LANG_ROUTE = "/:lang{[a-z]{2}(\-[A-Z]{2})?}";
app.get(LANG_ROUTE, lang).get(LANG_ROUTE + "/*", lang);
app.use("*", init); // Always load language info

app.route("/", routes);
app.route(LANG_ROUTE, routes);

app.notFound(error404);
app.onError(error500);

export default app;


import { Hono } from "hono";
import * as ctrl from "../controllers/login";

const routes = new Hono();

routes.use("/auth/*", ctrl.auth); // Validate access
routes.get("/login", ctrl.login).get("/signin", ctrl.login)
        .get("/logout", ctrl.logout).get("/signout", ctrl.logout)
routes.post("/login", ctrl.signin).post("/signin", ctrl.signin);

export default routes;

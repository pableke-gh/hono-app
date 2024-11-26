
import { Hono } from "hono";
import { auth } from "../controllers/login";
import * as ctrl from "../controllers/admin";

const routes = new Hono();

routes.use("*", auth)
routes.get("/", ctrl.admin).get("/index", ctrl.admin).get("/welcome", ctrl.welcome)
    .get("/profile", ctrl.viewProfile).get("/perfil", ctrl.viewProfile);
routes.post("/profile", ctrl.saveProfile).post("/perfil", ctrl.saveProfile);

export default routes;

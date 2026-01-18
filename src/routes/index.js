import { Hono } from "hono"
import home from "./home.js"
import projects from "./projects.js"

const routes = new Hono()

routes.route("/", home)
routes.route("/", projects)

export default routes

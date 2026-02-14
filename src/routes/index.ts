import { Hono } from "hono"
import home from "./home.js"

const routes = new Hono()

routes.route("/", home)

export default routes

import { Hono } from "hono"
import home from "./home.ts"
import jrdoc from "./jrdoc.ts"

const routes = new Hono()

routes.route("/", home)
routes.route("/", jrdoc)

export default routes

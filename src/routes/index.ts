import { Hono } from "hono"
import portfolio from "./portfolio.ts"
import jrdoc from "./jrdoc.ts"

const routes = new Hono()

routes.route("/", portfolio)
routes.route("/", jrdoc)

export default routes

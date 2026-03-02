import { Hono } from "hono"
import portfolio from "./portfolio.ts"

const routes = new Hono()

routes.route("/", portfolio)

export default routes

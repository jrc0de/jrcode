import { Hono } from "hono"
import home from "./home.ts"
import languages from "./languages.ts"

const routes = new Hono()

routes.route("/", home)
routes.route("/", languages)

export default routes

import { Hono } from "hono"
import home from "./home.js"
import dashboard from "./dashboard.js"
import editor from "./editor.js"
import rss from "./rss.js"

const routes = new Hono()

routes.route("/", home)
routes.route("/dashboard", dashboard)
routes.route("/editor", editor)
routes.route("/rss", rss)

export default routes

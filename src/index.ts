import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import { compress } from "hono/compress"
import routes from "./routes/index.js"
import apiRoutes from "./api/index.js"

const app = new Hono()

app.use(compress())
app.use("/*", serveStatic({ root: "./src/public" }))

app.route("/", routes)
app.route("/", apiRoutes)

export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch,
}

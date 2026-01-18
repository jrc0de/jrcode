import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import routes from "./routes/index.js"

const app = new Hono()

app.use("/*", serveStatic({ root: "./src/public" }))

app.route("/", routes)

export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch,
}

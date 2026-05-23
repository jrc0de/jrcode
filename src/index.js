import { Hono } from "hono"
import { compress } from "hono/compress"
import apiRoutes from "./api/index.js"

const app = new Hono()

app.use(compress())

app.route("/", apiRoutes)

export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch,
}

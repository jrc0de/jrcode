import { Hono } from "hono"
import routes from "./routes/index.js"

const app = new Hono()

app.route("/", routes)

export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch,
}

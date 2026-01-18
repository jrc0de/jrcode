import { Hono } from "hono"
import feed1 from "./rss/feed1.js"
import feed2 from "./rss/feed2.js"

const app = new Hono()

app.route("/", feed1)
app.route("/", feed2)

export default app

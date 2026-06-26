import { Hono } from "hono"
import feed1 from "./rss/feed1.js"
import feed2 from "./rss/feed2.js"
import feed3 from "./rss/feed3.js"

const app = new Hono()

app.route("/", feed1)
app.route("/", feed2)
app.route("/", feed3)

export default app

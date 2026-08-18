import { Elysia } from "elysia"
import feed1 from "./rss/feed1.js"
import feed2 from "./rss/feed2.js"
import feed3 from "./rss/feed3.js"

const app = new Elysia()

app.use(feed1)
app.use(feed2)
app.use(feed3)

export default app

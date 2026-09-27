import { Hono } from "hono"
import { compress } from "hono/compress"
import { serveStatic } from "hono/bun"
import apiRoutes from "./api/index.js"

const app = new Hono()

app.use(compress())

// Routes API — montées en premier, priorité sur le statique
app.route("/", apiRoutes)

// Fichiers statiques générés par VitePress (JS, CSS, images...)
app.use("/*", serveStatic({ root: "./docs/.vitepress/dist" }))

// Fallback pour toute route non trouvée : sert index.html ou 404.html de VitePress
app.notFound(async (c) => {
    const file = Bun.file("./docs/.vitepress/dist/404.html")
    if (await file.exists()) {
        return c.html(await file.text(), 404)
    }
    return c.text("Not found", 404)
})

export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch,
}

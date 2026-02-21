import { Hono } from "hono"

const languages = new Hono()

languages.get("/languages", async (_c) => {
    const file = Bun.file("./src/views/languages.html")
    return new Response(file)
})

export default languages

import { Hono } from "hono"

const jrdoc = new Hono()

jrdoc.get("/jrdoc", async (_c) => {
    const file = Bun.file("./src/views/jrdoc.html")
    return new Response(file)
})

export default jrdoc

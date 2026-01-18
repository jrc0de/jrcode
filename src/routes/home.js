import { Hono } from "hono"

const home = new Hono()

home.get("/", async (c) => {
    const file = Bun.file("./src/views/home.html")
    return new Response(file)
})

export default home

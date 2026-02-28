import { Hono } from "hono"

const portfolio = new Hono()

portfolio.get("/", async (_c) => {
    const file = Bun.file("./src/views/portfolio.html")
    return new Response(file)
})

export default portfolio

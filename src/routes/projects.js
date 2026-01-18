import { Hono } from "hono"

const projects = new Hono()

projects.get("/projects", async (_c) => {
    const file = Bun.file("./src/views/projects.html")
    return new Response(file)
})

export default projects

export default async function (fastify, opts) {
    fastify.get("/", async (req, reply) => {
        return reply.view("/pages/home.eta")
    })
}

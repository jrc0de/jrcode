export default async function (fastify, opts) {
    fastify.get("/rss", async (req, reply) => {
        return reply.view("/pages/rss.eta")
    })
}

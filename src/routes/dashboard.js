export default async function (fastify, opts) {
  fastify.get('/dashboard', async (req, reply) => {
    return reply.view('/pages/dashboard.eta')
  })
}

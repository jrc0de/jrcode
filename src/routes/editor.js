export default async function (fastify, opts) {
  fastify.get('/editor', async (req, reply) => {
    return reply.view('/pages/editor.eta')
  })
}

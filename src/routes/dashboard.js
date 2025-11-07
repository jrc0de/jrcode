import { getTrackingInfo } from '../services/tracking.js'

export default async function (fastify, opts) {
  fastify.get('/dashboard', async (req, reply) => {
    const stats = await getTrackingInfo()
    return reply.view('/pages/dashboard.eta', { stats })
  })
}
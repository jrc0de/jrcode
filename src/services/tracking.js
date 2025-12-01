import { pool } from './database.js'

export async function getTrackingInfo () {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        ROUND((COUNT(vie_b) / COUNT(*)) * 100, 2) as stat_short,
        ROUND((COUNT(vie_l) / COUNT(*)) * 100, 2) as stat_long,
        ROUND((COUNT(img) / COUNT(*)) * 100, 2) as stat_img
      FROM vies
    `)

    const stat = rows[0]

    return {
      stat_short: stat.stat_short,
      stat_long: stat.stat_long,
      stat_img: stat.stat_img
    }
  } catch (err) {
    throw new Error(
      'Erreur lors de la récupération des informations de tracking : ' + err.message
    )
  }
}

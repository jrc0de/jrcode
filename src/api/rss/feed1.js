import * as cheerio from 'cheerio'

let cachedVideos = null
let lastFetch = 0
const CACHE_DURATION = 30 * 60 * 1000

async function scrapeOrthodoxieVideos () {
  const now = Date.now()

  // Retourner le cache si valide
  if (cachedVideos && (now - lastFetch) < CACHE_DURATION) {
    return cachedVideos
  }

  try {
    const response = await fetch('https://www.france.tv/france-2/orthodoxie/')
    const html = await response.text()
    const $ = cheerio.load(html)

    const videos = []

    // Sélectionner tous les <li> dans le <ul class="ilQkaT">
    $('ul.ilQkaT li').each((i, element) => {
      const $li = $(element)
      const $link = $li.find('a').first()
      const link = $link.attr('href')

      // Récupérer le titre
      const title = $link.find('h3, .title, [class*="title"]').text().trim() ||
                       $link.attr('title') ||
                       $link.attr('aria-label') ||
                       'Émission Orthodoxie'

      // Récupérer l'image
      const $img = $li.find('img').first()
      const image = $img.attr('src') || $img.attr('data-src')

      // Récupérer la description si disponible
      const description = $li.find('p, .description, [class*="description"]').text().trim() ||
                             'Émission Orthodoxie sur France 2'

      // Récupérer la durée si disponible
      const duration = $li.find('[class*="duration"]').text().trim()

      if (link) {
        videos.push({
          title,
          link: link.startsWith('http') ? link : `https://www.france.tv${link}`,
          description,
          image: image && image.startsWith('http') ? image : (image ? `https://www.france.tv${image}` : null),
          duration,
          pubDate: new Date().toUTCString()
        })
      }
    })

    cachedVideos = videos
    lastFetch = now

    console.log(`✅ ${videos.length} vidéos scrapées`)

    return videos
  } catch (error) {
    console.error('❌ Erreur lors du scraping:', error)
    return cachedVideos || []
  }
}

function generateRSSFromVideos (videos) {
  if (videos.length === 0) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Orthodoxie - France 2</title>
    <link>https://www.france.tv/france-2/orthodoxie/</link>
    <description>Les dernières émissions d'Orthodoxie sur France 2</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <item>
      <title>Aucune vidéo disponible</title>
      <description>Impossible de récupérer les vidéos pour le moment</description>
    </item>
  </channel>
</rss>`
  }

  const items = videos.map(video => `
    <item>
      <title><![CDATA[${video.title}]]></title>
      <link>${video.link}</link>
      <description><![CDATA[${video.description}${video.duration ? ` - Durée: ${video.duration}` : ''}]]></description>
      ${video.image ? `<enclosure url="${video.image}" type="image/jpeg" />` : ''}
      <pubDate>${video.pubDate}</pubDate>
      <guid>${video.link}</guid>
    </item>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Orthodoxie - France 2</title>
    <link>https://www.france.tv/france-2/orthodoxie/</link>
    <description>Les dernières émissions d'Orthodoxie sur France 2</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`
}

export default async function (fastify, opts) {
  fastify.get('/feed1', async (request, reply) => {
    const videos = await scrapeOrthodoxieVideos()
    const rss = generateRSSFromVideos(videos)

    return reply
      .type('application/rss+xml; charset=utf-8')
      .send(rss)
  })
}

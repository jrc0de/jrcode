import * as cheerio from 'cheerio'

// Cache en mémoire
const cache = {
  data: null,
  timestamp: null
}

const CACHE_DURATION = 3 * 60 * 60 * 1000

async function scrapeVaquiVideos () {
  // Vérifier le cache
  const now = Date.now()
  if (cache.data && cache.timestamp && (now - cache.timestamp < CACHE_DURATION)) {
    console.log('✨ Utilisation du cache Vaqui (age: ' + Math.round((now - cache.timestamp) / 1000 / 60) + ' min)')
    return cache.data
  }

  console.log('🔄 Cache Vaqui expiré ou vide, récupération des données...')
  try {
    const response = await fetch(
      'https://www.france.tv/france-3/provence-alpes-cote-d-azur/vaqui/toutes-les-videos/',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Trouve le main
    const main = $('main')
    if (!main.length) {
      console.log('❌ Aucun <main> trouvé')
      return []
    }

    // Trouve le h1 dans le main
    const h1 = main.find('h1').first()
    if (!h1.length) {
      console.log('❌ Aucun <h1> trouvé dans <main>')
      return []
    }

    // Trouve le premier ul après le h1
    let ul = null
    h1.nextAll().each((i, elem) => {
      if (elem.name === 'ul' && !ul) {
        ul = $(elem)
        return false // break
      }
      // Cherche aussi dans les enfants des éléments suivants
      const foundUl = $(elem).find('ul').first()
      if (foundUl.length && !ul) {
        ul = foundUl
        return false
      }
    })

    if (!ul) {
      console.log('❌ Aucun <ul> trouvé après le <h1>')
      return []
    }

    // Extraire les vidéos
    const videos = []
    ul.find('li').each((i, li) => {
      const $li = $(li)
      const lien = $li.find('a').attr('href') || ''
      const titre = $li.find('span[data-type="title"]').first().text().trim() || ''
      const sousTitre = $li.find('span[data-type="subtitle"]').first().text().trim() || ''
      const description = $li.find('p, .fLAmAH').first().text().trim() || ''

      // Cherche le texte contenant "Diffusé le"
      let dateText = ''
      $li.find('*').each((j, elem) => {
        const text = $(elem).text()
        if (text.includes('Diffusé le')) {
          dateText = text
          return false
        }
      })

      const titreComplet = sousTitre ? `${sousTitre} - ${titre}` : titre

      videos.push({
        title: titreComplet,
        link: lien.startsWith('http') ? lien : `https://www.france.tv${lien}`,
        description,
        pubDate: dateText.replace('Diffusé le ', '').trim()
      })
    })

    console.log(`✅ ${videos.length} vidéos récupérées`)

    // Mettre en cache
    cache.data = videos
    cache.timestamp = Date.now()

    return videos
  } catch (error) {
    console.error('❌ Erreur de récupération:', error.message)
    return []
  }
}

// Convertir une date française en RFC-822 (UTC)
function convertirDateFrancaise (dateStr) {
  try {
    if (!dateStr) throw new Error('Empty date')

    const [jour, mois, annee] = dateStr.split('/')
    const date = new Date(Date.UTC(annee, mois - 1, jour, 0, 0, 0))
    if (isNaN(date.getTime())) throw new Error('Invalid date')

    return date.toUTCString()
  } catch {
    return new Date().toUTCString()
  }
}

// Génération RSS
function generateRSSFromVideos (videos) {
  const feedUrl = 'https://www.jrcode.name/rss/feed2'

  if (videos.length === 0) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <title>Vaqui - France 3</title>
    <link>https://www.france.tv/france-3/provence-alpes-cote-d-azur/vaqui</link>
    <description>Les dernières émissions Vaqui sur France 3</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <item>
      <title>Aucune vidéo disponible</title>
      <description>Impossible de récupérer les vidéos pour le moment</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
  </channel>
</rss>`
  }

  const items = videos
    .map(
      (video) => `
    <item>
      <title><![CDATA[${video.title}]]></title>
      <link>${video.link}</link>
      <description><![CDATA[${video.description}]]></description>
      <pubDate>${convertirDateFrancaise(video.pubDate)}</pubDate>
      <guid>${video.link}</guid>
    </item>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <title>Vaqui - France 3</title>
    <link>https://www.france.tv/france-3/provence-alpes-cote-d-azur/vaqui</link>
    <description>Les dernières émissions Vaqui sur France 3</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`
}

// Route Fastify pour le flux RSS
export default async function (fastify, opts) {
  fastify.get('/feed2', async (request, reply) => {
    const videos = await scrapeVaquiVideos()
    const rss = generateRSSFromVideos(videos)
    return reply.type('application/rss+xml; charset=utf-8').send(rss)
  })
}

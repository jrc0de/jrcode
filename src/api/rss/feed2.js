import puppeteer from 'puppeteer'

async function scrapeVaquiVideos() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // 🔑 nécessaire pour Linux root
  })
  const page = await browser.newPage()

  try {
    // User-Agent non-déprécié
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0'
    })

    console.log('🌐 Chargement de la page...')
    await page.goto(
      'https://www.france.tv/france-3/provence-alpes-cote-d-azur/vaqui/toutes-les-videos/',
      { waitUntil: 'domcontentloaded', timeout: 30000 }
    )

    // Attente pour que le JS rende le contenu
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log('📋 Extraction des vidéos depuis le premier <ul> après le <h1>...')
    const videos = await page.evaluate(() => {
      const main = document.querySelector('main')
      if (!main) return []

      const h1 = main.querySelector('h1')
      if (!h1) return []

      // Trouver le premier <ul> après le <h1>
      function findNextUL(node) {
        const walker = document.createTreeWalker(main, NodeFilter.SHOW_ELEMENT)
        let foundH1 = false
        while (walker.nextNode()) {
          const el = walker.currentNode
          if (el === h1) {
            foundH1 = true
            continue
          }
          if (foundH1 && el.tagName.toLowerCase() === 'ul') {
            return el
          }
        }
        return null
      }

      const ul = findNextUL(main)
      if (!ul) return []

      return Array.from(ul.querySelectorAll('li')).map((li) => {
        const lien = li.querySelector('a')?.href || ''
        const titre = li.querySelector('span[data-type="title"]')?.textContent?.trim() || ''
        const sousTitre = li.querySelector('span[data-type="subtitle"]')?.textContent?.trim() || ''
        const description = li.querySelector('p, .fLAmAH')?.textContent?.trim() || ''
        const dateText = [...li.querySelectorAll('*')]
          .map((n) => n.textContent)
          .find((txt) => txt.includes('Diffusé le')) || ''
        const titreComplet = sousTitre ? `${sousTitre} - ${titre}` : titre

        return {
          title: titreComplet,
          link: lien,
          description,
          pubDate: dateText.replace('Diffusé le ', '').trim()
        }
      })
    })

    console.log(`✅ ${videos.length} vidéos récupérées`)
    return videos
  } catch (error) {
    console.error('❌ Erreur Puppeteer:', error.message)
    return []
  } finally {
    await browser.close()
  }
}

// Convertir une date française en UTC
function convertirDateFrancaise(dateStr) {
  try {
    const [jour, mois, annee] = dateStr.split('/')
    const date = new Date(annee, mois - 1, jour)
    return date.toUTCString()
  } catch {
    return new Date().toUTCString()
  }
}

// Génération RSS
function generateRSSFromVideos(videos) {
  if (videos.length === 0) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Vaqui - France 3</title>
    <link>https://www.france.tv/france-3/provence-alpes-cote-d-azur/vaqui</link>
    <description>Les dernières émissions Vaqui sur France 3</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <item>
      <title>Aucune vidéo disponible</title>
      <description>Impossible de récupérer les vidéos pour le moment</description>
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

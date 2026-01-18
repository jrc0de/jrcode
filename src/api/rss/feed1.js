import axios from "axios"
import * as cheerio from "cheerio"

// Cache en mémoire
const cache = {
    data: null,
    timestamp: null,
}

const CACHE_DURATION = 3 * 60 * 60 * 1000

async function scrapeOrthodoxieVideos() {
    // Vérifier le cache
    const now = Date.now()
    if (cache.data && cache.timestamp && now - cache.timestamp < CACHE_DURATION) {
        console.log("✨ Utilisation du cache Orthodoxie (age: " + Math.round((now - cache.timestamp) / 1000 / 60) + " min)")
        return cache.data
    }

    console.log("🔄 Cache Orthodoxie expiré ou vide, récupération des données...")

    try {
        const { data: html } = await axios.get("https://www.france.tv/france-2/orthodoxie/toutes-les-videos/", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
                Referer: "https://www.france.tv/",
                Connection: "keep-alive",
            },
            timeout: 15000,
        })

        const $ = cheerio.load(html)
        const videos = []

        // sélecteur principal
        const ul = $("ul.cYdhWw.bYqadz.dsmMTm.hsLHiM.gsLiKq.iAgshX.gsLiKH.fqiJkQ.bYPznK")

        ul.find("li").each((i, elem) => {
            try {
                const lien = $(elem).find("a.lnMwsN").attr("href")
                const titreElement = $(elem).find('span[data-type="title"]').first()
                const sousTitreElement = $(elem).find('span[data-type="subtitle"]').first()

                const titre = titreElement.text().trim()
                const sousTitre = sousTitreElement.text().trim()
                const titreComplet = sousTitre ? `${sousTitre} - ${titre}` : titre

                const description = $(elem).find(".fLAmAH").text().trim()

                const dateText = $(elem)
                    .find(".gxLqec")
                    .filter(function () {
                        return $(this).text().includes("Diffusé le")
                    })
                    .text()
                    .trim()

                const lienComplet = lien ? `https://www.france.tv${lien}` : ""

                if (titreComplet && lienComplet) {
                    videos.push({
                        title: titreComplet,
                        link: lienComplet,
                        description: description || "",
                        pubDate: convertirDateFrancaise(dateText.replace("Diffusé le ", "")),
                    })
                }
            } catch (err) {
                console.error(`Erreur sur l'élément ${i}:`, err.message)
            }
        })

        console.log(`✅ ${videos.length} vidéos scrapées`)

        // Mettre en cache
        cache.data = videos
        cache.timestamp = Date.now()

        return videos
    } catch (error) {
        console.error("❌ Erreur lors du scraping:", error.message)
        return []
    }
}

function convertirDateFrancaise(dateStr) {
    try {
        const [jour, mois, annee] = dateStr.split("/")
        const date = new Date(annee, mois - 1, jour)
        return date.toUTCString()
    } catch {
        return new Date().toUTCString()
    }
}

function generateRSSFromVideos(videos) {
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

    const items = videos
        .map(
            (video) => `
    <item>
      <title><![CDATA[${video.title}]]></title>
      <link>${video.link}</link>
      <description><![CDATA[${video.description}]]></description>
      <pubDate>${video.pubDate}</pubDate>
      <guid>${video.link}</guid>
    </item>`,
        )
        .join("")

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
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
    fastify.get("/feed1", async (request, reply) => {
        console.log(`📥 Requête /feed2 - IP: ${request.ip} - UA: ${request.headers["user-agent"]?.substring(0, 50)}...`)
        const videos = await scrapeOrthodoxieVideos()
        const rss = generateRSSFromVideos(videos)
        return reply.type("application/rss+xml; charset=utf-8").send(rss)
    })
}

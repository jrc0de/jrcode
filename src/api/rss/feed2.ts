import { Hono } from "hono"
import * as cheerio from "cheerio"
import type { AnyNode } from "domhandler"
import type { Cheerio } from "cheerio"

interface Video {
    title: string
    link: string
    description: string
    pubDate: string
}

interface Cache {
    data: Video[] | null
    timestamp: number | null
}

const app = new Hono()

const cache: Cache = {
    data: null,
    timestamp: null,
}

const CACHE_DURATION = 3 * 60 * 60 * 1000

async function scrapeVaquiVideos(): Promise<Video[]> {
    const now = Date.now()
    if (cache.data && cache.timestamp && now - cache.timestamp < CACHE_DURATION) {
        console.log("✨ Utilisation du cache Vaqui (age: " + Math.round((now - cache.timestamp) / 1000 / 60) + " min)")
        return cache.data
    }

    console.log("🔄 Cache Vaqui expiré ou vide, récupération des données...")
    try {
        const response = await fetch("https://www.france.tv/france-3/provence-alpes-cote-d-azur/vaqui/toutes-les-videos/", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "fr-FR,fr;q=0.9",
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        const main = $("main")
        if (!main.length) {
            console.log("❌ Aucun <main> trouvé")
            return []
        }

        const h1 = main.find("h1").first()
        if (!h1.length) {
            console.log("❌ Aucun <h1> trouvé dans <main>")
            return []
        }

        let ul: Cheerio<AnyNode> | null = null
        h1.nextAll().each((_, elem) => {
            if (elem.type === "tag" && elem.name === "ul" && !ul) {
                ul = $(elem)
                return false
            }
            const foundUl = $(elem).find("ul").first()
            if (foundUl.length && !ul) {
                ul = foundUl
                return false
            }
        })

        if (!ul) {
            console.log("❌ Aucun <ul> trouvé après le <h1>")
            return []
        }

        const videos: Video[] = []
        ;(ul as Cheerio<AnyNode>).find("li").each((_, li: AnyNode) => {
            const $li = $(li)
            const lien = $li.find("a").attr("href") ?? ""
            const titre = $li.find('span[data-type="title"]').first().text().trim()
            const sousTitre = $li.find('span[data-type="subtitle"]').first().text().trim()
            const description = $li.find("p, .fLAmAH").first().text().trim()

            let dateText = ""
            $li.find("*").each((_, elem) => {
                const text = $(elem).text()
                if (text.includes("Diffusé le")) {
                    dateText = text
                    return false
                }
            })

            const titreComplet = sousTitre ? `${sousTitre} - ${titre}` : titre

            videos.push({
                title: titreComplet,
                link: lien.startsWith("http") ? lien : `https://www.france.tv${lien}`,
                description,
                pubDate: dateText.replace("Diffusé le ", "").trim(),
            })
        })

        console.log(`✅ ${videos.length} vidéos récupérées`)

        cache.data = videos
        cache.timestamp = Date.now()

        return videos
    } catch (error) {
        console.error("❌ Erreur de récupération:", error instanceof Error ? error.message : error)
        return []
    }
}

function convertirDateFrancaise(dateStr: string): string {
    try {
        if (!dateStr) throw new Error("Empty date")

        const [jour, mois, annee] = dateStr.split("/")
        const date = new Date(Date.UTC(Number(annee), Number(mois) - 1, Number(jour), 0, 0, 0))
        if (isNaN(date.getTime())) throw new Error("Invalid date")

        return date.toUTCString()
    } catch {
        return new Date().toUTCString()
    }
}

function generateRSSFromVideos(videos: Video[]): string {
    const feedUrl = "https://www.jrcode.name/rss/feed2"

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
    </item>`,
        )
        .join("")

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

app.get("/rss/feed2", async (c) => {
    const ip = c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown"
    const userAgent = c.req.header("user-agent")?.substring(0, 50) ?? "unknown"
    console.log(`📥 Requête /feed2 - IP: ${ip} - UA: ${userAgent}...`)

    const videos = await scrapeVaquiVideos()
    const rss = generateRSSFromVideos(videos)

    return c.text(rss, 200, {
        "Content-Type": "application/rss+xml; charset=utf-8",
    })
})

export default app

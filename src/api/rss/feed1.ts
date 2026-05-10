import { Hono } from "hono"
import * as cheerio from "cheerio"

interface Video {
    id: number
    title: string
    link: string
    description: string
    duration: string
    pubDate: string
    thumbnail: string
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
const BASE_URL = "https://www.france.tv"
const PLAYLIST_URL = `${BASE_URL}/france-2/orthodoxie/toutes-les-videos/`

// ── Extraction des vidéos depuis les blocs __next_f ───────────────────────────
function extractVideosFromNextData($: ReturnType<typeof cheerio.load>): Video[] {
    const videos: Video[] = []

    $("script").each((_, el) => {
        const content = $(el).html() ?? ""
        if (!content.includes('\\"items\\"')) return

        const match = content.match(/\\"items\\":\s*(\[[\s\S]+?\])\s*,\s*\\"variant\\"/)
        if (!match?.[1]) return

        const unescaped = match[1]
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, "\\")
            .replace(/\\n/g, "\n")
            .replace(/\\r/g, "\r")
            .replace(/\\t/g, "\t")
            .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))

        try {
            const items = JSON.parse(unescaped)
            for (const item of items) {
                const c = item?.content
                if (!c?.id) continue
                videos.push({
                    id: c.id,
                    title: c.title ?? "",
                    link: c.url?.startsWith("http") ? c.url : `${BASE_URL}${c.url}`,
                    description: c.description ?? "",
                    duration: c.duration ?? "",
                    pubDate: c.isoDate ?? "",
                    thumbnail: c.images?.base?.x1 ?? "",
                })
            }
        } catch (e) {
            console.error("❌ Parse error items:", e)
        }
    })

    return videos
}

// ── Détection du nombre de pages ──────────────────────────────────────────────
function getTotalPages($: ReturnType<typeof cheerio.load>): number {
    let last = 0

    $("script").each((_, el) => {
        const content = $(el).html() ?? ""
        const match = content.match(/\\"last\\":\s*(\d+)/)
        if (match?.[1]) last = Math.max(last, parseInt(match[1]))
    })

    return last + 1
}

// ── Fetch d'une page ──────────────────────────────────────────────────────────
async function fetchPage(url: string) {
    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "fr-FR,fr;q=0.9",
        },
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const html = await response.text()
    return cheerio.load(html)
}

// ── Scraper principal ─────────────────────────────────────────────────────────
async function scrapeOrthodoxieVideos(): Promise<Video[]> {
    const now = Date.now()
    if (cache.data && cache.timestamp && now - cache.timestamp < CACHE_DURATION) {
        const age = Math.round((now - cache.timestamp) / 1000 / 60)
        console.log(`✨ Utilisation du cache Orthodoxie (age: ${age} min)`)
        return cache.data
    }

    console.log("🔄 Cache Orthodoxie expiré ou vide, récupération des données...")

    try {
        const $ = await fetchPage(PLAYLIST_URL)
        const totalPages = getTotalPages($)
        console.log(`📄 ${totalPages} page(s) détectée(s)`)

        const allVideos = extractVideosFromNextData($)
        console.log(`  Page 1 → ${allVideos.length} vidéos`)

        for (let page = 2; page <= totalPages; page++) {
            await new Promise((r) => setTimeout(r, 800))
            const $p = await fetchPage(`${PLAYLIST_URL}?page=${page}`)
            const videos = extractVideosFromNextData($p)
            console.log(`  Page ${page} → ${videos.length} vidéos`)
            allVideos.push(...videos)
        }

        console.log(`✅ ${allVideos.length} vidéos récupérées au total`)

        cache.data = allVideos
        cache.timestamp = Date.now()

        return allVideos
    } catch (error) {
        console.error("❌ Erreur de récupération:", error instanceof Error ? error.message : error)
        return []
    }
}

// ── Génération RSS ────────────────────────────────────────────────────────────
function generateRSSFromVideos(videos: Video[]): string {
    const feedUrl = "https://www.jrcode.name/rss/feed2"
    const channelLink = "https://www.france.tv/france-2/orthodoxie"

    if (videos.length === 0) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <title>Orthodoxie - France 2</title>
    <link>${channelLink}</link>
    <description>Les dernières émissions Orthodoxie sur France 2</description>
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
      <pubDate>${new Date(video.pubDate).toUTCString()}</pubDate>
      <guid>${video.link}</guid>
      <enclosure url="${video.thumbnail}" type="image/webp" length="0" />
    </item>`,
        )
        .join("")

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <title>Orthodoxie - France 2</title>
    <link>${channelLink}</link>
    <description>Les dernières émissions Orthodoxie sur France 2</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`
}

// ── Route ─────────────────────────────────────────────────────────────────────
app.get("/rss/feed2", async (c) => {
    const ip = c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown"
    const userAgent = c.req.header("user-agent")?.substring(0, 50) ?? "unknown"
    console.log(`📥 Requête /feed2 - IP: ${ip} - UA: ${userAgent}...`)

    const videos = await scrapeOrthodoxieVideos()
    const rss = generateRSSFromVideos(videos)

    return c.text(rss, 200, {
        "Content-Type": "application/rss+xml; charset=utf-8",
    })
})

export default app

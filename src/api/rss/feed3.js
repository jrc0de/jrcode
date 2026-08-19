import { Hono } from "hono"

const app = new Hono()

const SOURCE_URL = "https://schola-sainte-cecile.com/feed/"
const FEED_URL = "https://www.jrcode.cloud/rss/feed3"

const cache = { data: null, timestamp: null }
const CACHE_DURATION = 60 * 60 * 1000

function extractTag(xml, tag) {
    const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`))
    return match ? (match[1] ?? match[2] ?? "").trim() : ""
}

async function fetchAndFilterFeed() {
    const now = Date.now()
    if (cache.data && cache.timestamp && now - cache.timestamp < CACHE_DURATION) {
        const age = Math.round((now - cache.timestamp) / 1000 / 60)
        console.log(`✨ Utilisation du cache schola (age: ${age} min)`)
        return cache.data
    }

    console.log("🔄 Cache schola expiré ou vide, récupération du flux...")

    const response = await fetch(SOURCE_URL, {
        headers: {
            "User-Agent": "Mozilla/5.0 (compatible; RSSProxy/1.0)",
            Accept: "application/rss+xml, application/xml, text/xml",
        },
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const xml = await response.text()

    // Extraire les métadonnées du channel
    const channelBlock = xml.match(/<channel>([\s\S]*?)<item>/)?.[1] ?? ""
    const title = extractTag(channelBlock, "title") || "Schola Sainte Cecile"
    const link = extractTag(channelBlock, "link") || "https://schola-sainte-cecile.com"
    const description = extractTag(channelBlock, "description") || "Liturgie & musique sacrée traditionnelles"
    const language = extractTag(channelBlock, "language") || "fr-FR"

    // Extraire tous les <item>...</item>
    const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]

    // Filtrer : garder uniquement ceux qui n'ont pas la catégorie "Programmes"
    const filteredItems = itemMatches
        .filter(([fullItem]) => {
            const categories = [...fullItem.matchAll(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g)].map(([, cat]) => cat.trim())
            return !categories.includes("Programmes")
        })
        .map(([fullItem]) => fullItem)

    console.log(`✅ ${filteredItems.length} articles conservés (Programmes exclus)`)

    const result = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <title>${title}</title>
    <link>${link}</link>
    <description>${description}</description>
    <language>${language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${filteredItems.join("\n    ")}
  </channel>
</rss>`

    cache.data = result
    cache.timestamp = Date.now()
    return result
}

app.get("/rss/feed3", async (c) => {
    try {
        const xml = await fetchAndFilterFeed()
        return c.body(xml, 200, { "Content-Type": "application/rss+xml; charset=UTF-8" })
    } catch (error) {
        console.error("❌ Erreur schola:", error instanceof Error ? error.message : error)
        return c.body(
            `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Schola Sainte Cecile - Erreur</title>
  <description>Impossible de récupérer le flux source.</description>
</channel></rss>`,
            503,
            { "Content-Type": "application/rss+xml; charset=UTF-8" },
        )
    }
})

export default app

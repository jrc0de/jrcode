import * as cheerio from "cheerio"

const BASE_URL = "https://www.france.tv"

function extractVideosFromNextData($) {
    const videos = []

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
            console.debug("🔍 Contenu brut:", unescaped.substring(0, 200))
        }
    })

    return videos
}

function getTotalPages($) {
    let last = 0
    $("script").each((_, el) => {
        const content = $(el).html() ?? ""
        const match = content.match(/\\"last\\":\s*(\d+)/)
        if (match?.[1]) last = Math.max(last, parseInt(match[1]))
    })
    return last + 1
}

async function fetchPage(url) {
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

export async function scrapeVideos(config, cache, cacheDuration) {
    const now = Date.now()
    if (cache.data && cache.timestamp && now - cache.timestamp < cacheDuration) {
        const age = Math.round((now - cache.timestamp) / 1000 / 60)
        console.log(`✨ Utilisation du cache ${config.title} (age: ${age} min)`)
        return cache.data
    }

    console.log(`🔄 Cache ${config.title} expiré ou vide, récupération des données...`)

    try {
        const $ = await fetchPage(config.playlistUrl)
        const totalPages = getTotalPages($)
        console.log(`📄 ${totalPages} page(s) détectée(s)`)

        const allVideos = extractVideosFromNextData($)
        console.log(`  Page 1 → ${allVideos.length} vidéos`)

        for (let page = 2; page <= totalPages; page++) {
            await new Promise((r) => setTimeout(r, 800))
            const $p = await fetchPage(`${config.playlistUrl}?page=${page}`)
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

export function generateRSS(videos, config) {
    if (videos.length === 0) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${config.feedUrl}" rel="self" type="application/rss+xml" />
    <title>${config.title}</title>
    <link>${config.link}</link>
    <description>${config.description}</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <item>
      <title>⚠️ ${config.title} - Aucune vidéo récupérée</title>
      <description><![CDATA[Le scraper n'a retourné aucune vidéo. France.tv a peut-être modifié sa structure HTML.]]></description>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
      <guid isPermaLink="false">${config.errorGuid}</guid>
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
    <atom:link href="${config.feedUrl}" rel="self" type="application/rss+xml" />
    <title>${config.title}</title>
    <link>${config.link}</link>
    <description>${config.description}</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`
}

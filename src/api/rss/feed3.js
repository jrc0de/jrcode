import { Hono } from "hono"
import * as cheerio from "cheerio"

const app = new Hono()

const cache = { data: null, timestamp: null }
const CACHE_DURATION = 3 * 60 * 60 * 1000
const MAX_PAGES = 5

const BASE_URL = "https://avis-deces.midilibre.fr"
const LIST_URL = `${BASE_URL}/gard-30/aimargues-30470/`

const config = {
    title: "Avis de décès - Aimargues",
    link: LIST_URL,
    description: "Derniers avis de décès à Aimargues (Midi Libre)",
    feedUrl: "https://www.jrcode.name/rss/feed3",
    errorGuid: "aimargues-scraper-error-static",
}

const MONTHS = {
    janvier: 0,
    février: 1,
    mars: 2,
    avril: 3,
    mai: 4,
    juin: 5,
    juillet: 6,
    août: 7,
    septembre: 8,
    octobre: 9,
    novembre: 10,
    décembre: 11,
}

function parseFrenchDate(text) {
    const m = text.toLowerCase().match(/(\d{1,2})\s+(\p{L}+)\s+(\d{4})/u)
    if (!m || MONTHS[m[2]] === undefined) return null
    return new Date(Date.UTC(+m[3], MONTHS[m[2]], +m[1], 12))
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
    return cheerio.load(await response.text())
}

function getTotalPages($) {
    let max = 1
    $(".pagination a.page-link").each((_, el) => {
        const m = ($(el).attr("href") ?? "").match(/page-(\d+)/)
        if (m) max = Math.max(max, parseInt(m[1]))
    })
    return Math.min(max, MAX_PAGES)
}

function extractAvis($) {
    const avis = []
    $(".avis-list")
        .first()
        .find("article.avis")
        .each((_, el) => {
            const $el = $(el)
            const a = $el.find(".avis__name a").first()
            const href = a.attr("href")
            const title = a.text().replace(/\s+/g, " ").trim()
            if (!href || !title) return

            const location = $el.find(".avis__location").text().trim()
            const text = $el.find(".avis__text").text().trim()

            avis.push({
                title,
                link: href.startsWith("http") ? href : `${BASE_URL}${href}`,
                description: [location, text].filter(Boolean).join(" — "),
                date: parseFrenchDate($el.find(".avis__published-time").text()),
            })
        })
    return avis
}

async function scrapeAvis() {
    const now = Date.now()
    if (cache.data && cache.timestamp && now - cache.timestamp < CACHE_DURATION) {
        const age = Math.round((now - cache.timestamp) / 1000 / 60)
        console.log(`✨ Utilisation du cache ${config.title} (age: ${age} min)`)
        return cache.data
    }

    console.log(`🔄 Cache ${config.title} expiré ou vide, récupération des données...`)

    try {
        const $ = await fetchPage(LIST_URL)
        const totalPages = getTotalPages($)
        console.log(`📄 ${totalPages} page(s) détectée(s)`)

        const all = extractAvis($)
        console.log(`  Page 1 → ${all.length} avis`)

        for (let page = 2; page <= totalPages; page++) {
            await new Promise((r) => setTimeout(r, 800))
            const $p = await fetchPage(`${LIST_URL}page-${page}`)
            const avis = extractAvis($p)
            console.log(`  Page ${page} → ${avis.length} avis`)
            all.push(...avis)
        }

        console.log(`✅ ${all.length} avis récupérés au total`)
        cache.data = all
        cache.timestamp = Date.now()
        return all
    } catch (error) {
        console.error("❌ Erreur de récupération:", error instanceof Error ? error.message : error)
        return []
    }
}

// Évite de casser le CDATA si le texte contient "]]>"
const cdata = (s) => `<![CDATA[${String(s).replace(/]]>/g, "]]]]><![CDATA[>")}]]>`

function generateAvisRSS(avis) {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${config.feedUrl}" rel="self" type="application/rss+xml" />
    <title>${config.title}</title>
    <link>${config.link}</link>
    <description>${config.description}</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`

    if (avis.length === 0) {
        return `${header}
    <item>
      <title>⚠️ ${config.title} - Aucun avis récupéré</title>
      <description><![CDATA[Le scraper n'a retourné aucun avis. Midi Libre a peut-être modifié la structure de sa page ou bloqué la requête.]]></description>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
      <guid isPermaLink="false">${config.errorGuid}</guid>
    </item>
  </channel>
</rss>`
    }

    const items = avis
        .map(
            (a) => `
    <item>
      <title>${cdata(a.title)}</title>
      <link>${a.link}</link>
      <description>${cdata(a.description)}</description>
      ${a.date ? `<pubDate>${a.date.toUTCString()}</pubDate>` : ""}
      <guid>${a.link}</guid>
    </item>`,
        )
        .join("")

    return `${header}${items}
  </channel>
</rss>`
}

app.get("/rss/feed3", async (c) => {
    const ip = c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown"
    const userAgent = c.req.header("user-agent")?.substring(0, 50) ?? "unknown"
    console.log(`📥 Requête /feed3 - IP: ${ip} - UA: ${userAgent}...`)

    const avis = await scrapeAvis()
    return c.text(generateAvisRSS(avis), 200, {
        "Content-Type": "application/rss+xml; charset=utf-8",
    })
})

export default app

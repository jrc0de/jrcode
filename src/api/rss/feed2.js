import { Elysia } from "elysia"
import { scrapeVideos, generateRSS } from "./scraper"

const app = new Elysia()

const cache = {
    data: null,
    timestamp: null,
}

const CACHE_DURATION = 3 * 60 * 60 * 1000

const config = {
    title: "Vaqui - France 3",
    link: "https://www.france.tv/france-3/provence-alpes-cote-d-azur/vaqui",
    description: "Les dernières émissions Vaqui sur France 3",
    feedUrl: "https://www.jrcode.name/rss/feed2",
    playlistUrl: "https://www.france.tv/france-3/provence-alpes-cote-d-azur/vaqui/toutes-les-videos/",
    errorGuid: "vaqui-scraper-error-static",
}

app.get("/rss/feed2", async ({ headers }) => {
    const ip = headers["x-forwarded-for"] ?? headers["x-real-ip"] ?? "unknown"
    const userAgent = headers["user-agent"]?.substring(0, 50) ?? "unknown"
    console.log(`📥 Requête /feed2 - IP: ${ip} - UA: ${userAgent}...`)

    const videos = await scrapeVideos(config, cache, CACHE_DURATION)
    const rss = generateRSS(videos, config)

    return new Response(rss, {
        status: 200,
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
        },
    })
})

export default app

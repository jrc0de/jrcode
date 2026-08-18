import { Elysia } from "elysia"
import { scrapeVideos, generateRSS } from "./scraper"

const app = new Elysia()

const cache = {
    data: null,
    timestamp: null,
}

const CACHE_DURATION = 3 * 60 * 60 * 1000

const config = {
    title: "Orthodoxie - France 2",
    link: "https://www.france.tv/france-2/orthodoxie",
    description: "Les dernières émissions Orthodoxie sur France 2",
    feedUrl: "https://www.jrcode.name/rss/feed1",
    playlistUrl: "https://www.france.tv/france-2/orthodoxie/toutes-les-videos/",
    errorGuid: "orthodoxie-scraper-error-static",
}

app.get("/rss/feed1", async ({ headers }) => {
    const ip = headers["x-forwarded-for"] ?? headers["x-real-ip"] ?? "unknown"
    const userAgent = headers["user-agent"]?.substring(0, 50) ?? "unknown"
    console.log(`📥 Requête /feed1\n - IP: ${ip} - UA: ${userAgent}...`)

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

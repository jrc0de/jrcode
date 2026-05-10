import { Hono } from "hono"
import { type Video, type FeedConfig, scrapeVideos, generateRSS } from "./scraper"

const app = new Hono()

const cache: { data: Video[] | null; timestamp: number | null } = {
    data: null,
    timestamp: null,
}

const CACHE_DURATION = 3 * 60 * 60 * 1000

const config: FeedConfig = {
    title: "Vaqui - France 3",
    link: "https://www.france.tv/france-3/provence-alpes-cote-d-azur/vaqui",
    description: "Les dernières émissions Vaqui sur France 3",
    feedUrl: "https://www.jrcode.name/rss/feed2",
    playlistUrl: "https://www.france.tv/france-3/provence-alpes-cote-d-azur/vaqui/toutes-les-videos/",
    errorGuid: "vaqui-scraper-error-static",
}

app.get("/rss/feed2", async (c) => {
    const ip = c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown"
    const userAgent = c.req.header("user-agent")?.substring(0, 50) ?? "unknown"
    console.log(`📥 Requête /feed2 - IP: ${ip} - UA: ${userAgent}...`)

    const videos = await scrapeVideos(config, cache, CACHE_DURATION)
    return c.text(generateRSS(videos, config), 200, {
        "Content-Type": "application/rss+xml; charset=utf-8",
    })
})

export default app

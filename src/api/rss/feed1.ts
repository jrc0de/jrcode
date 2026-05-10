import { Hono } from "hono"
import { type Video, type FeedConfig, scrapeVideos, generateRSS } from "./scraper"

const app = new Hono()

const cache: { data: Video[] | null; timestamp: number | null } = {
    data: null,
    timestamp: null,
}

const CACHE_DURATION = 3 * 60 * 60 * 1000

const config: FeedConfig = {
    title: "Orthodoxie - France 2",
    link: "https://www.france.tv/france-2/orthodoxie",
    description: "Les dernières émissions Orthodoxie sur France 2",
    feedUrl: "https://www.jrcode.name/rss/feed1",
    playlistUrl: "https://www.france.tv/france-2/orthodoxie/toutes-les-videos/",
    errorGuid: "orthodoxie-scraper-error-static",
}

app.get("/rss/feed1", async (c) => {
    const ip = c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown"
    const userAgent = c.req.header("user-agent")?.substring(0, 50) ?? "unknown"
    console.log(`📥 Requête /feed1
 - IP: ${ip} - UA: ${userAgent}...`)

    const videos = await scrapeVideos(config, cache, CACHE_DURATION)
    return c.text(generateRSS(videos, config), 200, {
        "Content-Type": "application/rss+xml; charset=utf-8",
    })
})

export default app

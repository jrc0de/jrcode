// Route de debug - À RETIRER après diagnostic
export default async function (fastify, opts) {
    fastify.get('/debug', async (request, reply) => {
        try {
            const { data } = await axios.get(URL_A_SCRAPER, {
                headers: {
                    'User-Agent': getRandomUserAgent(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'fr-FR,fr;q=0.9',
                    'Referer': 'https://www.france.tv/'
                },
                timeout: 20000
            });

            const $ = cheerio.load(data);

            // Voir ce qui est reçu
            const ul = $('ul.cYdhWw').length;
            const allLis = $('li').length;
            const allLinks = $('a[href*="/orthodoxie/"]').length;

            reply.type('text/html').send(`
            <h1>Debug Scraping</h1>
            <p>UL trouvés avec classes spécifiques: ${ul}</p>
            <p>Total de LI: ${allLis}</p>
            <p>Liens orthodoxie: ${allLinks}</p>
            <hr>
            <h2>HTML brut (premiers 5000 caractères):</h2>
            <pre>${data.substring(0, 5000)}</pre>
        `);
        } catch (error) {
            reply.send({ error: error.message });
        }
    })
}
// server.js - Serveur RSS avec Fastify pour Railway
const fastify = require('fastify')({ logger: true });
const axios = require('axios');
const cheerio = require('cheerio');

const PORT = process.env.PORT || 3000;

// Cache du flux RSS (évite de scraper à chaque requête)
let cachedRSS = null;
let lastUpdate = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const URL_A_SCRAPER = 'https://www.france.tv/france-2/orthodoxie/toutes-les-videos/';

async function scrapeVideos() {
    try {
        fastify.log.info('🔄 Scraping en cours...');

        const { data } = await axios.get(URL_A_SCRAPER, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(data);
        const ul = $('ul.cYdhWw.bYqadz.dsmMTm.hsLHiM.gsLiKq.iAgshX.gsLiKH.fqiJkQ.bYPznK');
        const articles = [];

        ul.find('li').each((i, elem) => {
            try {
                const lien = $(elem).find('a.lnMwsN').attr('href');
                const titreElement = $(elem).find('span[data-type="title"]').first();
                const sousTitreElement = $(elem).find('span[data-type="subtitle"]').first();

                const titre = titreElement.text().trim();
                const sousTitre = sousTitreElement.text().trim();
                const titreComplet = sousTitre ? `${sousTitre} - ${titre}` : titre;

                const description = $(elem).find('.fLAmAH').text().trim();

                const dateText = $(elem).find('.gxLqec').filter(function () {
                    return $(this).text().includes('Diffusé le');
                }).text().trim();

                const lienComplet = lien ? `https://www.france.tv${lien}` : '';

                if (titreComplet && lienComplet) {
                    articles.push({
                        titre: titreComplet,
                        lien: lienComplet,
                        description: description || '',
                        date: dateText.replace('Diffusé le ', '')
                    });
                }
            } catch (err) {
                fastify.log.error(`Erreur article ${i}:`, err.message);
            }
        });

        fastify.log.info(`✅ ${articles.length} articles trouvés`);
        return articles;

    } catch (error) {
        fastify.log.error('❌ Erreur scraping:', error.message);
        throw error;
    }
}

function genererXMLRSS(articles) {
    const maintenant = new Date().toUTCString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Orthodoxie - France 2</title>
    <link>${URL_A_SCRAPER}</link>
    <description>Toutes les vidéos de l'émission Orthodoxie sur France 2</description>
    <lastBuildDate>${maintenant}</lastBuildDate>
    <language>fr</language>
    <atom:link href="https://votre-app.railway.app/rss" rel="self" type="application/rss+xml"/>
`;

    articles.forEach(article => {
        const pubDate = convertirDateFrancaise(article.date);
        xml += `
    <item>
      <title><![CDATA[${article.titre}]]></title>
      <link>${article.lien}</link>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${article.lien}</guid>
    </item>`;
    });

    xml += `
  </channel>
</rss>`;

    return xml;
}

function convertirDateFrancaise(dateStr) {
    try {
        const [jour, mois, annee] = dateStr.split('/');
        const date = new Date(annee, mois - 1, jour);
        return date.toUTCString();
    } catch {
        return new Date().toUTCString();
    }
}

async function getRSS() {
    const now = Date.now();

    // Utiliser le cache si disponible et encore valide
    if (cachedRSS && lastUpdate && (now - lastUpdate < CACHE_DURATION)) {
        fastify.log.info('📦 Utilisation du cache');
        return cachedRSS;
    }

    // Sinon, scraper et mettre en cache
    const articles = await scrapeVideos();
    cachedRSS = genererXMLRSS(articles);
    lastUpdate = now;

    return cachedRSS;
}

// Route principale - flux RSS
fastify.get('/rss', async (request, reply) => {
    try {
        const rss = await getRSS();
        reply
            .type('application/rss+xml; charset=utf-8')
            .header('Cache-Control', 'public, max-age=1800')
            .send(rss);
    } catch (error) {
        fastify.log.error('Erreur /rss:', error);
        reply.code(500).send('Erreur lors de la génération du flux RSS');
    }
});

// Route de test
fastify.get('/', async (request, reply) => {
    const host = request.headers.host || 'localhost:3000';
    const protocol = request.headers['x-forwarded-proto'] || 'http';

    reply.type('text/html; charset=utf-8').send(`
    <html>
      <head>
      <meta charset="UTF-8">
        <title>RSS Orthodoxie - France 2</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          h1 { color: #0055a4; }
          .link { background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 20px 0; }
          code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>📡 Flux RSS Orthodoxie - France 2</h1>
        <p>Flux RSS automatique pour l'émission Orthodoxie sur France 2.</p>
        
        <div class="link">
          <strong>URL du flux RSS:</strong><br>
          <code>${protocol}://${host}/rss</code>
        </div>
        
        <h2>Comment l'utiliser ?</h2>
        <ol>
          <li>Copiez l'URL ci-dessus</li>
          <li>Ajoutez-la dans votre lecteur RSS favori (Feedly, Inoreader, NetNewsWire, etc.)</li>
          <li>Le flux se met à jour automatiquement toutes les 30 minutes</li>
        </ol>
        
        <p><a href="/rss">Voir le flux RSS brut</a></p>
        <p><small>Dernière mise à jour: ${lastUpdate ? new Date(lastUpdate).toLocaleString('fr-FR') : 'Jamais'}</small></p>
      </body>
    </html>
  `);
});

// Health check pour Railway
fastify.get('/health', async (request, reply) => {
    reply.send({
        status: 'ok',
        lastUpdate: lastUpdate ? new Date(lastUpdate).toISOString() : null,
        uptime: process.uptime(),
        cacheValid: cachedRSS && lastUpdate && (Date.now() - lastUpdate < CACHE_DURATION)
    });
});

// Démarrer le serveur
const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        fastify.log.info(`🚀 Serveur RSS démarré sur le port ${PORT}`);
        fastify.log.info(`📡 Flux RSS disponible sur: http://localhost:${PORT}/rss`);

        // Pré-charger le cache au démarrage
        getRSS().catch(err => fastify.log.error('Erreur pré-chargement:', err));

        // Rafraîchir le cache toutes les 30 minutes
        setInterval(() => {
            fastify.log.info('🔄 Rafraîchissement automatique du cache...');
            getRSS().catch(err => fastify.log.error('Erreur refresh:', err));
        }, CACHE_DURATION);

    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
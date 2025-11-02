// Scraper RSS pour France TV
// npm install axios cheerio

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const URL_A_SCRAPER = 'https://www.france.tv/france-2/orthodoxie/toutes-les-videos/';

async function genererFluxRSS() {
  try {
    console.log('📡 Récupération de la page...');
    const { data } = await axios.get(URL_A_SCRAPER, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(data);
    
    // Trouver l'ul avec les classes spécifiques
    const ul = $('ul.cYdhWw.bYqadz.dsmMTm.hsLHiM.gsLiKq.iAgshX.gsLiKH.fqiJkQ.bYPznK');
    const articles = [];
    
    console.log(`🔍 Nombre d'ul trouvés: ${ul.length}`);
    
    // Parcourir chaque li dans cet ul
    ul.find('li').each((i, elem) => {
      try {
        // Récupérer le lien principal
        const lien = $(elem).find('a.lnMwsN').attr('href');
        
        // Extraire les infos depuis l'aria-label
        const ariaLabel = $(elem).find('a.lnMwsN').attr('aria-label');
        
        // Parser le titre et sous-titre
        const titreElement = $(elem).find('span[data-type="title"]').first();
        const sousTitreElement = $(elem).find('span[data-type="subtitle"]').first();
        
        const titre = titreElement.text().trim();
        const sousTitre = sousTitreElement.text().trim();
        const titreComplet = sousTitre ? `${sousTitre} - ${titre}` : titre;
        
        // Récupérer la description
        const description = $(elem).find('.fLAmAH').text().trim();
        
        // Récupérer la date de diffusion
        const dateText = $(elem).find('.gxLqec').filter(function() {
          return $(this).text().includes('Diffusé le');
        }).text().trim();
        
        // Construire l'URL complète
        const lienComplet = lien ? `https://www.france.tv${lien}` : '';
        
        if (titreComplet && lienComplet) {
          articles.push({
            titre: titreComplet,
            lien: lienComplet,
            description: description || '',
            date: dateText.replace('Diffusé le ', '')
          });
          
          console.log(`✅ Article ${i + 1}: ${titreComplet}`);
        }
      } catch (err) {
        console.error(`❌ Erreur sur l'article ${i + 1}:`, err.message);
      }
    });
    
    console.log(`\n📊 Total: ${articles.length} articles trouvés`);
    
    if (articles.length === 0) {
      console.log('⚠️  Aucun article trouvé. La structure HTML a peut-être changé.');
      return null;
    }
    
    // Générer le XML RSS
    const rss = genererXMLRSS(articles);
    
    // Écrire dans un fichier
    fs.writeFileSync('flux.xml', rss, 'utf8');
    console.log('✅ Flux RSS généré dans flux.xml');
    
    return rss;
  } catch (error) {
    console.error('❌ Erreur lors du scraping:', error.message);
    if (error.response) {
      console.error('Code HTTP:', error.response.status);
    }
  }
}

function genererXMLRSS(articles) {
  const maintenant = new Date().toUTCString();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Orthodoxie - France 2</title>
    <link>${URL_A_SCRAPER}</link>
    <description>Toutes les vidéos de l'émission Orthodoxie sur France 2</description>
    <lastBuildDate>${maintenant}</lastBuildDate>
`;

  articles.forEach(article => {
    xml += `
    <item>
      <title><![CDATA[${article.titre}]]></title>
      <link>${article.lien}</link>
      <description><![CDATA[${article.description}]]></description>
      ${article.date ? `<pubDate>${convertirDateFrancaise(article.date)}</pubDate>` : ''}
      <guid>${article.lien}</guid>
    </item>`;
  });

  xml += `
  </channel>
</rss>`;

  return xml;
}

function convertirDateFrancaise(dateStr) {
  // Format: "01/11/2025" ou "12/10/2025"
  try {
    const [jour, mois, annee] = dateStr.split('/');
    const date = new Date(annee, mois - 1, jour);
    return date.toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

// Exécuter
genererFluxRSS();

// Pour automatiser avec un cron job:
// */30 * * * * cd /chemin/du/script && node scraper.js
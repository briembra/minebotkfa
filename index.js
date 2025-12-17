const mineflayer = require('mineflayer');
const http = require('http');

// --- 1. WEBSERVER VOOR RENDER (OM ONLINE TE BLIJVEN) ---
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('✅ DonutBot is online!');
}).listen(port, () => {
  console.log(`Webserver actief op poort ${port}. Gebruik deze URL voor Cron-job.org`);
});

// --- 2. DE MINECRAFT BOT CONFIGURATIE ---
function createBot() {
  console.log('Poging tot inloggen...');

  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    // Gebruik process.env op Render, of vervang hieronder direct voor lokaal testen:
    username: process.env.MC_USERNAME || 'familiatejosurqueta@hotmail.com',
    version: '1.20.4', // Pas aan als de server een andere versie gebruikt
    hideErrors: true,
    checkTimeoutInterval: 90000 // Langer wachten bij drukke servers
  });

  // --- 3. BOT EVENTS (GEBEURTENISSEN) ---

  bot.on('login', () => {
    console.log('✅ Bot is ingelogd bij Microsoft!');
  });

  bot.on('spawn', () => {
    console.log('🎮 Bot is gespawned in de server!');
    bot.chat('/home'); // Optioneel: ga direct naar je home als dat nodig is
  });

  // Anti-AFK: Laat de bot elke 60 seconden een klein beetje bewegen
  setInterval(() => {
    if (bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }
  }, 60000);

  // Reconnect systeem: Als de verbinding verbreekt, probeer het na 30 sec opnieuw
  bot.on('end', (reason) => {
    console.log(`⚠️ Verbinding verbroken: ${reason}. Nieuwe poging over 30 seconden...`);
    setTimeout(createBot, 30000);
  });

  bot.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
      console.log(`❌ Kan niet verbinden met de host: ${err.address}`);
    } else {
      console.log(`Foutmelding: ${err}`);
    }
  });

  // Reageer op chat commando's (voor testen)
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message === '!status') {
      bot.chat('Ik ben 24/7 online op Render!');
    }
  });
}

// Start de bot voor de eerste keer
createBot();

// --- 4. ZELF-PING (OPTIONEEL) ---
// Vervang 'JOUWAPPNAAM' door de naam die je op Render hebt gekozen
const RENDER_URL = `https://JOUWAPPNAAM.onrender.com`; 
setInterval(() => {
  http.get(RENDER_URL, (res) => {
    console.log('Zelf-ping uitgevoerd');
  }).on('error', (err) => {
    console.log('Zelf-ping mislukt');
  });
}, 800000); // Elke 13 minuten

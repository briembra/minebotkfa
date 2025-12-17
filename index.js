const mineflayer = require('mineflayer');
const http = require('http');

// --- 1. WEBSERVER VOOR RENDER ---
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  const botCount = Object.keys(bots).length;
  res.end(`Bot Manager Status: Online. Actieve bots: ${botCount}`);
}).listen(port, () => {
  console.log(`Webserver actief op poort ${port}`);
});

const accountList = process.env.ACCOUNTS ? process.env.ACCOUNTS.split(',') : [];
const bots = {};

function startBot(email) {
  const cleanEmail = email.trim();
  if (!cleanEmail) return;

  console.log(`\n--- [${cleanEmail}] Inloggen op DonutSMP... ---`);

  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    username: cleanEmail,
    version: false, // Laat de bot zelf onderhandelen met de server
    hideErrors: true,
    checkTimeoutInterval: 120000, // Verhoogd naar 2 minuten voor trage verbindingen
    // Fake de login instellingen zodat het meer op een normale speler lijkt
    viewDistance: 'tiny',
    colorsEnabled: true,
  });

  // Microsoft Code opvangen
  bot.on('msa', (data) => {
    console.log(`\n[!] LOGIN VEREIST VOOR: ${cleanEmail}`);
    console.log(`[!] Ga naar: https://microsoft.com/link`);
    console.log(`[!] Code: ${data.user_code}\n`);
  });

  bot.on('login', () => {
    console.log(`✅ [${cleanEmail}] Ingelogd bij Microsoft.`);
  });

  bot.on('spawn', () => {
    console.log(`🎮 [${cleanEmail}] Succesvol op de server gespawned!`);
    // Wacht 2 seconden en spring dan even om te laten zien dat je er bent
    setTimeout(() => { bot.setControlState('jump', true); setTimeout(() => bot.setControlState('jump', false), 500); }, 2000);
  });

  bot.on('error', (err) => {
    console.log(`❌ [${cleanEmail}] Error: ${err.message}`);
  });

  bot.on('end', (reason) => {
    console.log(`⚠️ [${cleanEmail}] Verbinding verbroken: ${reason}`);
    
    // Belangrijk: Als de server ons weigert (socketClosed), wacht dan LANGER voordat we opnieuw proberen.
    // Anders ziet de server het als een aanval en word je IP-geband.
    const retryTime = reason === 'socketClosed' ? 60000 : 30000;
    console.log(`[${cleanEmail}] Opnieuw proberen over ${retryTime/1000} seconden...`);
    setTimeout(() => startBot(cleanEmail), retryTime);
  });

  bots[cleanEmail] = bot;
}

// Start de bots met een flinke pauze ertussen (30 seconden)
// Dit is cruciaal om socketClosed errors te voorkomen!
accountList.forEach((email, index) => {
  setTimeout(() => {
    startBot(email);
  }, index * 30000); 
});

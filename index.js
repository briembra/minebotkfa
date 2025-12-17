const mineflayer = require('mineflayer');
const http = require('http');

// --- 1. WEBSERVER VOOR RENDER ---
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  const botCount = Object.keys(bots).length;
  res.end(`✅ Bot Manager is online! Actieve bots: ${botCount}`);
}).listen(port, () => {
  console.log(`Webserver draait op poort ${port}`);
});

// --- 2. ACCOUNTS LADEN ---
// We halen de lijst op uit de "ACCOUNTS" variabele op Render (gescheiden door komma's)
const accountList = process.env.ACCOUNTS ? process.env.ACCOUNTS.split(',') : [];

if (accountList.length === 0) {
  console.log("❌ GEEN ACCOUNTS GEVONDEN! Voeg de 'ACCOUNTS' variabele toe op Render.");
}

const bots = {};

function startBot(email) {
  const cleanEmail = email.trim(); // Haal spaties weg
  if (!cleanEmail) return;

  console.log(`\n--- Opstarten: ${cleanEmail} ---`);

  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    username: cleanEmail,
    version: false,
    hideErrors: true,
    checkTimeoutInterval: 90000
  });

  // Microsoft Login Link opvangen (Belangrijk voor nieuwe accounts!)
  bot.on('msa', (data) => {
    console.log(`\n[!] ACTIE VEREIST voor ${cleanEmail}:`);
    console.log(`[!] Ga naar: https://microsoft.com/link`);
    console.log(`[!] Voer deze code in: ${data.user_code}\n`);
  });

  bot.on('login', () => {
    console.log(`✅ [${cleanEmail}] Succesvol ingelogd!`);
  });

  bot.on('spawn', () => {
    console.log(`🎮 [${cleanEmail}] In-game gespawned!`);
    // Anti-AFK: Spring elke 60 seconden
    setInterval(() => {
        if (bot.entity) bot.setControlState('jump', true);
        setTimeout(() => { if (bot.entity) bot.setControlState('jump', false); }, 500);
    }, 60000);
  });

  bot.on('error', (err) => {
    console.log(`❌ [${cleanEmail}] Fout: ${err.message}`);
  });

  bot.on('end', (reason) => {
    console.log(`⚠️ [${cleanEmail}] Verbinding verbroken (${reason}). Herstart over 30s...`);
    setTimeout(() => startBot(cleanEmail), 30000);
  });

  bots[cleanEmail] = bot;
}

// Start alle accounts met een vertraging van 15 seconden tussen elk account
// Dit voorkomt dat Microsoft of de server je direct blokkeert
accountList.forEach((email, index) => {
  setTimeout(() => {
    startBot(email);
  }, index * 15000); 
});

const mineflayer = require('mineflayer');
const http = require('http');

// --- 1. WEBSERVER VOOR RENDER ---
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('✅ Bot Manager is online!');
}).listen(port, () => {
  console.log(`Webserver draait op poort ${port}`);
});

// --- 2. JE ACCOUNTS ---
// Voeg hier simpelweg meer e-mails toe tussen de [ ]
const accounts = [
  process.env.MC_USERNAME_1 || 'email1@hotmail.com',
  process.env.MC_USERNAME_2 || 'email2@hotmail.com' 
];

const bots = {};

function startBot(email) {
  console.log(`\n--- Opstarten: ${email} ---`);

  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    username: email,
    version: false, // Automatische versie detectie
    hideErrors: true
  });

  // Microsoft Login Link opvangen
  bot.on('msa', (data) => {
    console.log(`\n[!] ACTIE VEREIST voor ${email}:`);
    console.log(`[!] Ga naar: https://microsoft.com/link`);
    console.log(`[!] Voer deze code in: ${data.user_code}\n`);
  });

  bot.on('login', () => {
    console.log(`✅ [${email}] Succesvol ingelogd!`);
  });

  bot.on('spawn', () => {
    console.log(`🎮 [${email}] In-game gespawned!`);
    bot.chat('DonutBot is present!');
  });

  bot.on('error', (err) => {
    console.log(`❌ [${email}] Fout: ${err.message}`);
  });

  bot.on('end', (reason) => {
    console.log(`⚠️ [${email}] Verbinding verbroken: ${reason}. Herstart over 30s...`);
    setTimeout(() => startBot(email), 30000);
  });

  bots[email] = bot;
}

// Start alle accounts uit de lijst
accounts.forEach((email, index) => {
  // We voegen een kleine vertraging toe tussen het opstarten van accounts 
  // om te voorkomen dat Microsoft je tijdelijk blokkeert (rate limit).
  setTimeout(() => {
    startBot(email);
  }, index * 10000); 
});

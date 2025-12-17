const mineflayer = require('mineflayer');
const http = require('http');

// Render gebruikt de PORT om te zien of de bot leeft
const port = process.env.PORT || 3000;

// Webserver om de bot 24/7 online te houden via een pinger
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('✅ DonutBot is online en actief!');
}).listen(port, () => {
  console.log(`Webserver draait op poort ${port}`);
});

function createBot() {
  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    // Gebruikt de 'Environment Variable' die je in Render instelt
    username: process.env.MC_USERNAME || 'JOUW_EMAIL_HIER', 
    version: '1.20.4'
  });

  bot.on('login', () => {
    console.log('✅ Bot succesvol ingelogd op DonutSMP!');
  });

  bot.on('spawn', () => {
    console.log('In-game gespawned!');
  });

  bot.on('end', (reason) => {
    console.log(`Bot verbinding verbroken (${reason}), ik probeer opnieuw over 30s...`);
    setTimeout(createBot, 30000);
  });

  bot.on('error', (err) => {
    console.log('Fout opgetreden:', err);
  });

  // Voorkom dat de bot gekickt wordt voor AFK (simpele beweging)
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message === '!ping') {
      bot.chat('Pong! Ik ben online.');
    }
  });
}

createBot();

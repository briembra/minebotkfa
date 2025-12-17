const mineflayer = require('mineflayer');
const http = require('http');

// --- 1. WEBSERVER VOOR RENDER ---
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('✅ Bot Wacht op Login...');
}).listen(port, () => {
  console.log(`Webserver actief op poort ${port}`);
});

function startBot() {
  console.log('\n[Systeem] Bezig met genereren van een nieuwe inloglink...');

  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    // We laten 'username' weg of zetten het op een placeholder
    // Microsoft bepaalt welk account het wordt zodra jij de code invoert
    version: false, 
    hideErrors: false,
    checkTimeoutInterval: 120000
  });

  // --- DE BELANGRIJKSTE FUNCTIE ---
  // Deze vangt de inlogcode op van Microsoft
  bot.on('msa', (data) => {
    console.log('\n===============================================');
    console.log(' Gebruik een willekeurig Microsoft account:');
    console.log(` 1. Ga naar: ${data.verification_uri}`);
    console.log(` 2. Voer deze code in: ${data.user_code}`);
    console.log('===============================================\n');
  });

  bot.on('login', () => {
    // Zodra je de code hebt ingevoerd, weet de bot wie je bent
    console.log(`✅ Succesvol ingelogd als: ${bot.username}`);
  });

  bot.on('spawn', () => {
    console.log(`🎮 Bot [${bot.username}] is nu op de server!`);
    // Anti-AFK
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }
    }, 60000);
  });

  bot.on('error', (err) => {
    console.log(`❌ Fout: ${err.message}`);
    if (err.message.includes('socketClosed')) {
       console.log('Tip: De server weigerde de verbinding. Probeer het over een minuutje weer.');
    }
  });

  bot.on('end', (reason) => {
    console.log(`⚠️ Verbinding gestopt (${reason}). Herstarten over 30s...`);
    setTimeout(startBot, 30000);
  });
}

// Start het proces
startBot();

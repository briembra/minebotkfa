const mineflayer = require('mineflayer');
const http = require('http');

// --- 1. WEBSERVER VOOR RENDER ---
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot Manager is online!');
}).listen(port, () => {
  console.log(`Webserver draait op poort ${port}`);
});

const accountList = process.env.ACCOUNTS ? process.env.ACCOUNTS.split(',') : [];
const bots = {};

function startBot(email) {
  const cleanEmail = email.trim();
  if (!cleanEmail) return;

  console.log(`[${cleanEmail}] Start inlogproces...`);

  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    username: cleanEmail,
    hideErrors: false, // We zetten dit op false om precies te zien wat er misgaat
    version: false,
    // Dit dwingt de bot om de link ALTIJD te tonen in de console:
    onMsaCode: (data) => {
      console.log('--------------------------------------------');
      console.log(`[!] ACTIE VEREIST VOOR: ${cleanEmail}`);
      console.log(`[!] LOGIN LINK: ${data.verification_uri}`);
      console.log(`[!] JE CODE: ${data.user_code}`);
      console.log('--------------------------------------------');
    }
  });

  bot.on('login', () => {
    console.log(`✅ [${cleanEmail}] Ingelogd bij Microsoft!`);
  });

  bot.on('spawn', () => {
    console.log(`🎮 [${cleanEmail}] Gespawned op de server!`);
  });

  bot.on('error', (err) => {
    console.log(`❌ [${cleanEmail}] Fout: ${err.message}`);
  });

  bot.on('end', (reason) => {
    console.log(`⚠️ [${cleanEmail}] Verbinding verbroken: ${reason}. Herstart over 30s...`);
    setTimeout(() => startBot(cleanEmail), 30000);
  });

  bots[cleanEmail] = bot;
}

// Start de lijst
if (accountList.length > 0) {
    accountList.forEach((email, index) => {
      setTimeout(() => startBot(email), index * 20000);
    });
} else {
    console.log("GEEN ACCOUNTS GEVONDEN. Check je Environment Variables op Render!");
}

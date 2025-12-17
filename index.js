const mineflayer = require('mineflayer');
const http = require('http');

// Webserver voor Render (verplicht)
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.end('Bot Manager is Online');
}).listen(port);

// Haal je e-mails op uit de Render Environment Variable 'ACCOUNTS'
const accountList = process.env.ACCOUNTS ? process.env.ACCOUNTS.split(',') : ['familiatejosurqueta@hotmail.com'];

function startBot(email) {
  const cleanEmail = email.trim();
  console.log(`[${cleanEmail}] Probeert verbinding te maken voor inloglink...`);

  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    username: cleanEmail,
    version: false,
    // DEZE FUNCTIE STUURT DE LINK NAAR JE CONSOLE:
    onMsaCode: (data) => {
      console.log('\n***********************************************');
      console.log(`[!] INLOGGEN VOOR: ${cleanEmail}`);
      console.log(`[!] STAP 1: Ga naar https://microsoft.com/link`);
      console.log(`[!] STAP 2: Voer deze code in: ${data.user_code}`);
      console.log('***********************************************\n');
    }
  });

  bot.on('login', () => console.log(`✅ [${cleanEmail}] Succesvol ingelogd!`));
  bot.on('spawn', () => console.log(`🎮 [${cleanEmail}] Is nu op de server.`));
  bot.on('error', (err) => console.log(`❌ [${cleanEmail}] Fout: ${err.message}`));
  bot.on('end', () => setTimeout(() => startBot(cleanEmail), 30000));
}

// Start de eerste bot direct
accountList.forEach((email, index) => {
  setTimeout(() => startBot(email), index * 20000);
});

const mineflayer = require('mineflayer');
const http = require('http');

const port = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('✅ Bot is actief!');
}).listen(port, () => {
  console.log(`Webserver draait op poort ${port}`);
});

function createBot() {
  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    username: 'familiatejosurqueta@hotmail.com',  // Vervang met jouw echte email!
    version: '1.20.4'
  });

  bot.on('login', () => console.log('✅ Bot ingelogd!'));
  bot.on('end', () => {
    console.log('Bot gestopt, ik probeer opnieuw over 30s...');
    setTimeout(createBot, 30000);
  });
  bot.on('error', err => console.log('Fout:', err));
}

createBot();

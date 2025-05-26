const mineflayer = require('mineflayer');
const http = require('http');

const emails = [
  'runnerbean83@hotmail.com',
  'familiatejosurqueta@hotmail.com',
  'luisinhobebelindo@gmail.com',
  'nanaweru@hotmail.com',
  'michaela.olivera@live.com',
  'phillipzuniga2001@gmail.com'
];

const lastShardCounts = {};

function createBot(email, index) {
  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    username: email,
    version: '1.20.4'
  });

  bot.on('login', () => {
    console.log(`✅ [${index}] Ingelogd als: ${bot.username}`);
  });

  bot.on('end', () => {
    console.log(`🔁 [${index}] ${bot.username || email} is offline. Herstart over 60 seconden...`);
    setTimeout(() => createBot(email, index), 60000);
  });

  bot.on('kicked', (reason) => {
    console.log(`⛔ [${index}] Gekickt (${bot.username || email}): ${reason}`);
  });

  bot.on('error', (err) => {
    console.log(`⚠️ [${index}] Fout bij ${email}: ${err}`);
  });

  bot.on('scoreboardTitleChanged', () => updateShards(bot, index));
  bot.on('scoreboardScoreChanged', () => updateShards(bot, index));
}

function updateShards(bot, index) {
  if (!bot.scoreboard || !bot.scoreboard.scores) return;
  const scores = bot.scoreboard.scores;
  for (const score of Object.values(scores)) {
    if (score.name.toLowerCase().includes('shards')) {
      lastShardCounts[bot.username] = score.name + ': ' + score.value;
      console.log(`💎 [${index}] ${bot.username} - ${lastShardCounts[bot.username]}`);
    }
  }
}

// Start bots
emails.forEach((email, i) => createBot(email, i + 1));

// Webserver voor 24/7 uptime services (zoals UptimeRobot)
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('✅ Bot is actief');
}).listen(3000, () => {
  console.log('🌐 Webserver draait op poort 3000');
});

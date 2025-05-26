const mineflayer = require('mineflayer');

const accounts = [
  'runnerbean83@hotmail.com',
  'familiatejosurqueta@hotmail.com',
  'luisinhobebelindo@gmail.com',
  'nerozetapopcorn@hotmail.com',
  'jeffreysoepman@hotmail.com',
  's4kurelive@hotmail.com'
];

const bots = [];
const lastShardCounts = {};

function createBot(email, index) {
  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    username: email,
    version: '1.20.4'
  });

  bots[index] = bot;

  bot.once('login', () => {
    console.log(`✅ [${index}] Ingelogd als ${bot.username}`);
    lastShardCounts[bot.username] = 'Onbekend';
  });

  bot.on('end', () => {
    console.log(`🔁 [${index}] Verbinding verbroken voor ${email}, nieuwe poging over 60 sec`);
    setTimeout(() => createBot(email, index), 60 * 1000);
  });

  bot.on('kicked', (reason) => {
    console.log(`⛔ [${index}] Gekickt (${email}): ${reason}`);
  });

  bot.on('error', (err) => {
    console.log(`⚠️ [${index}] Fout bij ${email}:`, err);
  });

  // Scoreboard shards uitlezen
  bot.on('scoreboardTitleChanged', () => updateShards(bot, index));
  bot.on('scoreboardScoreChanged', () => updateShards(bot, index));

  function updateShards(bot, index) {
    if (!bot.scoreboard) return;
    const scores = bot.scoreboard.scores;
    for (const score of Object.values(scores)) {
      if (score.name.toLowerCase().includes('shards')) {
        lastShardCounts[bot.username] = score.name + ': ' + score.value;
        console.log(`💎 [${index}] ${bot.username} - ${lastShardCounts[bot.username]}`);
      }
    }
  }
}

// Start alle bots
accounts.forEach((email, i) => {
  createBot(email, i);
});

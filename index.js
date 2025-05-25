const mineflayer = require('mineflayer');

const accounts = [
  'runnerbean83@hotmail.com',
  'familiatejosurqueta@hotmail.com',
  'luisinhobebelindo@gmail.com',
  'duduiss1@gmail.com',
  'melanie81485@outlook.com',
  'qwe7417890922@hotmail.com'
];

console.log(`🚀 Start met 6 accounts...`);

function createBot(email, index) {
  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    port: 25565,
    auth: 'microsoft',
    username: email,
    version: '1.20.4'
  });

  bot.on('login', () => {
    console.log(`✅ Account #${index + 1} (${email}) is ingelogd op Donut SMP!`);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message.includes('shards')) {
      console.log(`💎 Account #${index + 1} (${email}) shard info: ${message}`);
    }
  });

  bot.on('kicked', (reason) => {
    console.log(`⛔ Account #${index + 1} (${email}) werd gekickt: ${reason}`);
  });

  bot.on('end', () => {
    console.log(`❌ Account #${index + 1} (${email}) is uitgelogd.`);
  });

  bot.on('error', (err) => {
    console.error(`⚠️ Fout bij account #${index + 1} (${email}): ${err.message}`);
  });
}

accounts.forEach((email, index) => {
  createBot(email, index);
});

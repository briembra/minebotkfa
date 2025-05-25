const mineflayer = require('mineflayer');
const readline = require('readline');

// Vul hier je 4 accounts in:
const accounts = [
  'runnerbean83@hotmail.com',
  'familiatejosurqueta@hotmail.com',
  'luisinhobebelindo@gmail.com',
  'qwe7417890922@hotmail.com',
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let bots = [];
let loggedInCount = 0;

function createBot(email, index) {
  return new Promise((resolve, reject) => {
    console.log(`📧 Log in op account #${index + 1}: ${email}`);

    const bot = mineflayer.createBot({
      host: 'donutsmp.net',
      port: 25565,
      auth: 'microsoft',
      username: email,
      version: '1.20.4',
    });

    bot.on('login', () => {
      console.log(`✅ Account #${index + 1} (${email}) is ingelogd op Donut SMP!`);
      bots.push(bot);
      resolve();
    });

    bot.on('error', err => {
      console.error(`⚠️ Fout bij account #${index + 1} (${email}):`, err.message);
      reject(err);
    });

    bot.on('end', () => {
      console.log(`❌ Account #${index + 1} (${email}) is uitgelogd.`);
    });
  });
}

async function startBots(aantal) {
  for (let i = 0; i < aantal; i++) {
    try {
      await createBot(accounts[i], i);
    } catch (err) {
      console.log('Probeer opnieuw met hetzelfde account of andere account.');
    }
  }
  console.log('\n🎉 Alle gekozen accounts zijn ingelogd!');
  bots.forEach((bot, i) => {
    console.log(`- Account #${i + 1} (${accounts[i]}) is online op Donut SMP.`);
  });
  rl.close();
}

rl.question('Hoeveel accounts wil je gebruiken? (1 t/m 4) ', (answer) => {
  const aantal = parseInt(answer);
  if (aantal >= 1 && aantal <= 4) {
    startBots(aantal);
  } else {
    console.log('Voer een getal tussen 1 en 4 in.');
    rl.close();
  }
});

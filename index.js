const mineflayer = require('mineflayer');
const { Authflow } = require('prismarine-auth');

const emails = [
  'victorpoli.costa@gmail.com',
  'fyttopeola@gmail.com',
  'chippalm@hotmail.com',
  'cmyd@hotmail.com',
  'jose10fernando@hotmail.com',
  'beckhambeharry@outlook.com'
];

function createBot(email, index) {
  function start() {
    const flow = new Authflow(email, './tokens');
    flow.getMinecraftJavaToken().then(token => {
      const bot = mineflayer.createBot({
        host: 'donutsmp.net',
        port: 25565,
        version: '1.20.4',
        username: token.mcname,
        auth: 'microsoft',
        session: token
      });

      bot.on('login', () => {
        console.log(`✅ [${index}] Ingelogd als Minecraft-gebruiker: ${bot.username}`);
      });

      bot.on('end', () => {
        console.log(`🔁 [${index}] Verbinding verloren (${bot.username}). Nieuwe poging over 60 seconden...`);
        setTimeout(start, 60000);
      });

      bot.on('kicked', reason => {
        console.log(`⛔ [${index}] ${bot.username} gekickt: ${reason}. Nieuwe poging over 60 seconden...`);
        setTimeout(start, 60000);
      });

      bot.on('error', err => {
        console.log(`⚠️ [${index}] Fout bij ${bot.username}:`, err);
      });
    }).catch(err => {
      console.log(`❌ [${index}] Kan niet inloggen met ${email}:`, err);
    });
  }

  start();
}

emails.forEach((email, i) => createBot(email, i + 1));

const mineflayer = require('mineflayer');
const fs = require('fs');

const MAX_BOTS = 10;
const RECONNECT_DELAY = 5000;

function createBot(index) {
    const options = {
        host: 'donutsmp.net',
        port: 25565,
        auth: 'microsoft',
        version: '1.20.1',
        profilesFolder: `./auth_cache/bot_${index}`,
        onMsaCode: (data) => {
            const directLink = `https://www.microsoft.com/link/${data.user_code}`;
            console.log('\n' + '💠'.repeat(20));
            console.log(`   BOT #${index} ACTIVATIE`);
            console.log(`   CODE: ${data.user_code}`);
            console.log(`   LINK: ${directLink}`);
            console.log('💠'.repeat(20) + '\n');
        }
    };

    const bot = mineflayer.createBot(options);

    bot.on('login', () => {
        console.log(`[BOT #${index}] ✅ Ingelogd als: ${bot.username}`);
    });

    bot.on('spawn', () => {
        console.log(`[BOT #${index}] 🚀 Online op Donut SMP!`);
        
        // Start volgende bot na succes van de vorige
        staticNextBotTrigger(index);

        // Anti-AFK
        const afkInterval = setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 30000);
        bot.once('end', () => clearInterval(afkInterval));
    });

    // Laat de exacte kick-reden zien
    bot.on('kicked', (reason) => {
        let cleanReason = reason;
        try { cleanReason = JSON.parse(reason).text || reason; } catch (e) {}
        console.log(`[BOT #${index}] ❌ KICK REDEN: ${cleanReason}`);
    });

    // Automatisch herstarten na 5 seconden
    bot.on('end', (reason) => {
        console.log(`[BOT #${index}] 🔌 Verbroken (${reason}). Reconnect over 5s...`);
        setTimeout(() => createBot(index), RECONNECT_DELAY);
    });

    bot.on('error', (err) => {
        if (!err.message.includes('socketClosed')) {
            console.log(`[BOT #${index}] ⚠️ Fout: ${err.message}`);
        }
    });
}

// Bot Manager logica
let botsStarted = [1];
function staticNextBotTrigger(currentIndex) {
    let nextIndex = currentIndex + 1;
    if (nextIndex <= MAX_BOTS && !botsStarted.includes(nextIndex)) {
        botsStarted.push(nextIndex);
        setTimeout(() => createBot(nextIndex), 5000);
    }
}

if (!fs.existsSync('./auth_cache')) fs.mkdirSync('./auth_cache');
console.log("[SYSTEEM] Multi-Bot Manager opgestart. Wachten op Bot #1...");
createBot(1);

require('dotenv').config({ path: "./assets/modules/.env" });
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const User = require('./assets/db/mongoose');
const { adminKeyboard, userKeyboard } = require('./assets/keyboard/keyboard');
const { checkUserSubscription, sendSubscriptionMessage } = require('./assets/scripts/checkSub');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.on('message', async msg => {
    try {
        const username = msg.from.username || `${msg.from.first_name} ${msg.from.last_name}`;
        let user = await User.findOne({ id: msg.from.id });

        if (msg.text === '/start') {
            try {
                if (!user) {
                    new User({
                        _id: new mongoose.Types.ObjectId(),
                        id: Number(msg.from.id),
                        firstName: msg.from.first_name || '',
                        lastName: msg.from.last_name || '',
                        chatId: Number(msg.chat.id),
                        balance: 0,
                        ref: `https://t.me/${process.env.BOT_LINK}?start=${msg.chat.id}`,
                        from: Number(msg.text.replace('/start', '').trim()) || '',
                        isAdmin: false,
                        isSubscribed: false
                    }).save()
                }
            } catch (error) {
                console.log(error)
            }
            

            const isSubscribed = await checkUserSubscription(bot, msg.from.id, process.env.CHANNEL_ID);

            if (isSubscribed) {
                const isAdminMessage = user.isAdmin ? 
                    `Привет ${username}. Ты админ!` : 
                    "Добро пожаловать в Royal Liberty – уникальное казино, где удача всегда на вашей стороне! В этом захватывающем мире азарта и веселья вы найдете всё, что нужно для незабываемых игр и невероятных выигрышей\nПогрузитесь в атмосферу роскоши и благородства.\nRoyal Liberty открывает перед вами двери в королевство безграничных возможностей и головокружительных побед.\nПополняйте свою коллекцию карт, дойдите до максимального уровня игры и купите карту партнера Royal Liberty, которая даст вам возможность участия в розыгрыше.";
                
                await bot.sendMessage(msg.chat.id, isAdminMessage, user.isAdmin ? adminKeyboard : {});
                user.isSubscribed = true;
                await user.save();
            } else {
                await sendSubscriptionMessage(bot, msg.chat.id, process.env.CHANNEL_LINK);
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

bot.on('callback_query', async msg => {
    try {
        let user = await User.findOne({ id: msg.message.chat.id });
        if (msg.data === 'check_subscription') {
            const isSubscribed = await checkUserSubscription(bot, msg.message.chat.id, process.env.CHANNEL_ID);
            if (isSubscribed) {
                await bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
                await bot.sendMessage(msg.message.chat.id, "Добро пожаловать в Royal Liberty – уникальное казино, где удача всегда на вашей стороне! В этом захватывающем мире азарта и веселья вы найдете всё, что нужно для незабываемых игр и невероятных выигрышей\nПогрузитесь в атмосферу роскоши и благородства.\nRoyal Liberty открывает перед вами двери в королевство безграничных возможностей и головокружительных побед.\nПополняйте свою коллекцию карт, дойдите до максимального уровня игры и купите карту партнера Royal Liberty, которая даст вам возможность участия в розыгрыше.");
                user.isSubscribed = true;
                await user.save();
            } else {
                await sendSubscriptionMessage(bot, msg.message.chat.id, process.env.CHANNEL_LINK);
            }
        }
    } catch (error) {
        console.error('Error handling callback query:', error);
    }
});

mongoose.connect(process.env.MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });

bot.on('polling_error', console.log);

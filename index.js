import dotenv from "dotenv";
import TelegramBot from 'node-telegram-bot-api';
import axios from "axios";
import { adminKeyboard, userKeyboard } from './assets/keyboard/keyboard.js';
import { checkUserSubscription, sendSubscriptionMessage } from './assets/scripts/checkSub.js';
import { addUser, checkAdmin, checkUserExists } from "./assets/scripts/handleUser.js";

dotenv.config({ path: "./modules/.env" })

const bot = new TelegramBot("6640189743:AAHNsODw2yyR1k4WxBFBQVy8ncC3_PmDf9U", { polling: true });


bot.on('message', async msg => {
    try {
        axios.post('http://localhost:8000', msg, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const username = msg.from.username || `${msg.from.first_name} ${msg.from.last_name}`;
        const id = msg.from.id;
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name;
        const lastName = msg.from.last_name;
        const from = msg.text ? msg.text.replace(/^\/start\s*/, '') || null : null;

        if (msg.text === '/start') {
            console.log(msg)
            checkUserExists(id, async (error, exists) => {
                if (error) {
                    return console.error("Error checking user");
                }

                if (!exists) {
                    addUser(id, chatId, firstName, lastName, username, `${process.env.BOT_LINK}?start=${msg.chat.id}`,from, 0, "обычный", false, async (error) => {
                        if (error) {
                            console.error("Error adding user.");
                        } else {
                            console.info("User added to the database");
                            checkAdmin(bot, chatId, id);
                        }
                    });
                } else {
                    console.info('User already exists in the database');
                    checkAdmin(bot, msg, id);
                }
            })


            const isSubscribed = await checkUserSubscription(bot, msg.from.id, process.env.CHANNEL_ID);

            if (isSubscribed) {
                console.log("hello world sub")
                await bot.sendMessage(msg.chat.id, "Добро пожаловать в Royal Liberty – уникальное казино, где удача всегда на вашей стороне! В этом захватывающем мире азарта и веселья вы найдете всё, что нужно для незабываемых игр и невероятных выигрышей\nПогрузитесь в атмосферу роскоши и благородства.\nRoyal Liberty открывает перед вами двери в королевство безграничных возможностей и головокружительных побед.\nПополняйте свою коллекцию карт, дойдите до максимального уровня игры и купите карту партнера Royal Liberty, которая даст вам возможность участия в розыгрыше.");
            } else {
                await sendSubscriptionMessage(bot, msg.chat.id, process.env.CHANNEL_LINK);
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

// bot.on('callback_query', async msg => {
//     try {
//         if (msg.data === 'check_subscription') {
//             const isSubscribed = await checkUserSubscription(bot, msg.message.chat.id, process.env.CHANNEL_ID);
//             if (isSubscribed) {
//                 await bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
//                 user.isSubscribed = true;
//             } else {
//                 await sendSubscriptionMessage(bot, msg.message.chat.id, process.env.CHANNEL_LINK);
//             }
//         }
//     } catch (error) {
//         console.error('Error handling callback query:', error);
//     }
// });


bot.on('polling_error', console.log);

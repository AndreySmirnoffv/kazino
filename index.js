import dotenv from "dotenv";
import TelegramBot from 'node-telegram-bot-api';
import axios from "axios";
import { checkUserSubscription, sendSubscriptionMessage } from './assets/scripts/checkSub.js';
import { addUser, checkAdmin, checkUserExists } from "./assets/scripts/handleUser.js";
import { webApp } from "./assets/keyboard/keyboard.js";

dotenv.config({ path: "./modules/.env" })

const bot = new TelegramBot("6640189743:AAGTDWGQQtpLphMIJmhlssruv8kVttM63wE", { polling: true });


bot.on('message', async msg => {
    try {
        console.log(msg)
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
                await bot.sendMessage(msg.chat.id, `Добро пожаловать в Royal Liberty ⚜️ – уникальная игра, где удача всегда на вашей стороне! В этом захватывающем мире азарта и веселья вы найдете всё, что нужно для незабываемых игр и невероятных выигрышей\n\nПополняйте свою коллекцию карт, дойдите до максимального уровня игры и купите карту партнера Royal Liberty, которая даст вам возможность участия в розыгрыше.`, webApp);
            } else {
                await sendSubscriptionMessage(bot, msg.chat.id, process.env.CHANNEL_LINK);
            }
        }else if(msg.web_app_data.data){
            console.log(msg.web_app_data)
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

bot.on('polling_error', console.log);

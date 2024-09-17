import dotenv from 'dotenv'

dotenv.config({path: "../modules/.env"})

export const userKeyboard = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "Подпишитесь на канал", url: process.env.CHANNEL_LINK}],
                [{text: "Я подписался", callback_data: "check_subscription"}]
            ]
        })
    } 

export const adminKeyboard = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "Выведи вскех пользователей"}]
            ]
        })
    }

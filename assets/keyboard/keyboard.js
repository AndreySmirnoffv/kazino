require('dotenv').config({path: "../modules/.env"})
module.exports = {
    userKeyboard: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "Подпишитесь на канал", url: process.env.CHANNEL_LINK}],
                [{text: "Я подписался", callback_data: "check_subscription"}]
            ]
        })
    } ,
    adminKeyboard: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "Выведи вскех пользователей"}]
            ]
        })
    }
}
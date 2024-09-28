import dotenv from 'dotenv'

dotenv.config({ path: "../modules/.env" })

export const userKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Подпишитесь на канал", url: process.env.CHANNEL_LINK }],
      [{ text: "Я подписался", callback_data: "check_subscription" }]
    ]
  })
}

export const webApp = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Открыть WebApp',
          web_app: { url: "https://royal-liberty.vercel.app/"}}
      ]
    ]
  }
};

export const adminKeyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Выведи вскех пользователей" }]
    ]
  })
}

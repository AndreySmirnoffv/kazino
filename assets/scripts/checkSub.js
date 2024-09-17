export async function checkUserSubscription(bot, userId, channelId) {
    try {
        const chatMember = await bot.getChatMember(channelId, userId);
        return ['member', 'administrator', 'creator'].includes(chatMember.status);
    } catch (error) {
        if (error.response && error.response.body.error_code === 400) {
            return console.error('Bot is not an admin or channel does not exist');
        } else {
            return console.error('Error checking subscription:', error);
        }
    }
}

export async function sendSubscriptionMessage(bot, chatId, channelLink) {
    const inlineKeyboard = [{
        text: "Подпишитесь на канал",
        url: channelLink
    }];

    await bot.sendMessage(chatId, 'Пожалуйста, подпишитесь на данный канал, чтобы пользоваться ботом:', {
        reply_markup: {
            inline_keyboard: [inlineKeyboard]
        }
    });
}


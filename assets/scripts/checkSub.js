async function checkUserSubscription(bot, userId, channelId) {
    try {
        const chatMember = await bot.getChatMember(channelId, userId);
        return ['member', 'administrator', 'creator'].includes(chatMember.status);
    } catch (error) {
        if (error.response && error.response.body.error_code === 400) {
            throw new Error('Bot is not an admin or channel does not exist');
        } else {
            throw new Error('Error checking subscription:', error);
        }
    }
}

async function sendSubscriptionMessage(bot, chatId, channelLink) {
    const inlineKeyboard = [{
        text: "Подпишитесь на канал",
        url: channelLink
    }, {
        text: "Я подписался",
        callback_data: "check_subscription"
    }];

    await bot.sendMessage(chatId, 'Пожалуйста, подпишитесь на данный канал, чтобы пользоваться ботом:', {
        reply_markup: {
            inline_keyboard: [inlineKeyboard]
        }
    });
}

module.exports = {
    checkUserSubscription: checkUserSubscription,
    sendSubscriptionMessage: sendSubscriptionMessage
}
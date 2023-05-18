require("dotenv").config();
const { setupLinkMessage, addNewLink, renderLinkMessage, deleteLink, callbackDeleteLink, returnLastHWLink, deleteAllLink, callbackDeleteAllLink } = require('./functions/linkMessage');
const { rofl, meme, thisMeme, neUmnichai, ktoI, shock, thanks, say, getDocument, compliment, spam } = require('./functions/simpleFunctions');
const { handleLessonSchedule, addLinksToSchedule } = require('./functions/lessonsPin');

const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TOKEN || "fuck, we haven't token in .env";
const bot = new TelegramBot(TOKEN);
bot.setWebHook('https://phpboyfriendbotwebhook.onrender.com/' + TOKEN);

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post(`/${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// ----------------------------------------------------------------

bot.on('message', (msg) => {
    console.log(msg);
});

bot.onText(/^\/rofl/, (msg) => {
    rofl(bot, msg);
});

bot.onText(/^\/meme/, (msg) => {
    meme(bot, msg);
});

bot.onText(/^\/this_meme/, (msg) => {
    thisMeme(bot, msg);
});

bot.onText(/^\/ne_umnichai/, (msg) => {
    neUmnichai(bot, msg);
});

bot.onText(/^\/kto_i/, (msg) => {
    ktoI(bot, msg);
});

bot.onText(/^\/shock/, (msg) => {
    shock(bot, msg);
});

bot.onText(/^\/thanks/, (msg) => {
    thanks(bot, msg);
});

bot.onText(/^\/say (.+)/gms, (msg, match) => {
    say(bot, msg, match);
});

bot.onText(/^\/compliment (.+)/, (msg, match) => {
    compliment(bot, msg, match);
});

// --------------------------------------

bot.onText(/^\Уроки на /, (msg) => {
    if (msg.chat.type !== "supergroup" && msg.from.username !== "Makson_w") {
        bot.deleteMessage(chatId, messageId);
        bot.sendMessage(
            chatId,
            "Вы не обладаете нужными правами, чтоб сделать это, так что нэт 😒"
        );

        return;
    }

    handleLessonSchedule(bot, msg);
});

bot.onText(/^\/add_links/, (msg) => {
    if (msg.chat.type !== "supergroup" && msg.from.username !== "Makson_w") {
        bot.deleteMessage(chatId, messageId);
        bot.sendMessage(
            chatId,
            "Вы не обладаете нужными правами, чтоб сделать это, так что нэт 😒"
        );

        return;
    }

    addLinksToSchedule(bot, msg);
});

bot.onText(/^\/spam (.+)/, (msg, match) => {
    spam(bot, msg, match);
});

bot.on("document", (msg) => {
    getDocument(bot, msg);
});

// --------------------------------------

bot.onText(/^\/setup_link_message/, async (msg) => {
    if (msg.chat.type !== "supergroup") {
        return;
    }

    const chatId = msg.chat.id;

    await setupLinkMessage(bot, msg);
    await renderLinkMessage(bot, chatId);
});

bot.onText(/^\/add_new_link/, async (msg) => {
    if (msg.chat.type !== "supergroup") {
        return;
    }

    const chatId = msg.chat.id;

    await addNewLink(bot, msg);
    await renderLinkMessage(bot, chatId);
});

bot.onText(/^\/render_link_message/, async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    await renderLinkMessage(bot, chatId);
    await bot.deleteMessage(chatId, messageId);
});

bot.onText(/^\/delete_link/, async (msg) => {
    if (msg.chat.type !== "supergroup") {
        return;
    }

    await deleteLink(bot, msg);
});

bot.on("callback_query", async (callbackQuery) => {
    await callbackDeleteLink(bot, callbackQuery);
});

bot.onText(/^\/return_last_hw_link/, async (msg) => {
    const chatId = msg.chat.id;
    if (msg.chat.type !== "supergroup") {
        return;
    }

    await returnLastHWLink(bot, msg);
    await renderLinkMessage(bot, chatId);
});

bot.onText(/^\/delete_all_link/, (msg) => {
    if (msg.chat.type !== "supergroup") {
        return;
    }

    deleteAllLink(bot, msg);
});

bot.on("callback_query", (callbackQuery) => {
    callbackDeleteAllLink(bot, callbackQuery);
});


app.listen(3000, () => {
    console.log('Server stated on 3000 port');
});

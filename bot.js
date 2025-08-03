require('dotenv').config(); // MUST be first

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Basic web route to prevent Render from shutting down
app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running...');
});
setInterval(()=>{
console.log("running")
},3000)
// Bot logic
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "https://t.me/pollyflixbot/2").then(() => {
    console.log("Message sent to", chatId);
  });
});


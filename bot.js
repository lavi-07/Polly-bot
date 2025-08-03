const TelegramBot = require('node-telegram-bot-api');

// Replace this with your real bot token
const token = '7351269477:AAEyP0FBXhfXVTaxzi3k3cMKyTRY-X1aDeg';

// Create the bot using polling
const bot = new TelegramBot(token, { polling: true });

// When user sends a message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // ✅ This is your MEGA file link with decryption key include

  // ✅ Message with inline download button
 bot.sendMessage(chatId,"i got you").then((res)=>{
  console.log(chatId)
 })
  
});


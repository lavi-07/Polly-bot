const TelegramBot = require('node-telegram-bot-api');

// Replace this with your real bot token
const token = '7351269477:AAEyP0FBXhfXVTaxzi3k3cMKyTRY-X1aDeg';

// Create the bot using polling
const bot = new TelegramBot(token, { polling: true });

// When user sends a message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // ✅ This is your MEGA file link with decryption key included
  const videoLink = "https://mega.nz/file/mQ9DnLbI#Gfilu_zaRyYc9_qR4xlqHDPq39KyLqJSfQplT_wmTLU";

  // ✅ Message with inline download button
  bot.sendVideo(chatId,videoLink).catch((err)=>{
    console.log("failed to send",err)
  })
  
});


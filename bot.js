require('dotenv').config(); // MUST be first

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs=require("fs");
const data =JSON.parse(fs.readFileSync("database.json",('utf-8')))

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

// Bot logic
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `
👋 *Welcome to MovieBot!*

🎬 You can search for any movie by typing its name below.

📝 *Example:*  
\`Majhail\`  
\`Sardaar Ji\`  
\`Saunkan Saunkne 2\`

🔍 Just send the title, and I’ll find it for you!
  `, {
    parse_mode: "Markdown"
  });
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if(msg.video){
      console.log(msg.video.file_id)
    }else{
      const found = data.filter(item => item.title.includes(msg.text)
      );
      if(found.length !== 0){
      const keybord =found.map(item=>[{text:item.title,callback_data: item.title}])
      bot.sendMessage(chatId, "Your Movies LIst", {
        reply_markup: {
          inline_keyboard: keybord
        }
      });}else{
        bot.sendMessage(chatId, `
  ❌ *No Results Found*
  ──────────────
  🔍 Please check your spelling or try again.
  
  📝 Make sure you typed the title correctly, just like it appears on Google.
  `);
  
      }
    }
    
    
  });
});



bot.on("callback_query",(query)=>{
  const chatId = query.message.chat.id;
  const chossenTi = query.data; // This is your "some_action"
  const video=data.find(item=>item.title === chossenTi)
  if (video.url) {
    bot.sendVideo(chatId, video.url,{
      caption:`${video.title} ${video.year}
      ⚠️ *Note:* This video will auto-delete in *1 minute*.

📩 Forward it to any chat to save it permanently.`
    }).then((msg) => {
    setTimeout(()=>{
      bot.deleteMessage(chatId, msg.message_id)
      bot.sendMessage(chatId, `
⚠️ *Video Expired*

⏳ This video is no longer available.

🔁 Please send your request again to get a fresh copy.
`, {
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔄 Request Again", callback_data: video.title }]
    ]
  }
});

    },45000)
  });
  } else {
    bot.sendMessage(chatId, `
    ❌ *Video Not Found*
    ──────────────
    😕 Sorry, we couldn't find that video.
    
    🔁 You can try again or pick another one from the menu.
    `, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📂 Open Menu", callback_data: "menu" }]
        ]
      }
    });
    
  }

  bot.answerCallbackQuery(query.id);
});
 



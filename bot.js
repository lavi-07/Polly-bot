require('dotenv').config(); // MUST be first

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("database.json", 'utf-8'));
const content =data.map(item=>item.content).flat()

const app = express();
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Keep alive for Render
app.get('/', (req, res) => {
  res.send('Bot is alive!');
});
app.listen(process.env.PORT || 3000, () => {
  console.log('Server running...');
});

// ✅ /start Command Handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `
  🙏🏼 ਸਤ ਸ੍ਰੀ ਅਕਾਲ ${msg.from.first_name} ${msg.from.last_name} 

  👋 Pollyflix ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ!

  🎬 ਤੁਸੀਂ ਹੇਠਾਂ ਜਿਸ ਵੀ ਫਿਲਮ ਦਾ ਨਾਮ ਲਿਖੋਂਗੇ, ਉਹ ਲੱਭ ਸਕਦੇ ਹੋ।
  
  📝 ਉਦਾਹਰਨ:
  
\`Majhail\`  
\`Sardaar Ji\`  
\`Saunkan Saunkne 2\`

🔍 ਸਿਰਫ਼ ਫਿਲਮ ਦਾ ਨਾਮ ਭੇਜੋ, ਮੈਂ ਉਹ ਤੁਹਾਡੇ ਲਈ ਲੱਭ ਲਵਾਂਗਾ!
`, { parse_mode: "Markdown" });
});

// ✅ Message Handler
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(msg)

  if (msg.text === "/start") return; // already handled above

  if (msg.video) {
    console.log(msg.video.file_id);
    return;
  }

  const found = content.filter(item =>
    item.title.toLowerCase().includes(msg.text.toLowerCase())
  );

  if (found.length !== 0) {
    const keyboard = found.map(item => [{ text: item.title, callback_data: item.id }]);
    bot.sendMessage(chatId, "🎥 *Your Movies List*", {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard }
    });
  } else {
    bot.sendMessage(chatId, `
    ❌ ਕੋਈ ਨਤੀਜੇ ਨਹੀਂ ਮਿਲੇ
    ──────────────
    🔍 ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਸ਼ਬਦਾਂ ਦੀ ਜਾਂਚ ਕਰੋ ਜਾਂ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।
    
    📝 ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਤੁਸੀਂ ਸਿਰਲੇਖ ਸਹੀ ਤਰ੍ਹਾਂ ਲਿਖਿਆ ਹੈ, ਬਿਲਕੁਲ ਉਸੇ ਤਰ੍ਹਾਂ ਜਿਵੇਂ ਉਹ Google 'ਤੇ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ।
`, { parse_mode: "Markdown" });
  }
});

// ✅ Callback Query Handler
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const chosenId = query.data;
  console.log(chosenId)
  console.log(content)
  const video = content.find(item => item.id == chosenId);

  if (video?.url) {
    bot.sendVideo(chatId, video.url, {
      caption: `${video.title} 
      
      ⚠️ ਨੋਟ: ਇਹ ਵੀਡੀਓ ਇੱਕ ਮਿੰਟ ਵਿੱਚ ਆਪਣੇ ਆਪ ਮਿਟ ਜਾਵੇਗੀ।

      📩 ਇਸਨੂੰ ਕਿਸੇ ਵੀ ਚੈਟ ਵਿੱਚ ਸਾਂਝਾ ਕਰੋ ਤਾਂ ਜੋ ਤੁਸੀਂ ਇਸਨੂੰ ਹਮੇਸ਼ਾ ਲਈ ਸੰਭਾਲ ਕੇ ਰੱਖ ਸਕੋ।`,
      parse_mode: "Markdown"
    }).then((msg) => {
      setTimeout(() => {
        bot.deleteMessage(chatId, msg.message_id);
        bot.sendMessage(chatId, `
        ⚠️ ਵੀਡੀਓ ਦੀ ਮਿਆਦ ਖਤਮ ਹੋ ਗਈ ਹੈ।

        ⏳ ਹੁਣ ਇਹ ਵੀਡੀਓ ਵੇਖਣ ਲਈ ਉਪਲਬਧ ਨਹੀਂ।

        🔁 ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਬੇਨਤੀ ਫਿਰੋਂ ਭੇਜੋ ਤਾਂ ਜੋ ਤੁਹਾਨੂੰ ਨਵੀ ਵੀਡੀਓ ਮਿਲ ਸਕੇ।
`, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔄 ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ", callback_data: video.id }]
            ]
          }
        });
      }, 2000);
    });
  } else {
    bot.sendMessage(chatId, `
    😕 ਮਾਫ਼ ਕਰਨਾ, ਅਸੀਂ ਇਹ ਵੀਡੀਓ ਨਹੀਂ ਲੱਭ ਸਕੇ।

    🔁 ਤੁਸੀਂ ਫਿਰ ਇੱਕ ਵਾਰੀ ਕੋਸ਼ਿਸ਼ ਕਰ ਸਕਦੇ ਹੋ।
`);
  }

  bot.answerCallbackQuery(query.id);
});

const TelegramBot = require("node-telegram-bot-api");
const replies = require("./replies");

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) throw new Error("BOT_TOKEN environment variable is missing!");

const bot = new TelegramBot(TOKEN, { polling: true });

// Track users we've already greeted this session
const greeted = new Set();

function matchReply(text) {
  const lower = text.toLowerCase().trim();

  for (const rule of replies.rules) {
    const matched = rule.keywords.some((kw) => lower.includes(kw.toLowerCase()));
    if (matched) {
      // Pick a random response from the list
      const options = rule.responses;
      return options[Math.floor(Math.random() * options.length)];
    }
  }

  // No match — return fallback
  const fallbacks = replies.fallback;
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  // Skip empty or command messages
  if (!text || text.startsWith("/start")) {
    if (!greeted.has(chatId)) {
      greeted.add(chatId);
      bot.sendMessage(chatId, replies.greeting);
    }
    return;
  }

  const response = matchReply(text);
  bot.sendMessage(chatId, response);
});

console.log("🤖 Zo's bot is running...");

const TelegramBot = require("node-telegram-bot-api");
const replies = require("./replies");
const http = require("http");

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) throw new Error("BOT_TOKEN environment variable is missing!");

const bot = new TelegramBot(TOKEN, { polling: true });

const DELAY_MS = 7 * 60 * 1000;
const greeted = new Set();
const pendingReplies = new Map();
const zoReplied = new Map();

function matchReply(text) {
  const lower = text.toLowerCase().trim();
  for (const rule of replies.rules) {
    const matched = rule.keywords.some((kw) => lower.includes(kw.toLowerCase()));
    if (matched) {
      const options = rule.responses;
      return options[Math.floor(Math.random() * options.length)];
    }
  }
  const fallbacks = replies.fallback;
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (msg.business_connection_id && msg.from && !msg.from.is_bot) {
    zoReplied.set(chatId, Date.now());
    if (pendingReplies.has(chatId)) {
      clearTimeout(pendingReplies.get(chatId));
      pendingReplies.delete(chatId);
    }
    return;
  }

  if (!text || text.startsWith("/start")) {
    if (!greeted.has(chatId)) {
      greeted.add(chatId);
      bot.sendMessage(chatId, replies.greeting);
    }
    return;
  }
  bot.sendMessage(chatId, matchReply(text));
});

bot.on("business_message", (msg) => {
  const text = msg.text || "";
  if (!text) return;
  if (msg.from && msg.from.is_bot) return;

  const chatId = msg.chat.id;
  const businessConnectionId = msg.business_connection_id;

  const lastZoReply = zoReplied.get(chatId) || 0;
  if (Date.now() - lastZoReply < DELAY_MS) {
    if (pendingReplies.has(chatId)) {
      clearTimeout(pendingReplies.get(chatId));
      pendingReplies.delete(chatId);
    }
    return;
  }

  if (pendingReplies.has(chatId)) {
    clearTimeout(pendingReplies.get(chatId));
  }

  const timer = setTimeout(() => {
    pendingReplies.delete(chatId);
    const lastReply = zoReplied.get(chatId) || 0;
    if (Date.now() - lastReply < DELAY_MS) return;
    bot.sendMessage(chatId, matchReply(text), {
      business_connection_id: businessConnectionId,
    });
  }, DELAY_MS);

  pendingReplies.set(chatId, timer);
});

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end("Bot is running!")).listen(PORT);

console.log("🤖 Zo's bot is running on port", PORT);

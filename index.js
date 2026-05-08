const TelegramBot = require("node-telegram-bot-api");
const replies = require("./replies");
const http = require("http");

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) throw new Error("BOT_TOKEN environment variable is missing!");

const bot = new TelegramBot(TOKEN, { polling: true });

// ── Config ──────────────────────────────────────
const DELAY_MS = 7 * 60 * 1000; // 7 minutes

// ── State ───────────────────────────────────────
const pendingReplies = new Map(); // chatId → timer
const zoReplied = new Map();      // chatId → timestamp
const greeted = new Set();        // for direct bot testing

// ── Match reply ─────────────────────────────────
function matchReply(text) {
  const lower = text.toLowerCase().trim();
  for (const rule of replies.rules) {
    const matched = rule.keywords.some((kw) =>
      lower.includes(kw.toLowerCase())
    );
    if (matched) {
      const options = rule.responses;
      return options[Math.floor(Math.random() * options.length)];
    }
  }
  const fallbacks = replies.fallback;
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ── Schedule a delayed reply ─────────────────────
function scheduleReply(chatId, text, businessConnectionId) {
  // Cancel any existing timer for this chat
  if (pendingReplies.has(chatId)) {
    clearTimeout(pendingReplies.get(chatId));
    pendingReplies.delete(chatId);
  }

  const timer = setTimeout(() => {
    pendingReplies.delete(chatId);

    // Did Zo reply while we were waiting?
    const lastZoReply = zoReplied.get(chatId) || 0;
    if (Date.now() - lastZoReply < DELAY_MS) {
      console.log(`[${chatId}] Zo replied — bot staying silent.`);
      return;
    }

    console.log(`[${chatId}] No reply from Zo after ${DELAY_MS / 60000} min — bot responding.`);
    bot.sendMessage(chatId, matchReply(text), {
      business_connection_id: businessConnectionId,
    }).catch((err) => console.error("Send error:", err.message));

  }, DELAY_MS);

  pendingReplies.set(chatId, timer);
  console.log(`[${chatId}] Timer started — will reply in ${DELAY_MS / 60000} min if Zo doesn't.`);
}

// ── Incoming message from someone messaging Zo ───
bot.on("business_message", (msg) => {
  const text = msg.text || "";
  if (!text) return;
  if (msg.from && msg.from.is_bot) return;

  const chatId = msg.chat.id;
  const businessConnectionId = msg.business_connection_id;

  // If Zo replied recently, stay silent and reset
  const lastZoReply = zoReplied.get(chatId) || 0;
  if (Date.now() - lastZoReply < DELAY_MS) {
    console.log(`[${chatId}] Zo was active recently — skipping.`);
    if (pendingReplies.has(chatId)) {
      clearTimeout(pendingReplies.get(chatId));
      pendingReplies.delete(chatId);
    }
    return;
  }

  scheduleReply(chatId, text, businessConnectionId);
});

// ── Zo sent a message — cancel bot's pending reply ──
bot.on("deleted_business_messages", () => {});
bot.on("business_connection", (conn) => {
  console.log("Business connection:", conn.id, "| Active:", conn.is_enabled);
});

// ── Direct bot messages (for testing only) ──────
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  // Detect Zo's own outgoing messages via business connection
  if (msg.business_connection_id) {
    zoReplied.set(chatId, Date.now());
    if (pendingReplies.has(chatId)) {
      clearTimeout(pendingReplies.get(chatId));
      pendingReplies.delete(chatId);
      console.log(`[${chatId}] Zo replied — cancelled pending bot reply.`);
    }
    return;
  }

  // Regular direct message to the bot (testing)
  if (!text || text.startsWith("/start")) {
    if (!greeted.has(chatId)) {
      greeted.add(chatId);
      bot.sendMessage(chatId, replies.greeting);
    }
    return;
  }

  bot.sendMessage(chatId, matchReply(text));
});

// ── Keep Render alive ────────────────────────────
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Zo's bot is running!");
}).listen(PORT);

console.log(`🤖 Zo's bot is live — delay: ${DELAY_MS / 60000} min | port: ${PORT}`);

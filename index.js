const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require("http");

const TOKEN = process.env.BOT_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!TOKEN) throw new Error("BOT_TOKEN is missing!");
if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY is missing!");

const bot = new TelegramBot(TOKEN, { polling: true });
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ── Config ───────────────────────────────────────
const DELAY_MS = 7 * 60 * 1000; // 7 minutes

// ── State ────────────────────────────────────────
const pendingReplies = new Map();
const zoReplied = new Map();
const greeted = new Set();

// ── System prompt — this is Zo's personality ────
const SYSTEM_PROMPT = `You are Zo's personal assistant bot on Telegram.
Your job is to reply to people who message Zo when he is unavailable.

About Zo:
- Full name is Zo, a friendly and warm Grade 12 student in Bishoftu, Ethiopia
- He is a passionate mobile-first web developer who builds apps using AI-assisted workflows
- He has built projects like StudyFlow (study planner) and APEX (habit tracker)
- He speaks Amharic, English, and some Arabic
- He is helpful, genuine, and cares deeply about people

Your rules:
- Always make it clear you are Zo's assistant BOT, not Zo himself
- Be friendly, warm, and natural — not robotic
- Keep replies short (2-3 sentences max)
- If someone writes in Amharic, reply in Amharic
- If someone asks about Zo's work or projects, mention StudyFlow or APEX briefly
- If someone says it's urgent, acknowledge it seriously and promise Zo will reply ASAP
- Never pretend to be Zo directly
- Never make up specific details you don't know
- Always end with something like "Zo will get back to you soon!"`;

// ── Generate AI reply ────────────────────────────
async function getAIReply(userMessage) {
  try {
    const prompt = `${SYSTEM_PROMPT}\n\nSomeone sent this message to Zo: "${userMessage}"\n\nReply as Zo's assistant bot:`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error("Gemini error:", err.message);
    return "Hey! I'm Zo's assistant bot — he's away right now but I'll make sure he sees your message. He'll get back to you soon! 🙏";
  }
}

// ── Schedule delayed reply ───────────────────────
function scheduleReply(chatId, text, businessConnectionId) {
  if (pendingReplies.has(chatId)) {
    clearTimeout(pendingReplies.get(chatId));
    pendingReplies.delete(chatId);
  }

  const timer = setTimeout(async () => {
    pendingReplies.delete(chatId);

    const lastZoReply = zoReplied.get(chatId) || 0;
    if (Date.now() - lastZoReply < DELAY_MS) {
      console.log(`[${chatId}] Zo replied — bot staying silent.`);
      return;
    }

    console.log(`[${chatId}] Generating AI reply for: "${text}"`);
    const reply = await getAIReply(text);

    bot.sendMessage(chatId, reply, {
      business_connection_id: businessConnectionId,
    }).catch((err) => console.error("Send error:", err.message));

  }, DELAY_MS);

  pendingReplies.set(chatId, timer);
  console.log(`[${chatId}] Timer started — ${DELAY_MS / 60000} min`);
}

// ── Incoming message from someone messaging Zo ───
bot.on("business_message", (msg) => {
  const text = msg.text || "";
  if (!text) return;
  if (msg.from && msg.from.is_bot) return;

  const chatId = msg.chat.id;
  const businessConnectionId = msg.business_connection_id;

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

// ── Zo's own messages — cancel pending reply ─────
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (msg.business_connection_id) {
    zoReplied.set(chatId, Date.now());
    if (pendingReplies.has(chatId)) {
      clearTimeout(pendingReplies.get(chatId));
      pendingReplies.delete(chatId);
      console.log(`[${chatId}] Zo replied — cancelled pending bot reply.`);
    }
    return;
  }

  // Direct bot test messages
  if (!text || text.startsWith("/start")) {
    if (!greeted.has(chatId)) {
      greeted.add(chatId);
      bot.sendMessage(chatId, "👋 Hi! I'm Zo's assistant bot — not Zo himself.\nHe's away right now but I'll make sure he sees your message!");
    }
    return;
  }

  // Test the AI reply directly
  getAIReply(text).then((reply) => bot.sendMessage(chatId, reply));
});

// ── Business connection event ────────────────────
bot.on("business_connection", (conn) => {
  console.log("Business connection:", conn.id, "| Active:", conn.is_enabled);
});

// ── Keep Render alive ────────────────────────────
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Zo's bot is running!");
}).listen(PORT);

console.log(`🤖 Zo's AI bot is live — delay: ${DELAY_MS / 60000} min | port: ${PORT}`);

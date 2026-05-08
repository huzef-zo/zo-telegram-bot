const TelegramBot = require("node-telegram-bot-api");
const http = require("http");

const TOKEN = process.env.BOT_TOKEN;
const GROQ_KEY = process.env.GROQ_API_KEY;

if (!TOKEN) throw new Error("BOT_TOKEN is missing!");
if (!GROQ_KEY) throw new Error("GROQ_API_KEY is missing!");

const bot = new TelegramBot(TOKEN, {
  polling: {
    autoStart: false,
    params: { timeout: 10 }
  }
});

// Clear ghost instances then start polling
bot.deleteWebHook().then(() => {
  bot.startPolling();
  console.log("✅ Polling started clean.");
}).catch((err) => {
  console.error("Webhook clear error:", err.message);
  bot.startPolling();
});

// ── Config ───────────────────────────────────────
const DELAY_MS = 7 * 60 * 1000; // 7 minutes

// ── State ────────────────────────────────────────
const pendingReplies = new Map();
const zoReplied = new Map();
const greeted = new Set();

// ── Zo's assistant prompt ────────────────────────
const SYSTEM_PROMPT = `You are Zo's personal AI assistant bot on Telegram.
You represent Zo when he is unavailable, but you are also genuinely helpful and intelligent.

About Zo:
- Friendly and warm Grade 12 student in Bishoftu, Ethiopia
- Passionate mobile-first web developer who builds apps using AI
- Built projects like StudyFlow (study planner) and APEX (habit tracker)
- Speaks Amharic, English, and some Arabic

Your personality:
- Friendly, warm, casual and natural — like a smart friend, not a robot
- Match the tone and length of the message you receive
- If someone sends a short casual message like "hi" or "sup" → reply short and casual
- If someone asks a detailed question → give a helpful detailed answer
- If someone is upset or serious → be empathetic and sincere
- Never use corporate or robotic language

What you can do:
- Answer general knowledge questions fully and helpfully
- Help with math, science, coding, writing, advice — anything a smart assistant can do
- Explain things clearly if someone needs help understanding something
- Have a normal conversation if someone just wants to chat

What you must always do:
- Always reply in English only
- Always make it clear you are Zo's assistant BOT at least once in the conversation, not Zo himself
- If someone asks specifically for Zo or something only Zo can do (like a personal favor, meeting up, sending files) → politely say Zo is unavailable and will get back to them
- If a message is completely unclear → ask them to clarify in a friendly way
- Never pretend to be Zo directly
- Never make up personal information about Zo that isn't listed above`;

// ── Groq API call ────────────────────────────────
async function getAIReply(userMessage) {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const body = {
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage }
    ],
    max_tokens: 400,
    temperature: 0.8
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Groq API error:", JSON.stringify(data));
      return null;
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      console.error("Groq empty response:", JSON.stringify(data));
      return null;
    }

    return text.trim();

  } catch (err) {
    console.error("Fetch error:", err.message);
    return null;
  }
}

// ── Fallback reply ───────────────────────────────
function fallbackReply() {
  const options = [
    "👋 Hey! I'm Zo's assistant bot — not him directly. He's away right now but I'll make sure he sees your message. He'll get back to you soon!",
    "Hi there! This is Zo's assistant bot. He's not available at the moment but your message is noted. Zo will reply soon! 🙏",
    "Hey! Zo's assistant bot here — he's busy right now but I've got your message. He'll reach out when he's free! 😊",
  ];
  return options[Math.floor(Math.random() * options.length)];
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

    console.log(`[${chatId}] Calling Groq for: "${text}"`);
    const aiReply = await getAIReply(text);
    const reply = aiReply || fallbackReply();
    console.log(`[${chatId}] Reply: "${reply}"`);

    bot.sendMessage(chatId, reply, {
      business_connection_id: businessConnectionId,
    }).catch((err) => console.error("Send error:", err.message));

  }, DELAY_MS);

  pendingReplies.set(chatId, timer);
  console.log(`[${chatId}] Timer started — ${DELAY_MS / 60000} min`);
}

// ── Incoming business message ────────────────────
bot.on("business_message", (msg) => {
  console.log("📨 business_message received:", msg.text);
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
      console.log(`[${chatId}] Zo replied — cancelled bot reply.`);
    }
    return;
  }

  // Direct test messages to bot
  if (!text || text.startsWith("/start")) {
    if (!greeted.has(chatId)) {
      greeted.add(chatId);
      bot.sendMessage(chatId, "👋 Hi! I'm Zo's assistant bot — not Zo himself.\nHe's away right now but I'll make sure he sees your message!");
    }
    return;
  }

  // Instant Groq reply for direct testing
  console.log(`[TEST] Testing Groq with: "${text}"`);
  getAIReply(text).then((reply) => {
    const finalReply = reply || fallbackReply();
    console.log(`[TEST] Groq replied: "${finalReply}"`);
    bot.sendMessage(chatId, finalReply);
  });
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

console.log(`🤖 Zo's Groq AI bot is live — delay: ${DELAY_MS / 60000} min | port: ${PORT}`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZO'S BOT — REPLIES CONFIG
//  Edit this file to customize your bot.
//  Add keywords, tweak responses, done. ✅
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports = {

  // Sent when someone messages for the first time
  greeting:
    "👋 Hi! Just so you know, I'm Zo's assistant bot — not Zo himself.\nHe's away right now but I'll make sure he sees your message. Feel free to leave anything you'd like him to know!",

  // Rule-based replies — keywords trigger responses
  // Add as many rules as you want!
  rules: [

    // ── FRIENDSHIP / PERSONAL ─────────────────
    {
      keywords: ["hey", "hi", "hello", "sup", "heyy", "heyyy", "hola"],
      responses: [
        "👋 Hey! Just a heads-up — I'm Zo's assistant bot, not him directly. He's not around right now but I've got your message!",
        "Hi there! This is Zo's assistant bot — not Zo himself. He's away at the moment but I'll pass this along. 😊",
        "Hello! I'm Zo's bot assistant, not him directly. Your message is safe — he'll get back to you soon. 🤝",
      ],
    },
    {
      keywords: ["how are you", "how r u", "how's it going", "you good", "u good"],
      responses: [
        "I'm Zo's assistant bot, so I'm always running! 😄 He's away right now but he'll reply when he's free.",
        "Doing great — as a bot can! 😄 This is Zo's assistant by the way, not him. He's occupied but he'll check in soon.",
      ],
    },
    {
      keywords: ["where are you", "where r u", "where is zo", "you there", "u there"],
      responses: [
        "Just to clarify — I'm Zo's assistant bot, not him! He's away right now but he'll be back soon. 🙏",
        "This is the bot, not Zo himself! He's not available at the moment — leave your message and he'll reply. 📩",
      ],
    },
    {
      keywords: ["miss you", "miss u", "i miss you"],
      responses: [
        "Aww! I'll make sure Zo sees this — I'm just his assistant bot passing along messages. 😊 He'll reach out soon!",
        "That's sweet! 💙 This is Zo's bot by the way — not him. I'll let him know you said that!",
      ],
    },
    {
      keywords: ["okay", "ok", "alright", "got it", "sure", "cool"],
      responses: [
        "👍 Noted! I'm Zo's assistant bot — he'll follow up when he's free.",
        "Got it! I'm Zo's assistant bot by the way — I'll make sure he sees this. 😊",
      ],
    },
    {
      keywords: ["bye", "goodbye", "take care", "later", "ttyl", "cya"],
      responses: [
        "Take care! I'm Zo's bot assistant — Zo himself will message you when he's back. 👋",
        "Bye for now! This is the bot signing off — Zo will catch you later. 😊",
      ],
    },
    {
      keywords: ["thank you", "thanks", "thx", "ty"],
      responses: [
        "You're welcome! 😊 This is Zo's assistant bot — he'll be in touch soon.",
        "No worries! I'm just the bot holding things down while Zo's away. He'll get back to you shortly. 🙏",
      ],
    },

    // ── SCHOOL / STUDY ────────────────────────
    {
      keywords: ["homework", "assignment", "project", "study", "exam", "test", "grade", "school", "class"],
      responses: [
        "📚 Zo's probably deep in study mode right now! I'm his assistant bot — I'll make sure he sees this when he surfaces.",
        "School stuff? Zo definitely gets it 😄 — I'm his bot assistant, not him. He'll respond when he's free. 💪",
        "I'm Zo's bot, not him directly! He's likely buried in books right now. Leave your message and he'll get back to you. 📖",
      ],
    },
    {
      keywords: ["help me", "can you help", "i need help", "help with"],
      responses: [
        "I'm Zo's assistant bot — I can't help directly, but I'll flag this for him! He'll assist you when he's back. 🙌",
        "Hang tight! I'm just the bot — Zo himself will reply and help you out as soon as he can. 😊",
      ],
    },
    {
      keywords: ["when are you free", "when can we talk", "are you free", "you available"],
      responses: [
        "I'm the bot so I'm always running 😄 — but Zo himself will let you know when he's available. 📅",
        "This is his assistant bot — I don't have his schedule, but he'll reach out when he's free! 😊",
      ],
    },
  ],

  // Fallback — sent when no keyword matches
  fallback: [
    "👋 Hey! Just a heads-up — I'm Zo's assistant bot, not him directly. He's away right now but I've noted your message. He'll reply soon!",
    "This is Zo's bot assistant speaking — not Zo himself. He's not around at the moment but he'll get back to you. 🙏",
    "Message received! I'm Zo's bot by the way — he'll reach out when he's free. 😊",
    "I'm Zo's assistant bot — Zo will reply when he's available. Thanks for your patience! 💙",
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZO'S BOT — REPLIES CONFIG
//  Edit this file to customize your bot.
//  Add keywords, tweak responses, done. ✅
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports = {

  // Sent when someone messages for the first time
  greeting:
    "Hey! Zo's away right now, I'll let him know you messaged. 👋\nFeel free to leave your message and he'll get back to you!",

  // Rule-based replies — keywords trigger responses
  // Add as many rules as you want!
  rules: [

    // ── FRIENDSHIP / PERSONAL ─────────────────
    {
      keywords: ["hey", "hi", "hello", "sup", "heyy", "heyyy", "hola"],
      responses: [
        "Hey! 👋 Zo's not around right now but I got your message.",
        "Hi there! Zo's away at the moment, he'll reach out soon! 😊",
        "Hello! Zo's busy but your message is safe with me. 🤝",
      ],
    },
    {
      keywords: ["how are you", "how r u", "how's it going", "you good", "u good"],
      responses: [
        "I'm just a bot, but I'm doing great! 😄 Zo will reply when he's free.",
        "All good on my end! Zo's occupied right now but he'll check in with you soon.",
      ],
    },
    {
      keywords: ["where are you", "where r u", "where is zo", "you there", "u there"],
      responses: [
        "Zo's away right now! He'll be back soon. 🙏",
        "He's not available at the moment — leave your message and he'll reply! 📩",
      ],
    },
    {
      keywords: ["miss you", "miss u", "i miss you"],
      responses: [
        "Aww, Zo will be happy to hear that! He'll reach out soon. 😊",
        "That's sweet! He'll catch up with you when he's free. 💙",
      ],
    },
    {
      keywords: ["okay", "ok", "alright", "got it", "sure", "cool"],
      responses: [
        "👍 Got it! Zo will be in touch.",
        "Noted! He'll follow up when he's free. 😊",
      ],
    },
    {
      keywords: ["bye", "goodbye", "take care", "later", "ttyl", "cya"],
      responses: [
        "Take care! Zo will message you when he's back. 👋",
        "Bye for now! He'll catch you later. 😊",
      ],
    },
    {
      keywords: ["thank you", "thanks", "thx", "ty"],
      responses: [
        "Of course! 😊 Zo will be in touch soon.",
        "No worries! He'll get back to you shortly. 🙏",
      ],
    },

    // ── SCHOOL / STUDY ────────────────────────
    {
      keywords: ["homework", "assignment", "project", "study", "exam", "test", "grade", "school", "class"],
      responses: [
        "Zo's probably deep in study mode right now! 📚 He'll reply when he surfaces.",
        "School stuff? Zo gets it — he'll respond when he's free. 💪",
        "He's likely buried in books right now. Leave your message and he'll get back to you! 📖",
      ],
    },
    {
      keywords: ["help me", "can you help", "i need help", "help with"],
      responses: [
        "Zo's away but I'll make sure he sees this. He'll help you out when he's back! 🙌",
        "Hang tight! Zo will reply and help you out as soon as he can. 😊",
      ],
    },
    {
      keywords: ["when are you free", "when can we talk", "are you free", "you available"],
      responses: [
        "Not sure of his exact schedule, but he'll message you when he's free! 📅",
        "He'll let you know when he's available. Just hang tight! 😊",
      ],
    },
  ],

  // Fallback — sent when no keyword matches
  fallback: [
    "Hey! Zo's away right now but I've noted your message. He'll reply soon! 😊",
    "Zo's not around at the moment — he'll get back to you! 🙏",
    "Message received! Zo will reach out when he's free. 👋",
    "Got it! Zo will reply when he's available. Thanks for your patience! 💙",
  ],
};

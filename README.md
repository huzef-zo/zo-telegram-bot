# 🤖 Zo's Telegram Auto-Reply Bot

A friendly, rule-based Telegram bot that replies to your messages when you're away.
Hosted free on Render. No AI API needed — zero cost forever.

---

## 📁 Files

| File | Purpose |
|------|---------|
| `index.js` | Bot engine — don't touch unless you know what you're doing |
| `replies.js` | **Your config** — edit this to customize all replies |
| `package.json` | Dependencies |

---

## 🚀 Deploy to Render (Step by Step)

### Step 1 — Create your bot token
1. Open Telegram → search `@BotFather`
2. Send `/newbot`
3. Give it a name (e.g. *Zo's Assistant*) and username (e.g. `zo_assistant_bot`)
4. Copy the **API token** BotFather gives you — keep it safe!

### Step 2 — Push code to GitHub
1. Create a new **public** GitHub repo (e.g. `zo-telegram-bot`)
2. Upload all 3 files: `index.js`, `replies.js`, `package.json`
   - On mobile: use GitHub's website → Add file → Upload files

### Step 3 — Deploy on Render
1. Go to [render.com](https://render.com) → Sign up free
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Set these:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - Key: `BOT_TOKEN`
   - Value: *(paste your token from BotFather)*
6. Click **Deploy** — done! 🎉

### Step 4 — Connect to Telegram Chat Automation
1. Open Telegram → **Settings → Chat Automation**
2. Enter your bot's username (e.g. `@zo_assistant_bot`)
3. Choose which chats it can access
4. Save — your bot is live! ✅

---

## ✏️ Customizing Replies

Open `replies.js` and edit freely:

```js
// Change the greeting
greeting: "Hey! Zo's away right now...",

// Add a new rule
{
  keywords: ["portfolio", "website", "your work"],
  responses: [
    "Check out my work at huzef-zo.github.io/Studyflow! 🚀",
    "Zo builds cool stuff — see it at huzef-zo.github.io/APEX-habit-tracker/ 💪",
  ],
},
```

Every time you edit `replies.js` and push to GitHub, Render auto-redeploys. ✨

---

## 💡 Tips

- Add your **portfolio links** as a keyword rule so the bot promotes your work
- Add a rule for `"collab"` or `"work together"` keywords
- Multiple responses per rule = bot picks one randomly, feels more human
- Keep Render's free tier alive by enabling **"Keep Alive"** pings or use UptimeRobot (free)

---

Built by Zo & Belion 🤝

# ✅ PitchSense AI – Live Roleplay Scoring Engine

A Vercel AI SDK powered pitch-evaluation tool built for the HSV Digital SDE I Round 2 Assignment.

This project evaluates pitch transcripts using an LLM and returns structured JSON containing:
✔ Score
✔ Category scores
✔ Insights
✔ Verdict summary

All evaluation is done via Vercel AI SDK using an OpenRouter model.
Includes guardrails, clean UI, and result visualization.

# 🚀 Features
🔹 Live Pitch Evaluation

Paste a transcript → AI returns structured scoring JSON.

🔹 Guardrails Implemented

Profanity detection

Input length limits

Strict JSON-only outputs (no chain-of-thought leakage)

Basic per-IP rate limiting (5 requests/min)

🔹 Clean Dashboard UI

Simple sidebar + form + evaluation result panel.

🔹 Built with Modern Stack

Next.js 14

Vercel AI SDK

OpenRouter Models

Zod Schema Validation

# 🧩 Tech Stack
Component	Technology
Framework	Next.js
AI	Vercel AI SDK + OpenRouter
Schema Validation	Zod
Deployment	Vercel
UI	Custom React Dashboard

# 📂 Project Structure
my-app/
│
├── pages/
│   ├── index.js              # Main dashboard UI
│   └── api/
│       └── evaluate.js       # Core Evaluation API (Vercel AI SDK)
│
├── public/                    # Static assets
├── styles/                    # Global CSS / UI styles
│
├── .env.local                 # API keys (ignored in Git)
├── package.json
├── next.config.mjs
└── README.md

# 📸 Screenshots
🔹 Dashboard UI

🔹 Evaluation Output

📌 Add your screenshots in a /screenshots/ folder in the repo so GitHub renders them correctly.

# 🛠️ Local Setup:

git clone https://github.com/RITIKYADAV0070/LIVE-ROLEPLAY-SCORING-ENGINE.git
cd LIVE-ROLEPLAY-SCORING-ENGINE/my-app
npm install
npm run dev


# Create .env.local:

OPENROUTER_API_KEY=your_key_here
AI_MODEL=meta-llama/llama-3.1-70b-instruct

📡 API Endpoint: /api/evaluate

Method: POST
Body:

{
  "transcript": "Your pitch transcript here..."
}


# Response:

{
  "ok": true,
  "result": {
    "score": 0.82,
    "category_scores": {
      "clarity": 0.9,
      "depth": 0.75,
      "structure": 0.8
    },
    "insights": ["...", "..."],
    "verdict": "..."
  }
}

# 🎥 Loom Video Summary (Script Included)

I’ve prepared your perfect Loom script here:
👉 “Explain what to say step-by-step”
https://chat.openai.com/share/placeholder

(Ask again and I’ll generate the exact video script.)

# 📬 Author

Ritik Yadav
AI Engineer & Full-Stack Developer


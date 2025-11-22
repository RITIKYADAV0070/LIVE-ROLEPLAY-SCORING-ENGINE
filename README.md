# ✅ PitchSense AI – Live Roleplay Scoring Engine

A Vercel AI SDK powered pitch-evaluation tool built for the HSV Digital SDE I Round 2 Assignment.

This project evaluates pitch transcripts using an LLM and returns structured JSON containing:
✔ Score
✔ Category scores
✔ Insights
✔ Verdict summary

All evaluation is done via Vercel AI SDK using an OpenRouter model.
Includes guardrails, clean UI, and result visualization.

# 🚀 Live Demo (Deployed on Vercel)
👉 https://live-roleplay-scoring-engine.vercel.app/


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
| Component         | Technology                     |
|-------------------|--------------------------------|
| Framework         | Next.js                        |
| AI                | Vercel AI SDK + OpenRouter     |
| Schema Validation | Zod                            |
| Deployment        | Vercel                         |
| UI                | Custom React Dashboard         |

#  📂 Project Structure
```bash

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
```

# 📸 Screenshots
🔹 Dashboard UI
<img width="1912" height="875" alt="image" src="https://github.com/user-attachments/assets/472e82a9-d356-43b2-8f6e-693b2037c2e3" />


🔹 Evaluation Output
<img width="1899" height="878" alt="image" src="https://github.com/user-attachments/assets/2df83c05-ccf0-4cf1-b2e1-21252a2e98a5" />
<img width="1906" height="875" alt="image" src="https://github.com/user-attachments/assets/6aa14c5e-9ad0-4d9e-9e14-adbf032677f4" />
<img width="1903" height="854" alt="image" src="https://github.com/user-attachments/assets/8b5edb98-25fc-46f7-8886-435f0d8e073c" />
<img width="1919" height="876" alt="image" src="https://github.com/user-attachments/assets/6366ed87-37a0-46b6-a077-7ab77d9308c2" />



🔹 Dark Mode
<img width="1896" height="864" alt="image" src="https://github.com/user-attachments/assets/3871e0de-7407-44d9-9e4b-472c3a2e026d" />



# 🛠️ Local Setup:
```bash

git clone https://github.com/RITIKYADAV0070/LIVE-ROLEPLAY-SCORING-ENGINE.git
cd LIVE-ROLEPLAY-SCORING-ENGINE/my-app
npm install
npm run dev
```

# Create .env.local:
```bash

OPENROUTER_API_KEY=your_key_here
AI_MODEL=meta-llama/llama-3.1-70b-instruct
```
# 📡 API Endpoint: /api/evaluate
```bash

Method: POST
Body:

{
  "transcript": "Your pitch transcript here..."
}
```

# Response:
```bash

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
```
# 🎥 Loom Video Summary (Script Included)

I’ve prepared your perfect Loom script here:
👉 “Explain what to say step-by-step”
https://chat.openai.com/share/placeholder

(Ask again and I’ll generate the exact video script.)

# 📬 Author

Ritik Yadav
AI Engineer & Full-Stack Developer


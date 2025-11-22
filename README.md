🚀 LIVE ROLEPLAY SCORING ENGINE
PitchSense AI – SDE I Round 2 Assignment (Option A)

This repository contains my submission for PitchSense AI — SDE I Round 2, implementing Option A: Live Roleplay Scoring Engine using the Vercel AI SDK.

The application evaluates a pitch transcript and returns a structured JSON output with scoring, category breakdown, insights, and a final verdict.
It includes guardrails, JSON enforcement, and a clean fresher-friendly dashboard UI.

⭐ Features
✅ LLM Evaluation (Vercel AI SDK)

Uses generateText() from the official Vercel AI SDK to call OpenRouter models.

✅ Structured, Stable JSON Output

The backend guarantees the following format:

{
  "score": 0.82,
  "category_scores": {
    "clarity": 0.9,
    "depth": 0.75,
    "structure": 0.8
  },
  "insights": [
    "Strong clarity and problem description",
    "Could include more market depth"
  ],
  "verdict": "Clear and well-structured pitch with room for added detail."
}

✅ Guardrails Implemented

Profanity detector

Transcript length validator

Strict JSON-only enforcement

No chain-of-thought

Simple rate limiter (5 req/min/IP)

✅ Dashboard UI

Sidebar layout

Clean & simple fresher-friendly design

Dark/Light mode toggle

Score, category scores, insights, verdict

Saves past evaluations locally

✅ Deployable on Vercel

Zero-config deployment support for Next.js.

🧩 Project Structure
my-app/
 ├── pages/
 │    ├── index.js               # Main dashboard UI
 │    └── api/
 │         └── evaluate.js       # Evaluation API endpoint (core of assignment)
 ├── styles/
 ├── public/
 ├── .env.local                  # (ignored) API keys
 ├── package.json
 ├── next.config.mjs
 └── README.md

🛠 Tech Stack

Next.js 14

React

Vercel AI SDK (ai)

OpenRouter LLM provider

Zod validation

LocalStorage history

🔐 Environment Variables

Create a file named .env.local:

OPENROUTER_API_KEY=your_api_key_here
AI_MODEL=meta-llama/llama-3.1-70b-instruct


⚠️ .env.local is ignored from Git and should NOT be uploaded.

▶️ Installation & Running Locally
git clone https://github.com/RITIKYADAV0070/LIVE-ROLEPLAY-SCORING-ENGINE
cd LIVE-ROLEPLAY-SCORING-ENGINE
npm install
npm run dev


App runs at:
👉 http://localhost:3000

🌐 Deployment (Vercel)

Go to https://vercel.com

Import this repository

Add the 2 environment variables

Click Deploy

Copy the live URL for submission

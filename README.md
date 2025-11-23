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


# ✨ Key Features
🔹 Live Pitch Evaluation

Paste any pitch → system evaluates:

Overall Score

Clarity

Depth

Structure

AI-generated insights

Final verdict summary

All returned in clean JSON.

🔹 Advanced Guardrails

Built for reliability and safety:

JSON-strict responses

Zod schema validation

Input sanitization

Basic rate-limiting

No chain-of-thought leak

Auto-repair for malformed JSON

🔹 Premium Dashboard UI (Light + Dark Mode)

A modern SaaS-like interface:

Upgraded sidebar navigation

Smooth active-highlight animations

Premium card design

Compact grid layout

Centralized content container

Fully responsive

🔹 Smart Metrics & Trends

The system computes:

Average score

Best score

Category averages

Score distribution

Strength vs. weakness

Auto-generated improvement tips

Displayed with clean visual bars.

🔹 History Panel (Local Storage)

Stores your last 5 evaluations:

Score

Snippet preview

Timestamp

Click to reload pitch + results

Zero backend database required.

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
<img width="1916" height="855" alt="image" src="https://github.com/user-attachments/assets/5fa391a8-5c7a-499e-99b5-0e9f32d12b2a" />


🔹 Evaluation Output
<img width="1919" height="849" alt="image" src="https://github.com/user-attachments/assets/af6308cb-3d1d-40fa-a685-6ed4b84c4c9f" />
<img width="1919" height="854" alt="image" src="https://github.com/user-attachments/assets/6c0ceef1-0371-406a-b010-53af5c224964" />
<img width="1918" height="851" alt="image" src="https://github.com/user-attachments/assets/225168b4-0fe2-40d7-bb71-f8818bb91f80" />
<img width="1914" height="862" alt="image" src="https://github.com/user-attachments/assets/0cdd0932-7fc5-4e39-a382-471753a7735c" />


🔹 Light Mode
<img width="1897" height="854" alt="image" src="https://github.com/user-attachments/assets/54ef0f28-2d9b-4141-98eb-02cea48dc177" />



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
  https://www.loom.com/share/7f37e56eb38340bdbe887927884c5448

# 📬 Author

Ritik Yadav
AI Engineer & Full-Stack Developer


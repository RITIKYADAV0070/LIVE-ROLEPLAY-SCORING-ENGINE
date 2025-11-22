// pages/api/evaluate.js

import { generateText } from "ai";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";

// 🔥 OpenRouter client
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// 🔍 What JSON we expect from the model
const ResultSchema = z.object({
  score: z.number().optional(),
  category_scores: z.object({
    clarity: z.number().optional(),
    depth: z.number().optional(),
    structure: z.number().optional(),
  }).optional(),
  insights: z.array(z.string()).optional(),
  verdict: z.string().optional(),
});

// 🧹 Extract JSON from messy model text
function extractJSON(str) {
  const a = str.indexOf("{");
  const b = str.lastIndexOf("}");
  if (a === -1 || b === -1 || b <= a) return null;
  try {
    return JSON.parse(str.slice(a, b + 1));
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "POST only" });

  const { transcript = "" } = req.body;

  // 🔧 System Prompt — tells model EXACTLY what JSON to return
  const systemPrompt = `
You are an AI evaluation engine.

Return ONLY a JSON object exactly like this:

{
  "score": number,
  "category_scores": {
    "clarity": number,
    "depth": number,
    "structure": number
  },
  "insights": ["string"],
  "verdict": "string"
}

Rules:
- Do NOT add commentary.
- Do NOT add explanation.
- Do NOT add markdown.
- Strict JSON only.
`;

  const userPrompt = `
Evaluate this pitch transcript:

"""${transcript.replace(/```/g, "'")}"""
`;

  try {
    const { text } = await generateText({
      model: openrouter.chat(process.env.AI_MODEL),
      prompt: systemPrompt + userPrompt,
      temperature: 0,
      maxTokens: 700,
    });

    // 🔥 LOG WHAT MODEL RETURNED (IMPORTANT)
    console.log("\n\n====== RAW MODEL OUTPUT ======\n", text);

    const parsed = extractJSON(text || "");
    console.log("\n====== PARSED JSON ======\n", parsed);

    // ❌ If JSON invalid → return raw output to UI
    if (!parsed)
      return res.status(500).json({
        ok: false,
        error: "Failed to parse JSON from model.",
        modelOutput: text,
      });

    const validated = ResultSchema.safeParse(parsed);

    if (!validated.success)
      return res.status(500).json({
        ok: false,
        error: "Schema validation failed",
        modelOutput: text,
        parsedJSON: parsed,
        schemaIssues: validated.error,
      });

    return res.status(200).json({
      ok: true,
      result: validated.data,
    });

  } catch (err) {
    console.error("Eval error:", err);
    return res.status(500).json({
      ok: false,
      error: String(err),
    });
  }
}

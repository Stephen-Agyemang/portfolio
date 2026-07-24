/* eslint-disable no-undef */
import OpenAI from "openai";
import { applyCors, isOriginAllowed, enforceRateLimit, rejectRateLimited } from "./guards.js";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const MAX_INTENT_CHARS = 600;

export default async function handler(req, res) {
    applyCors(req, res);
    if (req.method === "OPTIONS") return res.status(204).end();

    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const origin = req.headers?.origin;
    if (origin && !isOriginAllowed(origin)) {
        return res.status(403).json({ error: "Origin not allowed" });
    }

    try {
        const { userIntent } = req.body;

        if (!userIntent || typeof userIntent !== "string") {
            return res.status(400).json({ error: "Invalid intent input" });
        }

        if (userIntent.length > MAX_INTENT_CHARS) {
            return res.status(400).json({ error: "Intent too long" });
        }

        const rateLimit = await enforceRateLimit(req, "email");
        if (!rateLimit.allowed) {
            return rejectRateLimited(res, rateLimit);
        }

        const completion = await client.chat.completions.create({
            model: "gpt-5.6-luna",
            messages: [
                {
                    role: "system",
                    content: `You are an expert professional communication assistant. 
          Your goal is to help a user draft an outreach email to Stephen Agyemang, a computer science student looking for real-world software engineering experience.
          Based on the user's raw intent, generate 2 distinct options:
          1. "Polished Professional": Formal, concise, and business-ready. Sign off with "[Your Name]".
          2. "Friendly & Direct": Casual but professional, getting straight to the point. Sign off with "[Your Name]".
          
          Return the response in strictly valid JSON format with the following structure:
          {
            "options": [
              { "style": "Polished Professional", "subject": "Subject line here", "body": "Email body here...\\n\\nBest regards,\\n[Your Name]" },
              { "style": "Friendly & Direct", "subject": "Subject line here", "body": "Email body here...\\n\\nBest,\\n[Your Name]" }
            ]
          }`
                },
                {
                    role: "user",
                    content: userIntent
                }
            ],
            response_format: { type: "json_object" },
        });

        res.status(200).json(JSON.parse(completion.choices[0].message.content));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to generate email drafts"
        });
    }
}
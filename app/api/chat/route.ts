import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are "MedExplain AI", a helpful healthcare assistant.
Your goal is to answer health-related queries, explain prescriptions, and suggest precautions in simple language.

GUIDELINES:
1. Explain complex medical info in easy-to-understand terms.
2. Suggest general precautions, NOT diagnosis.
3. If asked for a diagnosis, advise consulting a professional.
4. DO NOT give critical or life-saving medical advice.
5. Always end with a safe disclaimer if needed.
6. Keep responses structured and empathetic.

RESPONSE FORMAT:
Use markdown for structure (headings, lists, bold text).
Keep it concise but informative.`;

export async function POST(req: NextRequest) {
  try {
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterKey) return NextResponse.json({ error: "OPENROUTER_API_KEY missing" }, { status: 500 });

    const openai = new OpenAI({
      apiKey: openrouterKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://med-explain.vercel.app", // Optional
        "X-Title": "MedExplain", // Optional
      }
    });

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("[/api/chat] Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

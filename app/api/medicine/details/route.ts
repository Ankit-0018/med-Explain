import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const DETAILS_PROMPT = `You are a clinical pharmacist AI. Provide detailed information about the requested medicine.

OUTPUT STRUCTURE (JSON):
{
  "name": "Medicine Name",
  "why": "What the medicine is used for and why doctors recommend it",
  "how": "Normal dosage guidance (general, not prescriptive)",
  "precautions": "Important precautions for the patient",
  "sideEffects": ["Basic side effect 1", "Basic side effect 2"],
  "warning": "Warning for misuse or overdose",
  "effectiveness": "What makes it more effective (e.g. taking with food, timing, etc.)",
  "dosageGuidance": "Detailed dosage information and how to take it correctly"
}

RULES:
1. Make response simple, structured, and easy to understand.
2. Use headings and bullet points style internally if needed.
3. Keep it short but informative.
4. Add a standard medical disclaimer.`;

export async function POST(req: NextRequest) {
  try {
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterKey) return NextResponse.json({ error: "OPENROUTER_API_KEY missing" }, { status: 500 });

    const openai = new OpenAI({
      apiKey: openrouterKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://med-explain.vercel.app",
        "X-Title": "MedExplain",
      }
    });

    const { name, condition } = await req.json();

    if (!name) return NextResponse.json({ error: "Medicine name missing" }, { status: 400 });

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: DETAILS_PROMPT },
        { role: "user", content: `Medicine: ${name}\nCondition: ${condition || "General Use"}` }
      ],
      response_format: { type: "json_object" },
    });

    const details = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(details);
  } catch (error: any) {
    console.error("[/api/medicine/details] Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const COLORS = [
  "#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#a855f7",
];

const EXTRACTION_PROMPT = `You are an advanced medical assistant AI. You receive doctor-patient consultation transcripts and must transform them into a structured, UI-ready JSON response.

CRITICAL: Return ONLY valid JSON. No markdown. No code fences. No extra text.

OUTPUT STRUCTURE:
{
  "transcript": "The cleaned full transcript text",
  "ui": {
    "summaryCard": {
      "title": "Short condition name (e.g. 'Common Cold', 'Type 2 Diabetes')",
      "description": "2-3 sentence plain-English explanation for a non-medical user",
      "severity": "low | medium | high",
      "action": "The single most important thing the patient should do"
    },
    "medicineCards": [
      {
        "id": "1",
        "name": "Medicine Name",
        "dosage": "e.g. 500mg",
        "frequency": "e.g. Twice daily",
        "timing": ["morning", "night"],
        "duration": "e.g. 5 days",
        "instructions": "One clear sentence instruction",
        "status": "active",
        "priority": "high | normal",
        "confidence": 90,
        "details": {
          "why": "Why prescribed based on this consultation",
          "how": "Patient-friendly explanation of mechanism",
          "sideEffects": ["Side effect 1", "Side effect 2", "Side effect 3"],
          "food": "Food timing instructions"
        }
      }
    ],
    "timeline": [
      {
        "day": "Day 1",
        "events": [
          {
            "time": "08:00 AM",
            "title": "Medicine Name Dosage",
            "type": "medicine | precaution | test",
            "details": "Short instruction for this specific event"
          }
        ]
      }
    ],
    "alerts": [
      {
        "type": "warning | reminder | critical",
        "message": "Clear, actionable alert message"
      }
    ],
    "precautionsCard": {
      "title": "Precautions",
      "items": ["Precaution 1", "Precaution 2"]
    },
    "doctorNotes": {
      "keyPoints": ["Key observation or instruction from the doctor"]
    }
  }
}

RULES:
1. timing[] must only contain: "morning", "afternoon", "evening", "night" — infer from frequency
2. "twice daily" → ["morning", "night"]
3. "three times daily" → ["morning", "afternoon", "night"]
4. "once daily" → ["morning"] unless specified as night
5. Expand duration into full timeline (e.g. "3 days" → Day 1, Day 2, Day 3)
6. Each timeline day must list ALL medicine events for that day, sorted chronologically
7. Add precaution events to Day 1 timeline
8. confidence: 100 = clearly stated, 70-99 = strong inference, 40-69 = moderate inference, <40 = mark unknown
9. priority: "high" if antibiotic, critical medicine, or explicitly urgent
10. severity: "low" = minor issue, "medium" = infection/common illness, "high" = chronic/serious condition
11. alerts: ALWAYS include at least 2 (one critical or warning, one reminder)
12. Do NOT invent medicine names not mentioned in the transcript
13. Fill sideEffects and food from medical knowledge if not stated
14. doctorNotes should capture direct observations or warnings from the doctor`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in .env.local" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file received" }, { status: 400 });
    }

    // ── Step 1: Transcribe audio with Whisper via Groq ────────────────────────
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      language: "en",
      response_format: "text",
    });

    const transcriptText = typeof transcription === "string"
      ? transcription
      : (transcription as any).text ?? "";

    if (!transcriptText.trim()) {
      return NextResponse.json(
        { error: "Could not transcribe audio — no speech detected" },
        { status: 400 }
      );
    }

    // ── Step 2: Structure data using Llama via Groq ───────────────────────────
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: EXTRACTION_PROMPT },
        { role: "user", content: `Here is the consultation transcript:\n\n${transcriptText}` },
      ],
      temperature: 0.2,
      max_tokens: 8192,
      response_format: { type: "json_object" },
    });

    const rawText = chatCompletion.choices?.[0]?.message?.content?.trim() ?? "";

    // Strip markdown code fences if present
    const jsonText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let parsed: { transcript: string; ui: any };
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON", raw: rawText },
        { status: 500 }
      );
    }

    // Assign colors to medicine cards and ensure IDs
    const ui = parsed.ui ?? {};
    if (Array.isArray(ui.medicineCards)) {
      ui.medicineCards = ui.medicineCards.map((med: any, index: number) => ({
        ...med,
        id: med.id ?? String(index + 1),
        color: COLORS[index % COLORS.length],
        details: med.details ?? {
          why: "As prescribed by your doctor.",
          how: "Works to address your condition.",
          sideEffects: [],
          food: "Follow your doctor's instructions.",
        },
      }));
    }

    return NextResponse.json({
      transcript: parsed.transcript ?? transcriptText,
      ui,
    });
  } catch (error: any) {
    console.error("[/api/transcript] Error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

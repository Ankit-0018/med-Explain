import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const COLORS = [
  "#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#a855f7",
];

const EXTRACTION_PROMPT = `You are an advanced medical assistant AI. You receive doctor-patient consultation transcripts and must transform them into a structured, UI-ready JSON response.

CRITICAL: Return ONLY valid JSON. No markdown. No code fences. No extra text.

OUTPUT STRUCTURE:
{
  "transcript": "The cleaned full transcript text",
  "condition": "The detected health condition",
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
          "effectiveness": "Tips to make the medicine more effective",
          "dosageGuidance": "Detailed dosage and administration guidance",
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

const VALIDATION_PROMPT = `You are a medical data validator. Your job is to verify extracted medical information.

RULES:
1. Check if the medicine is real and commonly used.
2. Suggest the closest valid medicine if misspelled.
3. Compare medicine with the detected condition.
4. Return a confidence score (0-1).
5. Add flags if necessary: "unknown_medicine", "possible_misspelling", "context_mismatch".

OUTPUT JSON:
{
"is_valid_medicine": boolean,
"suggested_correction": "string or null",
"context_relevance": "common | possible | unlikely",
"confidence": number (0 to 1),
"flags": ["reason1", "reason2"],
"final_medicine": "string",
"store_in_db": true
}`;

async function validateMedicine(openai: OpenAI, medicine: string, condition: string) {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [
      { role: "system", content: VALIDATION_PROMPT },
      {
        role: "user",
        content: `Medicine: ${medicine}\nCondition: ${condition}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content || "{}");
}

export async function POST(req: NextRequest) {
  try {
    const groqKey = process.env.GROQ_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    if (!groqKey) return NextResponse.json({ error: "GROQ_API_KEY missing" }, { status: 500 });
    if (!openrouterKey) return NextResponse.json({ error: "OPENROUTER_API_KEY missing" }, { status: 500 });

    const groq = new Groq({ apiKey: groqKey });
    const openai = new OpenAI({
      apiKey: openrouterKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://med-explain.vercel.app",
        "X-Title": "MedExplain",
      }
    });
    const supabase = await createClient();

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file received" }, { status: 400 });
    }

    // ── Step 1: Transcribe ──────────────────────────────────────────────────
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      language: "en",
      response_format: "text",
    });

    const transcriptText = typeof transcription === "string" ? transcription : (transcription as any).text ?? "";

    if (!transcriptText.trim()) {
      return NextResponse.json({ error: "No speech detected" }, { status: 400 });
    }

    // ── Step 2: Extraction ──────────────────────────────────────────────────
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: EXTRACTION_PROMPT },
        { role: "user", content: `Transcript:\n${transcriptText}` },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(chatCompletion.choices[0].message.content || "{}");
    const ui = parsed.ui ?? {};
    const condition = parsed.condition ?? ui.summaryCard?.title ?? "unknown";

    // ── Step 3: Validation Pipeline ──────────────────────────────────────────
    if (Array.isArray(ui.medicineCards)) {
      const validationPromises = ui.medicineCards.map(async (med: any, index: number) => {
        // Check cache first
        const { data: cached } = await supabase
          .from("medicine_cache")
          .select("*")
          .eq("medicine_name", med.name.toLowerCase())
          .single();

        let validation;
        if (cached && cached.verified) {
          validation = {
            is_valid_medicine: true,
            suggested_correction: null,
            context_relevance: "common",
            confidence: 1.0,
            flags: [],
            final_medicine: med.name,
            store_in_db: false
          };
          // Update usage
          await supabase.from("medicine_cache").update({ 
            usage_count: (cached.usage_count || 0) + 1,
            last_used: new Date().toISOString()
          }).eq("id", cached.id);
        } else {
          validation = await validateMedicine(openai, med.name, condition);
          
          // Update/Insert cache
          if (validation.is_valid_medicine) {
            await supabase.from("medicine_cache").upsert({
              medicine_name: validation.final_medicine.toLowerCase(),
              verified: true,
              usage_count: 1,
              last_used: new Date().toISOString()
            }, { onConflict: "medicine_name" });
          }
        }

        return {
          ...med,
          id: med.id ?? String(index + 1),
          color: COLORS[index % COLORS.length],
          validation
        };
      });

      ui.medicineCards = await Promise.all(validationPromises);
    }

    // ── Step 4: Store results ───────────────────────────────────────────────
    const detectedMedicines = ui.medicineCards?.map((m: any) => m.name) || [];
    const avgConfidence = ui.medicineCards?.reduce((acc: number, m: any) => acc + (m.validation?.confidence || 0), 0) / (detectedMedicines.length || 1);
    
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("processed_results").insert({
      user_id: user?.id,
      transcription: transcriptText,
      detected_medicine: detectedMedicines,
      corrected_results: ui,
      confidence_score: avgConfidence,
      flags: ui.medicineCards?.flatMap((m: any) => m.validation?.flags || []) || []
    });

    return NextResponse.json({
      transcript: parsed.transcript ?? transcriptText,
      ui,
    });
  } catch (error: any) {
    console.error("[/api/transcript] Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

// ─── UI-Ready JSON Types ──────────────────────────────────────────────────────

export type Severity = "low" | "medium" | "high";
export type AlertType = "warning" | "reminder" | "critical";
export type EventType = "medicine" | "precaution" | "test";
export type Priority = "high" | "normal";
export type MedicineStatus = "active" | "completed" | "paused";
export type TimingSlot = "morning" | "afternoon" | "evening" | "night";

// ─── Summary Card ─────────────────────────────────────────────────────────────

export interface SummaryCard {
  title: string;
  description: string;
  severity: Severity;
  action: string;
}

// ─── Medicine Card ────────────────────────────────────────────────────────────

export interface MedicineCard {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: TimingSlot[];
  duration: string;
  instructions: string;
  status: MedicineStatus;
  priority: Priority;
  confidence: number; // 0–100
  color: string;

  // Legacy detail fields (enriched by AI)
  details: {
    why: string;
    how: string;
    sideEffects: string[];
    food: string;
  };
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export interface TimelineEvent {
  time: string;
  title: string;
  type: EventType;
  details: string;
}

export interface TimelineDay {
  day: string; // "Day 1", "Day 2" …
  events: TimelineEvent[];
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export interface Alert {
  type: AlertType;
  message: string;
}

// ─── Precautions ──────────────────────────────────────────────────────────────

export interface PrecautionsCard {
  title: string;
  items: string[];
}

// ─── Doctor Notes ─────────────────────────────────────────────────────────────

export interface DoctorNotes {
  keyPoints: string[];
}

// ─── Root UI Data ─────────────────────────────────────────────────────────────

export interface UIData {
  summaryCard: SummaryCard;
  medicineCards: MedicineCard[];
  timeline: TimelineDay[];
  alerts: Alert[];
  precautionsCard: PrecautionsCard;
  doctorNotes: DoctorNotes;
}

export interface TranscriptResponse {
  transcript: string;
  ui: UIData;
}

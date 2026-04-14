import type { UIData } from "./types";

export const MOCK_UI_DATA: UIData = {
  summaryCard: {
    title: "Upper Respiratory Infection",
    description:
      "You have a mild throat infection with fever. The doctor has prescribed antibiotics and pain relief medicine. Rest and stay hydrated.",
    severity: "medium",
    action: "Complete the full 5-day course of antibiotics even if you feel better.",
  },
  medicineCards: [
    {
      id: "1",
      name: "Paracetamol",
      dosage: "500mg",
      frequency: "Twice daily",
      timing: ["morning", "night"],
      duration: "5 days",
      instructions: "Take after food. Do not exceed 4 tablets in 24 hours.",
      status: "active",
      priority: "normal",
      confidence: 95,
      color: "#8b5cf6",
      details: {
        why: "Prescribed to control fever and reduce throat pain from your infection.",
        how: "Blocks pain signals in the brain and helps regulate body temperature.",
        sideEffects: ["Nausea", "Stomach pain", "Headache", "Rare liver issues"],
        food: "Take with a snack or meal to minimize stomach irritation.",
      },
    },
    {
      id: "2",
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      timing: ["morning", "afternoon", "night"],
      duration: "5 days",
      instructions: "Finish the full course. Do not skip doses.",
      status: "active",
      priority: "high",
      confidence: 88,
      color: "#06b6d4",
      details: {
        why: "Prescribed to treat the bacterial throat infection identified today.",
        how: "Stops bacteria from forming the cell walls they need to survive.",
        sideEffects: ["Diarrhea", "Rash", "Nausea", "Yeast infection"],
        food: "Take with food to improve absorption and reduce nausea.",
      },
    },
    {
      id: "3",
      name: "Cetirizine",
      dosage: "10mg",
      frequency: "Once daily",
      timing: ["night"],
      duration: "5 days",
      instructions: "Avoid driving or operating heavy machinery after taking this.",
      status: "active",
      priority: "normal",
      confidence: 79,
      color: "#10b981",
      details: {
        why: "To reduce nasal congestion and runny nose associated with your infection.",
        how: "Blocks histamine receptors to reduce allergic symptoms and congestion.",
        sideEffects: ["Drowsiness", "Dry mouth", "Dizziness", "Headache"],
        food: "Can be taken with or without food. Best at bedtime.",
      },
    },
  ],
  timeline: [
    {
      day: "Day 1",
      events: [
        { time: "08:00 AM", title: "Paracetamol 500mg", type: "medicine", details: "Take after breakfast" },
        { time: "02:00 PM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after lunch" },
        { time: "08:00 AM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after breakfast" },
        { time: "09:00 PM", title: "Cetirizine 10mg", type: "medicine", details: "Take at bedtime" },
        { time: "09:00 PM", title: "Paracetamol 500mg", type: "medicine", details: "Take after dinner" },
        { time: "09:00 PM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after dinner" },
        { time: "All Day", title: "Drink plenty of water", type: "precaution", details: "Minimum 2L of water daily" },
      ],
    },
    {
      day: "Day 2",
      events: [
        { time: "08:00 AM", title: "Paracetamol 500mg", type: "medicine", details: "Take after breakfast" },
        { time: "08:00 AM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after breakfast" },
        { time: "02:00 PM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after lunch" },
        { time: "09:00 PM", title: "Paracetamol 500mg", type: "medicine", details: "Take after dinner" },
        { time: "09:00 PM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after dinner" },
        { time: "09:00 PM", title: "Cetirizine 10mg", type: "medicine", details: "Take at bedtime" },
        { time: "All Day", title: "Rest and avoid cold foods", type: "precaution", details: "Avoid ice cream, cold drinks" },
      ],
    },
    {
      day: "Day 3",
      events: [
        { time: "08:00 AM", title: "Paracetamol 500mg", type: "medicine", details: "Take after breakfast" },
        { time: "08:00 AM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after breakfast" },
        { time: "02:00 PM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after lunch" },
        { time: "09:00 PM", title: "Paracetamol 500mg", type: "medicine", details: "Take after dinner" },
        { time: "09:00 PM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after dinner" },
        { time: "09:00 PM", title: "Cetirizine 10mg", type: "medicine", details: "Take at bedtime" },
      ],
    },
    {
      day: "Day 4",
      events: [
        { time: "08:00 AM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after breakfast" },
        { time: "02:00 PM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after lunch" },
        { time: "09:00 PM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after dinner" },
        { time: "09:00 PM", title: "Cetirizine 10mg", type: "medicine", details: "Take at bedtime" },
      ],
    },
    {
      day: "Day 5",
      events: [
        { time: "08:00 AM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after breakfast — Last day!" },
        { time: "02:00 PM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after lunch" },
        { time: "09:00 PM", title: "Amoxicillin 500mg", type: "medicine", details: "Take after dinner — Course complete!" },
        { time: "09:00 PM", title: "Cetirizine 10mg", type: "medicine", details: "Take at bedtime — Last dose" },
      ],
    },
  ],
  alerts: [
    {
      type: "critical",
      message: "Complete the full antibiotic course. Stopping early can cause resistant bacteria.",
    },
    {
      type: "warning",
      message: "Avoid alcohol while taking Amoxicillin — it can reduce effectiveness.",
    },
    {
      type: "reminder",
      message: "Follow up with your doctor if fever persists beyond 3 days.",
    },
  ],
  precautionsCard: {
    title: "Precautions",
    items: [
      "Drink at least 2 litres of water daily",
      "Avoid cold foods and drinks (ice cream, cold water)",
      "Get 8+ hours of rest each night",
      "Avoid smoking or secondhand smoke exposure",
      "Do not share your medicines with others",
      "Store medicines in a cool, dry place away from sunlight",
    ],
  },
  doctorNotes: {
    keyPoints: [
      "Throat appears inflamed — bacterial infection confirmed",
      "Fever is mild (100.2°F) — should subside in 2-3 days with medication",
      "No chest congestion detected — lungs are clear",
      "Return immediately if rash, difficulty breathing, or high fever (>103°F) develops",
      "Schedule a follow-up in 7 days if symptoms persist",
    ],
  },
};

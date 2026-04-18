"use client";

import { motion } from "framer-motion";
import { Pill, Clock, Info, Star, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { MedicineCard as MedicineCardType, TimingSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

const TIMING_CONFIG: Record<TimingSlot, { label: string; emoji: string }> = {
  morning: { label: "Morning", emoji: "🌅" },
  afternoon: { label: "Afternoon", emoji: "☀️" },
  evening: { label: "Evening", emoji: "🌆" },
  night: { label: "Night", emoji: "🌙" },
};

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const color =
    pct >= 80 ? "bg-emerald-400" : pct >= 60 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/30">
          AI Confidence
        </span>
        <span className="text-[9px] font-bold text-foreground/50">{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

interface MedicineCardProps {
  medicine: MedicineCardType;
  onClick: (medicine: MedicineCardType) => void;
  index: number;
}

export const MedicineCard = ({ medicine, onClick, index }: MedicineCardProps) => {
  const isHighPriority = medicine.priority === "high";
  const validation = medicine.validation;
  const isLowConfidence = validation && validation.confidence < 0.7;
  const hasFlags = validation && validation.flags.length > 0;
  const isInvalid = validation && !validation.is_valid_medicine;

  return (
    <GlassCard
      delay={index * 0.08}
      className={cn(
        "cursor-pointer group hover:bg-white/5 transition-all duration-300 border-l-4 !p-5 relative overflow-hidden",
        (isLowConfidence || isInvalid) ? "border-red-500/50" : ""
      )}
      style={{ borderLeftColor: medicine.color } as any}
      onClick={() => onClick(medicine)}
    >
      {/* Validation Banner */}
      {(isLowConfidence || isInvalid || hasFlags) && (
        <div className="absolute top-0 right-0 bg-red-500/10 border-l border-b border-red-500/20 px-3 py-1 flex items-center gap-1.5 rounded-bl-xl">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          <span className="text-[8px] font-black uppercase tracking-[0.15em] text-red-400">Issue Detected</span>
        </div>
      )}

      {/* Top row */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
            style={{ backgroundColor: `${medicine.color}22`, color: medicine.color }}
          >
            <Pill className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors truncate">
              {medicine.name}
            </h3>
            <p className="text-[11px] text-foreground/40 font-medium">{medicine.dosage}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isHighPriority && (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-red-400/10 border border-red-400/25 text-red-400">
              <Star className="w-2.5 h-2.5 fill-current" />
              Priority
            </span>
          )}
        </div>
      </div>

      {/* Validation Details Card */}
      {validation && (isLowConfidence || hasFlags) && (
        <div className="mb-4 bg-red-500/5 rounded-2xl p-4 border border-red-500/10 space-y-3">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
            <span className="text-foreground/30">Confidence Score</span>
            <span className={validation.confidence < 0.5 ? "text-red-400" : "text-amber-400"}>
              {Math.round(validation.confidence * 100)}% ({validation.confidence < 0.5 ? "Critical" : "Review Needed"})
            </span>
          </div>

          {validation.suggested_correction && (
            <div className="flex items-center gap-2 text-[11px]">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <span className="text-foreground/40 font-medium whitespace-nowrap">Suggested:</span>
              <span className="font-bold text-primary underline decoration-primary/20 underline-offset-4 decoration-dotted">
                {validation.suggested_correction}
              </span>
            </div>
          )}

          {validation.flags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {validation.flags.map((flag, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/10 text-[8px] font-bold text-red-400/80 uppercase tracking-tighter">
                  {flag.replace("_", " ")}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Frequency + Duration row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-foreground/50">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{medicine.frequency}</span>
          </div>
          {medicine.duration && (
            <div className="flex items-center gap-1.5 text-foreground/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{medicine.duration}</span>
            </div>
          )}
        </div>

        {/* Compact Timing Indicators */}
        {medicine.timing?.length > 0 && (
          <div className="flex gap-1">
            {medicine.timing.map((slot) => {
              const t = TIMING_CONFIG[slot];
              return (
                <div
                  key={slot}
                  title={t?.label}
                  className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px]"
                >
                  {t?.emoji}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Instructions */}
      {medicine.instructions && (
        <div className="bg-white/5 rounded-xl p-3 mb-4 flex gap-3">
          <Info className="w-3.5 h-3.5 text-foreground/30 shrink-0 mt-0.5" />
          <p className="text-[11px] text-foreground/50 leading-relaxed italic">
            {medicine.instructions}
          </p>
        </div>
      )}

      {/* Confidence bar */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex-1">
          <ConfidenceBar value={medicine.confidence ?? 0} />
        </div>
        <div className="ml-4 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover:translate-x-1 transition-transform">
          See Detail
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </GlassCard>
  );
};

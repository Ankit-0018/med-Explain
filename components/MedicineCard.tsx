"use client";

import { motion } from "framer-motion";
import { Pill, Clock, Info, Star, CheckCircle2 } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { MedicineCard as MedicineCardType, TimingSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

const TIMING_CONFIG: Record<TimingSlot, { label: string; emoji: string }> = {
  morning:   { label: "Morning",   emoji: "🌅" },
  afternoon: { label: "Afternoon", emoji: "☀️" },
  evening:   { label: "Evening",   emoji: "🌆" },
  night:     { label: "Night",     emoji: "🌙" },
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

  return (
    <GlassCard
      delay={index * 0.08}
      className="cursor-pointer group hover:bg-white/5 transition-all duration-300 border-l-4 !p-5"
      style={{ borderLeftColor: medicine.color } as any}
    >
      {/* Top row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${medicine.color}22`, color: medicine.color }}
          >
            <Pill className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
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
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onClick(medicine);
            }}
            className="p-1.5 rounded-lg bg-white/5 text-foreground/30 hover:text-foreground transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Frequency + Duration row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-foreground/50">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{medicine.frequency}</span>
        </div>
        {medicine.duration && (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-foreground/30" />
            <span className="text-xs text-foreground/40 font-medium">{medicine.duration}</span>
          </div>
        )}
      </div>

      {/* Timing pills */}
      {medicine.timing?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {medicine.timing.map((slot) => {
            const t = TIMING_CONFIG[slot];
            if (!t) return null;
            return (
              <span
                key={slot}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full glass-dark border-white/8"
              >
                {t.emoji} {t.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Instructions */}
      {medicine.instructions && (
        <p className="text-[11px] text-foreground/50 leading-snug mb-3 pl-1 border-l-2 border-white/10 italic">
          {medicine.instructions}
        </p>
      )}

      {/* Confidence bar */}
      <ConfidenceBar value={medicine.confidence ?? 0} />
    </GlassCard>
  );
};

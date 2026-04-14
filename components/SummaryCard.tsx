"use client";

import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Activity } from "lucide-react";
import type { SummaryCard as SummaryCardType } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEVERITY_CONFIG = {
  low: {
    label: "Low Severity",
    labelClass: "text-emerald-400",
    badgeClass: "bg-emerald-400/10 border-emerald-400/30 text-emerald-400",
    borderClass: "border-emerald-500/20",
    glowClass: "from-emerald-500/10 to-transparent",
    icon: ShieldCheck,
    iconClass: "text-emerald-400",
  },
  medium: {
    label: "Medium Severity",
    labelClass: "text-amber-400",
    badgeClass: "bg-amber-400/10 border-amber-400/30 text-amber-400",
    borderClass: "border-amber-500/20",
    glowClass: "from-amber-500/10 to-transparent",
    icon: AlertTriangle,
    iconClass: "text-amber-400",
  },
  high: {
    label: "High Severity",
    labelClass: "text-red-400",
    badgeClass: "bg-red-400/10 border-red-400/30 text-red-400",
    borderClass: "border-red-500/20",
    glowClass: "from-red-500/10 to-transparent",
    icon: Activity,
    iconClass: "text-red-400",
  },
};

export const SummaryCard = ({ data }: { data: SummaryCardType }) => {
  const config = SEVERITY_CONFIG[data.severity] ?? SEVERITY_CONFIG.medium;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border p-5 glass",
        config.borderClass
      )}
    >
      {/* Background gradient tint */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", config.glowClass)} />

      <div className="relative z-10 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-xl", config.badgeClass.split(" ").slice(0, 1)[0])}>
              <Icon className={cn("w-4 h-4", config.iconClass)} />
            </div>
            <h3 className="text-lg font-bold tracking-tight leading-tight">{data.title}</h3>
          </div>
          <span className={cn("shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border", config.badgeClass)}>
            {config.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/70 leading-relaxed">
          {data.description}
        </p>

        {/* Action */}
        {data.action && (
          <div className={cn("flex items-start gap-2 text-xs font-semibold px-3 py-2.5 rounded-2xl border", config.badgeClass)}>
            <span className="shrink-0 mt-0.5">→</span>
            <span>{data.action}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

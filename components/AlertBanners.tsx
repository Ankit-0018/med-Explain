"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Bell, AlertOctagon, X } from "lucide-react";
import type { Alert } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALERT_CONFIG = {
  critical: {
    icon: AlertOctagon,
    containerClass: "bg-red-500/10 border-red-500/25 shadow-red-500/10",
    iconClass: "text-red-400",
    titleClass: "text-red-400",
    textClass: "text-red-300/80",
    dot: "bg-red-400",
  },
  warning: {
    icon: AlertTriangle,
    containerClass: "bg-amber-500/10 border-amber-500/25 shadow-amber-500/10",
    iconClass: "text-amber-400",
    titleClass: "text-amber-400",
    textClass: "text-amber-300/80",
    dot: "bg-amber-400",
  },
  reminder: {
    icon: Bell,
    containerClass: "bg-blue-500/10 border-blue-500/25 shadow-blue-500/10",
    iconClass: "text-blue-400",
    titleClass: "text-blue-400",
    textClass: "text-blue-300/80",
    dot: "bg-blue-400",
  },
};

const PRIORITY_ORDER: Record<Alert["type"], number> = {
  critical: 0,
  warning: 1,
  reminder: 2,
};

export const AlertBanners = ({ alerts }: { alerts: Alert[] }) => {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  if (!alerts || alerts.length === 0) return null;

  const sorted = [...alerts].sort(
    (a, b) => PRIORITY_ORDER[a.type] - PRIORITY_ORDER[b.type]
  );

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {sorted.map((alert, i) => {
          if (dismissed.has(i)) return null;
          const config = ALERT_CONFIG[alert.type] ?? ALERT_CONFIG.reminder;
          const Icon = config.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 10, height: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={cn(
                "flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-sm",
                config.containerClass
              )}
            >
              {/* Pulsing dot */}
              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                <span className={cn("w-2 h-2 rounded-full animate-pulse", config.dot)} />
                <Icon className={cn("w-4 h-4", config.iconClass)} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn("text-xs font-bold uppercase tracking-widest mb-0.5", config.titleClass)}>
                  {alert.type}
                </p>
                <p className={cn("text-sm font-medium leading-snug", config.textClass)}>
                  {alert.message}
                </p>
              </div>

              <button
                onClick={() => setDismissed((prev) => new Set([...prev, i]))}
                className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors text-foreground/30 hover:text-foreground/60"
                aria-label="Dismiss alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

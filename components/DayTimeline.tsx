"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Clock, Stethoscope, ChevronLeft, ChevronRight } from "lucide-react";
import type { TimelineDay, EventType } from "@/lib/types";
import { cn } from "@/lib/utils";

const EVENT_CONFIG: Record<EventType, { icon: any; colorClass: string; bgClass: string; dotClass: string }> = {
  medicine: {
    icon: Pill,
    colorClass: "text-primary",
    bgClass: "bg-primary/15 border-primary/25",
    dotClass: "bg-primary",
  },
  precaution: {
    icon: Clock,
    colorClass: "text-amber-400",
    bgClass: "bg-amber-400/10 border-amber-400/20",
    dotClass: "bg-amber-400",
  },
  test: {
    icon: Stethoscope,
    colorClass: "text-accent",
    bgClass: "bg-accent/10 border-accent/20",
    dotClass: "bg-accent",
  },
};

export const DayTimeline = ({ days }: { days: TimelineDay[] }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!days || days.length === 0) {
    return (
      <div className="py-12 text-center text-foreground/40 text-sm">
        Record a consultation to see your schedule here.
      </div>
    );
  }

  const currentDay = days[selectedDay];
  const canGoPrev = selectedDay > 0;
  const canGoNext = selectedDay < days.length - 1;

  return (
    <div className="space-y-4">
      {/* Day selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedDay((d) => Math.max(0, d - 1))}
          disabled={!canGoPrev}
          className={cn(
            "p-2 rounded-xl transition-all",
            canGoPrev
              ? "glass-dark text-foreground/60 hover:text-foreground"
              : "opacity-20 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 flex gap-1.5 overflow-x-auto no-scrollbar">
          {days.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200",
                i === selectedDay
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "glass-dark text-foreground/50 hover:text-foreground/80"
              )}
            >
              {d.day}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSelectedDay((d) => Math.min(days.length - 1, d + 1))}
          disabled={!canGoNext}
          className={cn(
            "p-2 rounded-xl transition-all",
            canGoNext
              ? "glass-dark text-foreground/60 hover:text-foreground"
              : "opacity-20 cursor-not-allowed"
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Events for selected day */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="space-y-2"
        >
          {currentDay.events.length === 0 ? (
            <p className="text-center text-sm text-foreground/30 py-8">No events this day.</p>
          ) : (
            currentDay.events.map((event, i) => {
              const config = EVENT_CONFIG[event.type] ?? EVENT_CONFIG.medicine;
              const Icon = config.icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-2xl border",
                    config.bgClass
                  )}
                >
                  {/* Icon */}
                  <div className={cn("p-1.5 rounded-xl glass-dark shrink-0")}>
                    <Icon className={cn("w-3.5 h-3.5", config.colorClass)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight text-foreground/90">
                      {event.title}
                    </p>
                    {event.details && (
                      <p className="text-xs text-foreground/50 mt-0.5 leading-snug">
                        {event.details}
                      </p>
                    )}
                  </div>

                  {/* Time badge */}
                  <span className={cn(
                    "shrink-0 text-[10px] font-bold uppercase tracking-wider",
                    config.colorClass
                  )}>
                    {event.time}
                  </span>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>

      {/* Day count */}
      <p className="text-center text-[10px] text-foreground/25 font-medium uppercase tracking-widest">
        {selectedDay + 1} of {days.length} days
      </p>
    </div>
  );
};

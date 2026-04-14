"use client";

import { Calendar } from "lucide-react";
import { DayTimeline } from "../DayTimeline";
import type { TimelineDay } from "@/lib/types";

export const ScheduleView = ({ days }: { days: TimelineDay[] }) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="px-1 space-y-2">
        <h2 className="text-3xl font-black tracking-tight">
          Daily<br /><span className="text-accent">Schedule</span>
        </h2>
        <div className="flex items-center gap-2 text-foreground/40 text-sm font-semibold">
          <Calendar className="w-4 h-4" />
          {today}
        </div>
      </div>

      {/* Day Timeline */}
      <div className="px-4 py-6 glass rounded-[40px] border-white/5 bg-white/5 relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <DayTimeline days={days} />
      </div>

      <p className="text-center text-xs text-foreground/25 font-medium">
        Times are extracted automatically from your consultation audio.
      </p>
    </div>
  );
};

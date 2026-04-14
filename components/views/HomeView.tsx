"use client";

import { motion } from "framer-motion";
import { GlassCard } from "../GlassCard";
import { Calendar, ChevronRight, Play } from "lucide-react";
import { FloatingRecordButton } from "../FloatingRecordButton";
import type { RecordingState } from "@/hooks/useAudioRecorder";

interface HomeViewProps {
  onRecord: () => void;
  recordingState: RecordingState;
  elapsedSeconds: number;
  permissionError: string | null;
}

export const HomeView = ({
  onRecord,
  recordingState,
  elapsedSeconds,
  permissionError,
}: HomeViewProps) => {
  return (
    <div className="space-y-8 flex-1 flex flex-col pt-4">
      <div className="space-y-2">
        <h2 className="text-4xl font-black tracking-tight leading-tight">
          Good evening,<br />
          <span className="text-primary">Medical Assistant</span> is ready.
        </h2>
        <p className="text-foreground/40 font-medium">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-8">
        <FloatingRecordButton
          onClick={onRecord}
          recordingState={recordingState}
          elapsedSeconds={elapsedSeconds}
          permissionError={permissionError}
        />
      </div>

      <GlassCard className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Next Scheduled Dose</p>
            <h4 className="text-lg font-bold">Amoxicillin</h4>
            <p className="text-sm text-foreground/50 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> 12:00 PM (In 2 hours)
            </p>
          </div>
          <button className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </GlassCard>

      <GlassCard className="p-4 flex items-center gap-4 bg-white/5 border-white/10 group cursor-pointer hover:bg-white/10 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          <Play className="w-4 h-4 fill-current" />
        </div>
        <div className="flex-1">
          <h5 className="text-sm font-bold tracking-tight">Listen to last consultation</h5>
          <p className="text-[10px] text-foreground/40 font-medium">Recorded 3 hours ago</p>
        </div>
      </GlassCard>
    </div>
  );
};

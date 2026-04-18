"use client";

import { motion } from "framer-motion";
import { GlassCard } from "../GlassCard";
import { 
  Calendar, 
  ChevronRight, 
  Play, 
  Activity, 
  Thermometer, 
  Heart, 
  Search,
  Settings,
  Bell
} from "lucide-react";
import { FloatingRecordButton } from "../FloatingRecordButton";
import type { RecordingState } from "@/hooks/useAudioRecorder";
import { cn } from "@/lib/utils";

import type { UIData } from "@/lib/types";

interface HomeViewProps {
  onRecord: () => void;
  recordingState: RecordingState;
  elapsedSeconds: number;
  permissionError: string | null;
  uiData: UIData | null;
  transcript?: string;
  userName: string;
}

const StatCard = ({ icon: Icon, label, value, unit, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <GlassCard className="!p-4 bg-white/5 border-white/5 hover:bg-white/8 transition-colors">
      <div className="flex flex-col gap-3">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-foreground">{value}</span>
            <span className="text-[10px] font-bold text-foreground/20">{unit}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

export const HomeView = ({
  onRecord,
  recordingState,
  elapsedSeconds,
  permissionError,
  uiData,
  transcript,
  userName,
}: HomeViewProps) => {
  const nextMed = uiData?.medicineCards?.[0];
  const nextTime = uiData?.timeline?.[0]?.events?.[0]?.time || "Scheduled";

  return (
    <div className="space-y-8 flex-1 flex flex-col pt-4 pb-24">
      {/* Premium Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] shadow-lg shadow-primary/20">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <span className="text-xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent uppercase">
                {userName.charAt(0)}
              </span>
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
            <h2 className="text-2xl font-black tracking-tight">
              Hello, <span className="text-primary">{userName.split(' ')[0]}</span>
            </h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-2xl glass-dark flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-white/10 transition-all active:scale-95">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Recording Section */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full scale-[1.3] blur-3xl" />
          <FloatingRecordButton
            onClick={onRecord}
            recordingState={recordingState}
            elapsedSeconds={elapsedSeconds}
            permissionError={permissionError}
          />
        </div>
      </div>

      {/* Diagnosis & Treatment Section */}
      <div className="space-y-6">
        {uiData?.summaryCard && (
          <div className="space-y-3 px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-primary" />
              Current Status
            </h3>
            <GlassCard className="!p-5 bg-gradient-to-b from-white/10 to-white/5 border-white/10 hover:border-primary/30 transition-colors shadow-2xl shadow-black/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Heart className="w-24 h-24 text-primary" />
              </div>
              <div className="flex items-start gap-4 relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                  uiData.summaryCard.severity === "high" ? "bg-red-500/20 text-red-500 border border-red-500/20" :
                  uiData.summaryCard.severity === "medium" ? "bg-amber-500/20 text-amber-500 border border-amber-500/20" : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/20"
                )}>
                  <Activity className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold tracking-tight text-white">{uiData.summaryCard.title}</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed font-medium">{uiData.summaryCard.description}</p>
                </div>
              </div>
              {uiData.summaryCard.action && (
                <div className="mt-5 pt-4 border-t border-white/10 flex items-start gap-2 relative z-10">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <p className="text-xs text-foreground/80 font-medium"><span className="text-primary font-bold">Action:</span> {uiData.summaryCard.action}</p>
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* Next Dose Card */}
        <div className="space-y-3 px-1">
          {nextMed && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  Next Scheduled
                </h3>
              </div>
              
              <GlassCard className="!p-5 bg-gradient-to-br from-accent/10 to-transparent border-accent/20 relative overflow-hidden group shadow-lg">
                <div className="absolute -right-4 -bottom-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Thermometer className="w-24 h-24" />
                </div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-accent/10 w-fit px-2 py-1 rounded-full border border-accent/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <p className="text-[9px] font-black text-accent uppercase tracking-widest">{nextTime}</p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold tracking-tight">{nextMed.name}</h4>
                      <p className="text-sm text-foreground/50 font-medium mt-0.5">{nextMed.dosage}</p>
                    </div>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </GlassCard>
            </>
          )}

          {transcript && (
            <GlassCard className="!p-4 flex items-center gap-4 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-[0.98]">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold tracking-tight">Review Last Recording</h5>
                <p className="text-[10px] text-foreground/40 font-medium">Auto-summarized transcript</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

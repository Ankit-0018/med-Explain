"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, AlertCircle } from "lucide-react";
import type { RecordingState } from "@/hooks/useAudioRecorder";

interface FloatingRecordButtonProps {
  onClick: () => void;
  recordingState: RecordingState;
  elapsedSeconds?: number;
  permissionError?: string | null;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export const FloatingRecordButton = ({
  onClick,
  recordingState,
  elapsedSeconds = 0,
  permissionError,
}: FloatingRecordButtonProps) => {
  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";
  const isError = recordingState === "error";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Outer glow */}
        <div
          className={`absolute inset-0 rounded-full blur-3xl animate-pulse transition-colors duration-500 ${
            isRecording ? "bg-red-500/40" : "bg-primary/40"
          }`}
        />

        <motion.button
          whileHover={!isProcessing ? { scale: 1.05 } : {}}
          whileTap={!isProcessing ? { scale: 0.95 } : {}}
          onClick={!isProcessing ? onClick : undefined}
          aria-label={isRecording ? "Stop Recording" : "Start Recording"}
          className={`relative w-32 h-32 rounded-full p-[2px] shadow-2xl group transition-all duration-300 ${
            isRecording
              ? "bg-gradient-to-tr from-red-500 to-orange-400 pulse-glow"
              : "bg-gradient-to-tr from-primary to-accent pulse-glow"
          } ${isProcessing ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center relative overflow-hidden">
            {/* Inner gradient */}
            <div
              className={`absolute inset-0 transition-all duration-500 ${
                isRecording
                  ? "bg-gradient-to-tr from-red-500/20 to-orange-400/20"
                  : "bg-gradient-to-tr from-primary/20 to-accent/20 group-hover:scale-150"
              }`}
            />

            {/* Pulse rings when recording */}
            {isRecording && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-red-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  className="absolute inset-0 bg-red-500 rounded-full"
                />
              </>
            )}

            {/* Icon */}
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div
                  key="stop"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Square className="w-10 h-10 text-red-400 fill-current" />
                </motion.div>
              ) : (
                <motion.div
                  key="mic"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Mic className="w-12 h-12 text-foreground group-hover:scale-110 transition-transform duration-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      </div>

      {/* Label / timer */}
      <div className="text-center space-y-1">
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="recording-label"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-1"
            >
              <p className="text-lg font-bold text-red-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                Recording…
              </p>
              <span className="text-2xl font-mono font-black text-foreground/80 tabular-nums">
                {formatTime(elapsedSeconds)}
              </span>
              <span className="text-xs text-foreground/40">Tap to stop</span>
            </motion.div>
          ) : isProcessing ? (
            <motion.div
              key="processing-label"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-1"
            >
              <p className="text-lg font-medium text-accent">
                Transcribing…
              </p>
              <span className="text-xs text-foreground/40">Powered by Gemini AI</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle-label"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={onClick}
            >
              <p className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors">
                👉 Tap to Record Consultation
              </p>
              <span className="text-sm text-foreground/40">Powered by MedExplain AI</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Permission error */}
        {isError && permissionError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-start gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 max-w-xs text-left"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <p className="text-xs text-red-400 leading-snug">{permissionError}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

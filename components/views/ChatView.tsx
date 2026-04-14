"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Timer, ArrowUpRight } from "lucide-react";

export const ChatView = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      {/* Icon Circle */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-24 h-24 rounded-[32px] bg-gradient-to-tr from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center text-primary shadow-2xl">
          <MessageSquare className="w-10 h-10" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-4 right-4"
          >
            <Sparkles className="w-5 h-5 text-accent" />
          </motion.div>
        </div>
      </motion.div>

      {/* Text Content */}
      <div className="space-y-4 max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Future Update
          </span>
          <h2 className="text-3xl font-black tracking-tight mt-4">
            AI Health <br />
            <span className="text-primary">Assistant</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-foreground/50 leading-relaxed font-medium"
        >
          Your personal medical expert is currently in training. Soon, you'll be able to ask deep questions about your consultations and get instant, accurate answers.
        </motion.p>
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 w-full max-w-xs glass-dark rounded-[32px] p-5 border border-white/5 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-foreground/40">
          <Timer className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Development Status</p>
          <p className="text-xs font-bold text-foreground/80">Beta Testing Starting Soon</p>
        </div>
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
      </motion.div>

      {/* CTA Placeholder */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors cursor-default"
      >
        Notify me when ready <ArrowUpRight className="w-3 h-3" />
      </motion.button>
    </div>
  );
};

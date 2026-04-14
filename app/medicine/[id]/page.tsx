"use client";

import { motion } from "framer-motion";
import { Sparkles, Pill, Timer, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface MedicineDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MedicineDetailPage({ params }: MedicineDetailPageProps) {
  // We use `use` to unwrap the params promise even if we don't use the id yet
  const resolvedParams = use(params);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative background */}
      <div className="absolute inset-0 animate-gradient opacity-10" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />

      <main className="relative z-10 w-full max-w-2xl px-6 py-12 flex flex-col items-center text-center">
        {/* Back Button */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="absolute top-4 left-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground/60 transition hover:bg-white/10 hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Icon Circle */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="relative mb-10"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-32 h-32 rounded-[40px] bg-gradient-to-tr from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center text-primary shadow-2xl">
            <Pill className="w-14 h-14" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-6 right-6"
            >
              <Sparkles className="w-6 h-6 text-accent" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="space-y-6 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <Timer className="w-3 h-3" /> Standalone View Coming Soon
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-6 leading-tight">
              Detailed Medicine <br />
              <span className="text-primary text-3xl md:text-4xl">Insights Dashboard</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base text-foreground/50 leading-relaxed font-medium"
          >
            We are building a dedicated, deep-dive view for medicine <strong>{resolvedParams.id}</strong>. For now, you can view all instructions and safety details by tapping the <strong>Info</strong> button on any medicine card in your main list.
          </motion.p>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 w-full max-w-sm glass-dark rounded-[32px] p-6 border border-white/5 flex items-center gap-5 shadow-2xl mx-auto"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-foreground/40 shrink-0">
            <Timer className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Feature Progress</p>
            <p className="text-sm font-bold text-foreground/80">Refining standalone analytics</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-ping shrink-0" />
        </motion.div>

        {/* Action Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Home className="w-4 h-4" />
            Go to Main Dashboard
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Stethoscope, Dot } from "lucide-react";
import type { DoctorNotes as DoctorNotesType } from "@/lib/types";

export const DoctorNotesCard = ({ data }: { data: DoctorNotesType }) => {
  if (!data?.keyPoints?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-3xl border border-secondary/20 bg-secondary/5 p-5 relative overflow-hidden"
    >
      {/* Decorative */}
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-secondary/10 rounded-full blur-2xl -mr-6 -mb-6" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">Doctor&apos;s Notes</h3>
            <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-widest">Key consultation points</p>
          </div>
        </div>

        {/* Key points */}
        <ul className="space-y-2">
          {data.keyPoints.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className="flex items-start gap-2"
            >
              <Dot className="w-5 h-5 text-secondary/60 shrink-0 -mt-0.5" />
              <span className="text-sm text-foreground/70 leading-snug">{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

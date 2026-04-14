"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";
import type { PrecautionsCard as PrecautionsCardType } from "@/lib/types";

export const PrecautionsCard = ({ data }: { data: PrecautionsCardType }) => {
  if (!data?.items?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-3xl p-5 border border-white/10 relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-bold tracking-tight">{data.title}</h3>
        </div>

        {/* Items */}
        <ul className="space-y-2.5">
          {data.items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className="flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
              <span className="text-sm text-foreground/70 leading-snug">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

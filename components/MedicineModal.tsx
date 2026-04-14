"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Zap, ShieldAlert, Utensils } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface MedicineDetail {
  name: string;
  why: string;
  how: string;
  sideEffects: string[];
  food: string;
}

interface MedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: MedicineDetail | null;
}

export const MedicineModal = ({ isOpen, onClose, medicine }: MedicineModalProps) => {
  if (!medicine) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl z-10"
          >
            <GlassCard className="p-8 max-h-[90vh] overflow-y-auto relative no-scrollbar">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">{medicine.name}</h2>
                  <p className="text-foreground/40 font-medium">Detailed Prescription Info</p>
                </div>
              </div>

              <div className="grid gap-6">
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                    <Zap className="w-4 h-4" />
                    Why this medicine
                  </div>
                  <p className="text-foreground/70 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                    {medicine.why}
                  </p>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-accent font-bold uppercase tracking-wider text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    How it works
                  </div>
                  <p className="text-foreground/70 leading-relaxed">
                    {medicine.how}
                  </p>
                </section>

                <div className="grid sm:grid-cols-2 gap-6">
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-danger font-bold uppercase tracking-wider text-xs">
                      <ShieldAlert className="w-4 h-4" />
                      Side Effects
                    </div>
                    <ul className="space-y-2">
                      {medicine.sideEffects.map((effect, i) => (
                        <li key={i} className="flex items-center gap-2 text-foreground/60 text-sm">
                          <div className="w-1 h-1 rounded-full bg-danger" />
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-success font-bold uppercase tracking-wider text-xs">
                      <Utensils className="w-4 h-4" />
                      Food Instructions
                    </div>
                    <div className="bg-success/10 border border-success/20 p-4 rounded-2xl text-success font-medium text-sm">
                      {medicine.food}
                    </div>
                  </section>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5">
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all"
                >
                  Got it, thanks
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

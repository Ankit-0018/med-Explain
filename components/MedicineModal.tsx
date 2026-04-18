"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Zap, ShieldAlert, Utensils, Info, AlertTriangle, Loader2, Star } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface MedicineDetail {
  name: string;
  why: string;
  how: string;
  precautions?: string;
  sideEffects: string[];
  food?: string;
  warning?: string;
  effectiveness?: string;
  dosageGuidance?: string;
}

interface MedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: MedicineDetail | null;
  condition?: string;
}

export const MedicineModal = ({ isOpen, onClose, medicine: initialMedicine, condition }: MedicineModalProps) => {
  const [medicine, setMedicine] = useState<MedicineDetail | null>(initialMedicine);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialMedicine) {
      // If we only have basic info, fetch enriched details
      if (!initialMedicine.precautions || !initialMedicine.warning) {
        fetchDetails(initialMedicine.name);
      } else {
        setMedicine(initialMedicine);
      }
    }
  }, [isOpen, initialMedicine]);

  const fetchDetails = async (name: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/medicine/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, condition })
      });
      const data = await response.json();
      setMedicine(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Failed to fetch medicine details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!medicine && !isLoading) return null;

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

              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Generating expert insights...</p>
                </div>
              ) : medicine && (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">{medicine.name}</h2>
                      <p className="text-foreground/40 font-medium">Expert Prescription Guide</p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {/* Why & How */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[10px]">
                          <Zap className="w-3.5 h-3.5" />
                          The Purpose
                        </div>
                        <p className="text-sm text-foreground/70 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                          {medicine.why}
                        </p>
                      </section>

                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-accent font-bold uppercase tracking-wider text-[10px]">
                          <Info className="w-3.5 h-3.5" />
                          Usage Guide
                        </div>
                        <p className="text-sm text-foreground/70 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                          {medicine.how}
                        </p>
                      </section>
                    </div>

                    {/* Precautions & Warnings */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-warning font-bold uppercase tracking-wider text-[10px]">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Precautions
                        </div>
                        <div className="bg-warning/5 border border-warning/10 p-5 rounded-3xl text-sm text-foreground/70 leading-relaxed">
                          {medicine.precautions || "Follow standard medical precautions."}
                        </div>
                      </section>

                      {medicine.effectiveness && (
                        <section className="space-y-3">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                            <Star className="w-3.5 h-3.5" />
                            Effectiveness Tips
                          </div>
                          <div className="bg-emerald-400/5 border border-emerald-400/10 p-5 rounded-3xl text-sm text-foreground/70 leading-relaxed">
                            {medicine.effectiveness}
                          </div>
                        </section>
                      )}
                    </div>

                    {/* Dosage Guidance */}
                    {medicine.dosageGuidance && (
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-[10px]">
                          <Info className="w-3.5 h-3.5" />
                          Dosage & Guidance
                        </div>
                        <div className="bg-blue-400/5 border border-blue-400/10 p-5 rounded-3xl text-sm text-foreground/70 leading-relaxed italic">
                          {medicine.dosageGuidance}
                        </div>
                      </section>
                    )}

                    {/* Side Effects & Food */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-[10px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Side Effects
                        </div>
                        <ul className="grid grid-cols-1 gap-2">
                          {medicine.sideEffects.map((effect, i) => (
                            <li key={i} className="flex items-center gap-2 text-foreground/60 text-xs bg-white/5 px-3 py-2 rounded-xl">
                              <div className="w-1 h-1 rounded-full bg-red-400/50" />
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </section>

                      {medicine.warning && (
                        <section className="space-y-3">
                          <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-wider text-[10px]">
                            <AlertCircle className="w-3.5 h-3.5" />
                            CRITICAL WARNING
                          </div>
                          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 font-bold text-xs leading-relaxed">
                            {medicine.warning}
                          </div>
                        </section>
                      )}
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-white/5">
                    <button
                      onClick={onClose}
                      className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all active:scale-[0.98]"
                    >
                      Understood
                    </button>
                    <p className="text-[10px] text-center text-foreground/20 mt-4 uppercase tracking-[0.2em]">
                      AI-generated info • Consult your doctor
                    </p>
                  </div>
                </>
              )}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

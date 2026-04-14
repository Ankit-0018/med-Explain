"use client";

import { motion } from "framer-motion";
import { Pill, Search, FileText, Volume2 } from "lucide-react";
import { MedicineCard } from "../MedicineCard";
import { SummaryCard } from "../SummaryCard";
import { AlertBanners } from "../AlertBanners";
import { PrecautionsCard } from "../PrecautionsCard";
import { DoctorNotesCard } from "../DoctorNotesCard";
import type { UIData, MedicineCard as MedicineCardType } from "@/lib/types";

interface MedsViewProps {
  uiData: UIData | null;
  transcript?: string;
  onMedicineClick: (med: MedicineCardType) => void;
}

export const MedsView = ({ uiData, transcript = "", onMedicineClick }: MedsViewProps) => {
  const hasData = uiData && uiData.medicineCards?.length > 0;

  return (
    <div className="space-y-6 pb-12">

      {/* ─── Summary Card ─────────────────────────────────────────────────── */}
      {uiData?.summaryCard && (
        <SummaryCard data={uiData.summaryCard} />
      )}

      {/* ─── Alert Banners ────────────────────────────────────────────────── */}
      {uiData?.alerts && uiData.alerts.length > 0 && (
        <AlertBanners alerts={uiData.alerts} />
      )}

      {/* ─── Transcript Section ───────────────────────────────────────────── */}
      {transcript && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold tracking-tight flex items-center gap-2 text-foreground/50 uppercase tracking-widest">
              <FileText className="w-4 h-4" />
              Consultation Transcript
            </h2>
            <button className="p-2 rounded-xl glass-dark hover:scale-105 transition">
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl glass border border-white/10 text-sm leading-relaxed text-foreground/70 max-h-[150px] overflow-y-auto no-scrollbar"
          >
            {transcript}
          </motion.div>
        </div>
      )}

      {/* ─── Medicines Header + List ──────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-2xl font-black tracking-tight">
            Your <span className="text-primary">Medicines</span>
          </h2>
          <button className="p-2.5 rounded-2xl glass-dark text-foreground/40">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {hasData ? (
          <div className="space-y-3">
            {uiData!.medicineCards.map((med, i) => (
              <MedicineCard
                key={med.id}
                medicine={med}
                index={i}
                onClick={onMedicineClick}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Pill className="w-7 h-7 text-primary/40" />
            </div>
            <p className="text-foreground/40 text-sm font-medium">
              No medicines extracted yet.
            </p>
            <p className="text-foreground/25 text-xs">
              Record a consultation from the Home tab to get started.
            </p>
          </motion.div>
        )}
      </div>

      {/* ─── Precautions Card ─────────────────────────────────────────────── */}
      {uiData?.precautionsCard && uiData.precautionsCard.items.length > 0 && (
        <PrecautionsCard data={uiData.precautionsCard} />
      )}

      {/* ─── Doctor Notes ─────────────────────────────────────────────────── */}
      {uiData?.doctorNotes && uiData.doctorNotes.keyPoints.length > 0 && (
        <DoctorNotesCard data={uiData.doctorNotes} />
      )}

      {/* ─── Refill Status Footer ─────────────────────────────────────────── */}
      {hasData && (
        <div className="px-2">
          <div className="p-4 rounded-3xl bg-secondary/5 border border-secondary/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-sm font-bold">Auto-Refill Status</h5>
              <p className="text-[10px] text-foreground/40 font-medium">
                All medicines have refills available
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

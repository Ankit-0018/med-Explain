"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { BottomNav, TabType } from "@/components/BottomNav";
import { AnimatedLoader } from "@/components/AnimatedLoader";
import { HomeView } from "@/components/views/HomeView";
import { MedsView } from "@/components/views/MedsView";
import { ScheduleView } from "@/components/views/ScheduleView";
import { ChatView } from "@/components/views/ChatView";
import { BottomSheet } from "@/components/BottomSheet";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { createClient } from "@/lib/supabase/client";
import type { UIData, MedicineCard } from "@/lib/types";
import { MOCK_UI_DATA } from "@/lib/mockData";
import { Zap, ShieldAlert, Utensils, AlertCircle } from "lucide-react";

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MedExplainApp() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // New unified UI data state - Seeded with mock data for visibility
  const [uiData, setUiData] = useState<UIData | null>(MOCK_UI_DATA);
  const [transcript, setTranscript] = useState<string>("Hello, I'm Dr. Smith. Based on your symptoms of a sore throat and mild fever, I'm diagnosing you with an upper respiratory infection. I'm prescribing Amoxicillin for the infection, Paracetamol for the fever and pain, and Cetirizine for your congestion. Please take the full course of antibiotics.");

  const [selectedMed, setSelectedMed] = useState<MedicineCard | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        router.replace("/auth");
        return;
      }
      setAuthChecked(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          router.replace("/auth");
          return;
        }
        if (event === "SIGNED_IN") {
          setAuthChecked(true);
        }
      },
    );

    return () => { authListener?.subscription.unsubscribe(); };
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) { setProcessingError(error.message); return; }
    router.replace("/auth");
  };

  // ── Audio pipeline → API ───────────────────────────────────────────────────
  const handleAudioReady = useCallback(async (blob: Blob) => {
    setIsProcessing(true);
    setProcessingError(null);

    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const res = await fetch("/api/transcript", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Transcription failed");

      setTranscript(data.transcript ?? "");
      setUiData(data.ui ?? null);
      setRecordingState("idle");
      setActiveTab("meds");
    } catch (err: any) {
      setProcessingError(err?.message ?? "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // ── Audio recorder hook ────────────────────────────────────────────────────
  const {
    recordingState,
    setRecordingState,
    elapsedSeconds,
    startRecording,
    stopRecording,
    permissionError,
  } = useAudioRecorder(handleAudioReady);

  const handleRecordToggle = async () => {
    if (recordingState === "idle" || recordingState === "error") {
      await startRecording();
    } else if (recordingState === "recording") {
      stopRecording();
    }
  };

  const openMedicineDetails = (med: MedicineCard) => {
    setSelectedMed(med);
    setIsSheetOpen(true);
  };

  // ── Timeline days (from uiData) ────────────────────────────────────────────
  const timelineDays = useMemo(() => uiData?.timeline ?? [], [uiData]);

  // ── Auth loading state ─────────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-8 py-10 text-center shadow-2xl shadow-black/20">
          <p className="text-lg font-semibold">Checking authentication…</p>
          <p className="mt-2 text-sm text-foreground/70">Redirecting to login if needed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-background overflow-hidden">
      {/* Sign-out */}
      <button
        type="button"
        onClick={handleSignOut}
        className="absolute right-4 top-4 z-50 rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-slate-900"
      >
        Log out
      </button>

      {/* ── Views ── */}
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8 gap-6"
          >
            <AnimatedLoader />
            <p className="text-foreground/40 text-sm animate-pulse">
              Transcribing &amp; structuring with AI…
            </p>
          </motion.div>
        ) : (
          <AppShell activeTab={activeTab}>
            {activeTab === "home" && (
              <HomeView
                onRecord={handleRecordToggle}
                recordingState={recordingState}
                elapsedSeconds={elapsedSeconds}
                permissionError={permissionError}
              />
            )}
            {activeTab === "meds" && (
              <MedsView
                uiData={uiData}
                transcript={transcript}
                onMedicineClick={openMedicineDetails}
              />
            )}
            {activeTab === "schedule" && (
              <ScheduleView days={timelineDays} />
            )}
            {activeTab === "chat" && <ChatView />}
          </AppShell>
        )}
      </AnimatePresence>

      {/* ── Processing error toast ── */}
      <AnimatePresence>
        {processingError && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-28 left-4 right-4 z-[200] flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-400">Transcription Failed</p>
              <p className="text-xs text-red-400/70 mt-0.5">{processingError}</p>
            </div>
            <button
              onClick={() => setProcessingError(null)}
              className="text-red-400/60 hover:text-red-400 text-xs font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Nav ── */}
      {!isProcessing && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRecordClick={activeTab !== "home" ? handleRecordToggle : undefined}
        />
      )}

      {/* ── Medicine Details Bottom Sheet ── */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={selectedMed?.name}
      >
        {selectedMed && (
          <div className="space-y-7 pb-8 pt-2">
            {/* Header banner */}
            <div
              className="flex items-center gap-3 p-4 rounded-3xl border"
              style={{
                backgroundColor: `${selectedMed.color}18`,
                borderColor: `${selectedMed.color}35`,
              }}
            >
              <AlertCircle className="w-7 h-7" style={{ color: selectedMed.color }} />
              <div>
                <p className="text-sm font-bold leading-tight">Prescription Information</p>
                <p className="text-[10px] text-foreground/40 font-medium">
                  {selectedMed.dosage} · {selectedMed.frequency}
                </p>
              </div>
            </div>

            {/* Why */}
            <section className="space-y-2 px-1">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                <Zap className="w-3.5 h-3.5" />
                Why this medicine
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed">{selectedMed.details.why}</p>
            </section>

            {/* How */}
            <section className="space-y-2 px-1">
              <div className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-[10px]">
                <ShieldAlert className="w-3.5 h-3.5" />
                How it works
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed">{selectedMed.details.how}</p>
            </section>

            {/* Side effects + Food grid */}
            <div className="grid grid-cols-2 gap-3">
              <section className="space-y-2.5 glass-dark p-4 rounded-[28px] border border-white/5">
                <div className="flex items-center gap-1.5 text-danger font-bold uppercase tracking-widest text-[9px]">
                  <ShieldAlert className="w-3 h-3" />
                  Side Effects
                </div>
                <ul className="space-y-1.5">
                  {selectedMed.details.sideEffects.slice(0, 4).map((effect, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-foreground/50 text-[11px] font-medium">
                      <div className="w-1 h-1 rounded-full bg-danger" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-2.5 bg-success/5 p-4 rounded-[28px] border border-success/10">
                <div className="flex items-center gap-1.5 text-success font-bold uppercase tracking-widest text-[9px]">
                  <Utensils className="w-3 h-3" />
                  Food Info
                </div>
                <p className="text-success/80 text-[11px] font-medium leading-relaxed">
                  {selectedMed.details.food}
                </p>
              </section>
            </div>

            {/* Instructions */}
            {selectedMed.instructions && (
              <div className="px-1 py-3 rounded-2xl bg-white/5 border border-white/8 text-xs text-foreground/60 font-medium italic text-center">
                💡 {selectedMed.instructions}
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSheetOpen(false)}
              className="w-full py-4 rounded-[26px] bg-primary text-white font-black text-base shadow-xl shadow-primary/20"
            >
              GOT IT
            </motion.button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

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
import { Zap, ShieldAlert, Utensils, AlertCircle, Star, Info } from "lucide-react";

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MedExplainApp() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [uiData, setUiData] = useState<UIData | null>(null);
  const [transcript, setTranscript] = useState<string>("");

  const [selectedMed, setSelectedMed] = useState<MedicineCard | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const router = useRouter();

  const [userName, setUserName] = useState<string>("User");

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        router.replace("/auth");
        return;
      }
      setAuthChecked(true);
      const name = data.session.user.user_metadata?.full_name || data.session.user.email?.split("@")[0] || "User";
      setUserName(name);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.replace("/auth");
        return;
      }
      if (event === "SIGNED_IN") {
        setAuthChecked(true);
        const name = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User";
        setUserName(name);
      }
    });

    return () => { authListener?.subscription.unsubscribe(); };
  }, [router]);

  const fetchLatestResult = useCallback(async () => {
    try {
      const res = await fetch("/api/results/latest");
      const data = await res.json();
      if (data && data.corrected_results) {
        setUiData(data.corrected_results);
        setTranscript(data.transcription || "");
      } else {
        // Fallback to mock data if no previous results
        setUiData(MOCK_UI_DATA);
        setTranscript("Hello, I'm Dr. Smith. Based on your symptoms of a sore throat and mild fever, I'm diagnosing you with an upper respiratory infection. I'm prescribing Amoxicillin for the infection, Paracetamol for the fever and pain, and Cetirizine for your congestion. Please take the full course of antibiotics.");
      }
    } catch (err) {
      console.error("Error fetching latest result:", err);
    }
  }, []);

  useEffect(() => {
    if (authChecked) {
      fetchLatestResult();
    }
  }, [authChecked, fetchLatestResult]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
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

  const openMedicineDetails = async (med: MedicineCard) => {
    setSelectedMed(med);
    setIsSheetOpen(true);
    
    // Fetch enriched details if they look like placeholder/basic
    if (!med.details.sideEffects?.length || !med.details.how || !(med.details as any).effectiveness) {
      setIsDetailLoading(true);
      try {
        const res = await fetch("/api/medicine/details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: med.name, 
            condition: uiData?.summaryCard?.title || "General" 
          })
        });
        const data = await res.json();
        if (data.name) {
          const updatedMed = { 
            ...med, 
            details: { ...med.details, ...data } 
          };
          setSelectedMed(updatedMed);
          setUiData(prev => {
            if (!prev) return null;
            return {
              ...prev,
              medicineCards: prev.medicineCards.map(m => m.id === med.id ? updatedMed : m)
            };
          });
        }
      } catch (err) {
        console.error("Detail fetch error:", err);
      } finally {
        setIsDetailLoading(false);
      }
    }
  };

  const timelineDays = useMemo(() => uiData?.timeline ?? [], [uiData]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-8 py-10 text-center shadow-2xl shadow-black/20">
          <p className="text-lg font-semibold">Checking authentication…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-background overflow-hidden">
      <button
        type="button"
        onClick={handleSignOut}
        className="absolute right-4 top-4 z-50 rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-slate-900"
      >
        Log out
      </button>

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
                uiData={uiData}
                transcript={transcript}
                userName={userName}
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

      {!isProcessing && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRecordClick={activeTab !== "home" ? handleRecordToggle : undefined}
        />
      )}

      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={selectedMed?.name}
      >
        {selectedMed && (
          <div className="space-y-7 pb-8 pt-2 no-scrollbar overflow-y-auto max-h-[70vh]">
            {isDetailLoading ? (
               <div className="py-12 flex flex-col items-center justify-center gap-4">
                 <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                 <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Pharmacist AI is checking...</p>
               </div>
            ) : (
              <>
                <div
                  className="flex items-center gap-3 p-4 rounded-[28px] border"
                  style={{ backgroundColor: `${selectedMed.color}15`, borderColor: `${selectedMed.color}30` }}
                >
                  <AlertCircle className="w-6 h-6" style={{ color: selectedMed.color }} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest leading-tight">Prescription Info</p>
                    <p className="text-[11px] text-foreground/50 font-medium">
                      {selectedMed.dosage} · {selectedMed.frequency}
                    </p>
                  </div>
                </div>

                {selectedMed.validation && (selectedMed.validation.confidence < 0.7 || selectedMed.validation.flags.length > 0) && (
                  <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-[32px] space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-black uppercase tracking-widest text-[10px]">
                      <ShieldAlert className="w-4 h-4" />
                      Attention Required
                    </div>
                    <p className="text-[11px] text-red-400/80 leading-relaxed font-medium">
                      This medicine details are unverified or look suspicious. 
                      {selectedMed.validation.suggested_correction && (
                        <span className="block mt-1 font-black">Did you mean: {selectedMed.validation.suggested_correction}?</span>
                      )}
                    </p>
                  </div>
                )}

                <section className="space-y-2 px-1">
                  <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                    <Zap className="w-4 h-4" />
                    Medical Goal
                  </div>
                  <p className="text-foreground/70 text-sm leading-relaxed">{selectedMed.details.why}</p>
                </section>

                <section className="space-y-2 px-1">
                  <div className="flex items-center gap-2 text-accent font-black uppercase tracking-[0.2em] text-[10px]">
                    <ShieldAlert className="w-4 h-4" />
                    How to take
                  </div>
                  <p className="text-foreground/70 text-sm leading-relaxed">{selectedMed.details.how}</p>
                </section>

                {(selectedMed.details as any).effectiveness && (
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-3xl space-y-2">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                      <Star className="w-3.5 h-3.5" />
                      Effectiveness Tips
                    </p>
                    <p className="text-[11px] text-foreground/70 leading-relaxed font-medium">{(selectedMed.details as any).effectiveness}</p>
                  </div>
                )}

                {(selectedMed.details as any).dosageGuidance && (
                  <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-3xl space-y-2">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                      <Info className="w-3.5 h-3.5" />
                      Dosage & Guidance
                    </p>
                    <p className="text-[11px] text-foreground/70 leading-relaxed font-medium">{(selectedMed.details as any).dosageGuidance}</p>
                  </div>
                )}

                {(selectedMed.details as any).precautions && (
                  <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-3xl space-y-2">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Precautions
                    </p>
                    <p className="text-[11px] text-foreground/70 leading-relaxed font-medium">{(selectedMed.details as any).precautions}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <section className="space-y-3 glass-dark p-5 rounded-[32px] border border-white/5">
                    <div className="flex items-center gap-1.5 text-danger font-black uppercase tracking-widest text-[9px]">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Side Effects
                    </div>
                    <ul className="space-y-2">
                      {selectedMed.details.sideEffects.slice(0, 4).map((effect, i) => (
                        <li key={i} className="flex items-center gap-2 text-foreground/50 text-[10px] font-bold">
                          <div className="w-1 h-1 rounded-full bg-danger opacity-50" />
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="space-y-3 bg-success/5 p-5 rounded-[32px] border border-success/10">
                    <div className="flex items-center gap-1.5 text-success font-black uppercase tracking-widest text-[9px]">
                      <Utensils className="w-3.5 h-3.5" />
                      Food Guide
                    </div>
                    <p className="text-success/80 text-[10px] font-bold leading-relaxed">
                      {selectedMed.details.food || "Follow standard instructions."}
                    </p>
                  </section>
                </div>

                {(selectedMed.details as any).warning && (
                  <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20">
                    <p className="text-[9px] font-black text-red-400 uppercase tracking-[0.3em] mb-1">Safety Warning</p>
                    <p className="text-[11px] text-red-400/80 font-bold leading-relaxed">{(selectedMed.details as any).warning}</p>
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSheetOpen(false)}
                  className="w-full py-4 rounded-[28px] bg-primary text-white font-black text-base shadow-2xl shadow-primary/30"
                >
                  GOT IT, THANKS
                </motion.button>
                <p className="text-[9px] text-center text-foreground/20 font-black uppercase tracking-widest">
                  AI-Generated • Consult a Professional
                </p>
              </>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

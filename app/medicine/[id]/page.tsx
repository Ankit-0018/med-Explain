import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Pill,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { MOCK_UI_DATA } from "@/lib/mockData";

interface MedicineDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MedicineDetailPage({
  params,
}: MedicineDetailPageProps) {
  const medicine = MOCK_UI_DATA.medicineCards.find((item) => item.id === "2");

  if (!medicine) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
        <div className="glass p-10 text-center max-w-lg">
          <p className="text-sm uppercase tracking-[0.35em] text-primary/70">
            Medicine detail
          </p>
          <h1 className="mt-4 text-3xl font-black">
            Oops, this medication is unavailable.
          </h1>
          <p className="mt-4 text-sm text-foreground/60">
            Please return to the main screen and choose another medicine from
            your list.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-3xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 animate-gradient opacity-15" />

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="rounded-3xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
              Medicine details
            </div>
          </div>

          <GlassCard className="p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-foreground/40">
                  {medicine.frequency}
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight">
                  {medicine.name}
                </h1>
                <p className="mt-4 max-w-2xl text-sm text-foreground/60">
                  {medicine.short}
                </p>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 text-center">
                <Pill className="mx-auto mb-4 h-10 w-10 rounded-3xl bg-primary/10 p-2 text-primary" />
                <p className="text-sm uppercase tracking-[0.35em] text-foreground/40">
                  Dosage
                </p>
                <p className="mt-3 text-3xl font-black text-foreground">
                  {medicine.dosage}
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  {medicine.frequency}
                </p>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 text-primary mb-5">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-[0.35em] text-primary/70">
                    Why prescribed
                  </span>
                </div>
                <p className="text-sm leading-7 text-foreground/70">
                  {medicine.details.why}
                </p>
              </GlassCard>

              <GlassCard className="p-8">
                <div className="flex items-center gap-3 text-accent mb-5">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-[0.35em] text-accent/70">
                    How it works
                  </span>
                </div>
                <p className="text-sm leading-7 text-foreground/70">
                  {medicine.details.how}
                </p>
              </GlassCard>

              <GlassCard className="p-8 bg-background/40 border-white/10">
                <div className="flex items-center gap-3 text-danger mb-5">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-[0.35em] text-danger/80">
                    Side effects
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-foreground/70">
                  {medicine.details.sideEffects.map((effect) => (
                    <li key={effect} className="flex items-start gap-3">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-danger" />
                      <span>{effect}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            <GlassCard className="p-8 bg-white/5">
              <div className="flex items-center gap-3 text-foreground/80 mb-5">
                <Utensils className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-foreground/40">
                    Food instructions
                  </p>
                  <h2 className="text-xl font-black">Best way to take it</h2>
                </div>
              </div>
              <p className="text-sm leading-7 text-foreground/70">
                {medicine.details.food}
              </p>

              <div className="mt-8 rounded-3xl bg-background/30 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-foreground/40">
                  Reminder
                </p>
                <p className="mt-3 text-sm text-foreground/70">
                  Keep consistent timing and follow the full prescription course
                  even if symptoms ease.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}

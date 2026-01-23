"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Stepper from "@calis/components/Stepper";
import StepLevel from "@calis/components/steps/StepLevel";
import StepGoal from "@calis/components/steps/StepGoal";
import StepDays from "@calis/components/steps/StepDays";
import StepEquipment from "@calis/components/steps/StepEquipment";
import ResultHero from "@calis/components/ResultHero";
import DayCard from "@calis/components/DayCard";
import { createWorkoutPlan } from "@calis/lib/plan";
import { downloadPlanPdf } from "@calis/lib/pdf";
import type { FormData, Plan, Level, Goal } from "@calis/lib/types";
import { Sparkles } from "lucide-react";

const steps = [
    { title: "Experience Level", description: "Select your current level" },
    { title: "Training Goal", description: "What do you want most right now?" },
    { title: "Weekly Schedule", description: "How many days can you train?" },
    { title: "Equipment", description: "What do you have access to?" },
] as const;

export default function Generator() {
    const [step, setStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [form, setForm] = useState<FormData>({ level: "", goal: "", days: 3, equipment: [] });
    const [plan, setPlan] = useState<Plan | null>(null);

    const canProceed = useMemo(() => {
        if (step === 0) return form.level !== "";
        if (step === 1) return form.goal !== "";
        if (step === 2) return form.days >= 2;
        if (step === 3) return form.equipment.length > 0;
        return false;
    }, [step, form]);

    const next = () => (step < steps.length - 1 ? setStep((s) => s + 1) : generate());
    const back = () => step > 0 && setStep((s) => s - 1);
    const toggleEq = (id: string) =>
        setForm((p) => ({ ...p, equipment: p.equipment.includes(id) ? p.equipment.filter((e) => e !== id) : [...p.equipment, id] }));

    function generate() {
        setIsGenerating(true);
        setTimeout(() => {
            const p = createWorkoutPlan(form);
            setPlan(p);
            setShowResult(true);
            setIsGenerating(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 900);
    }

    if (showResult && plan) {
        return (
            <div className="space-y-8 sm:space-y-10">
                <ResultHero
                    title={plan.title}
                    level={plan.level}
                    goal={plan.goal}
                    days={plan.workouts.length}
                    onDownload={async () =>
                        downloadPlanPdf(plan, {
                            logoPath: "/logo.png",
                            siteLine: "calishub.com — Train smart. Recover well. Stay consistent.",
                        })
                    }
                    onReset={() => {
                        setShowResult(false);
                        setStep(0);
                        setForm({ level: "", goal: "", days: 3, equipment: [] });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                />

                <section className="grid grid-cols-1 gap-4 sm:gap-6">
                    {plan.workouts.map((w, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <DayCard index={i} total={plan.workouts.length} type={w.type} duration={w.duration} exercises={w.exercises} />
                        </motion.div>
                    ))}
                </section>
            </div>
        );
    }

    if (isGenerating) {
        return (
            <section className="flex flex-col items-center justify-center min-h-[60svh] space-y-8 sm:space-y-12">
                <div className="relative">
                    <div className="absolute inset-0 w-36 h-36 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#a855f7] opacity-20 animate-ping" />
                    <div className="absolute inset-4 w-28 h-28 rounded-full bg-gradient-to-r from-[#a855f7] to-[#f472b6] opacity-40 animate-pulse" />
                    <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-[#22d3ee] via-[#a855f7] to-[#f472b6] flex items-center justify-center shadow-[0_16px_60px_rgba(168,85,247,.45)]">
                        <Sparkles className="h-12 w-12 text-white animate-spin" style={{ animationDuration: "3s" }} />
                    </div>
                </div>
                <div className="text-center space-y-2 sm:space-y-3 max-w-md px-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#f472b6] bg-clip-text text-transparent">
                        Crafting your plan…
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">Analyzing goals and building a balanced split tailored to your week.</p>
                </div>
                <div className="w-72 h-2 rounded-full overflow-hidden border border-white/10 bg-black/40">
                    <div className="h-full bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#f472b6] animate-[shimmer_2s_ease-in-out_infinite]" />
                </div>
            </section>
        );
    }

    return (
        <>
            <Stepper step={step} labels={steps.map((s) => s.title)} />

            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f15]/90 to-[#12121a]/90 backdrop-blur-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(138,92,246,0.12),rgba(255,255,255,0))]" />
                <div className="relative p-5 sm:p-10 space-y-6 sm:space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold">{steps[step].title}</h2>
                        <p className="text-gray-400 text-sm sm:text-base">{steps[step].description}</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <div key="s0" className="animate-in slide-in-from-right duration-300">
                                <StepLevel value={form.level} onChange={(v) => setForm((p) => ({ ...p, level: v }))} />
                            </div>
                        )}
                        {step === 1 && (
                            <div key="s1" className="animate-in slide-in-from-right duration-300">
                                <StepGoal value={form.goal} onChange={(v) => setForm((p) => ({ ...p, goal: v }))} />
                            </div>
                        )}
                        {step === 2 && (
                            <div key="s2" className="animate-in slide-in-from-right duration-300">
                                <StepDays value={form.days} onChange={(n) => setForm((p) => ({ ...p, days: n }))} />
                            </div>
                        )}
                        {step === 3 && (
                            <div key="s3" className="animate-in slide-in-from-right duration-300">
                                <StepEquipment values={form.equipment} onToggle={toggleEq} />
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Desktop nav */}
                    <div className="hidden sm:flex gap-3">
                        {step > 0 && (
                            <button onClick={back} className="h-12 px-5 rounded-xl border border-white/10 hover:bg-white/5 transition">
                                Back
                            </button>
                        )}
                        <button
                            id="generator-continue"
                            onClick={next}
                            disabled={!canProceed}
                            className="h-12 flex-1 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed  bg-purple-500  hover:opacity-95 transition"
                        >
                            {step === 3 ? "Generate My Plan" : "Continue"}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

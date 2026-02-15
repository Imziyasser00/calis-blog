"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Stepper from "@calis/components/Stepper";
import MaxRepResultHero from "@calis/components/MaxRepResultHero";
import { trackEvent } from "@calis/lib/analytics/track";
import MaxRepResult from "@calis/components/MaxRepResult";
import StepExercise from "@calis/components/steps-maxrep/StepExercise";
import StepPerformance from "@calis/components/steps-maxrep/StepPerformance";
import StepAdvanced from "@calis/components/steps-maxrep/StepAdvanced";
import { createMaxRepEstimate, EstimatorForm, EstimatorResult } from "@calis/lib/max-rep-estimator";

const steps = [
    { title: "Exercise", description: "Pick the movement you want to estimate" },
    { title: "Your Best Set", description: "Tell me reps, BW, and any added load" },
    { title: "Advanced", description: "RIR, tempo, rest quality, and training goal" },
] as const;

const DEFAULT_FORM: EstimatorForm = {
    exercise: "",
    knownType: "reps",
    reps: 8,
    addedLoadKg: 0,
    bodyweightKg: 70,
    rir: 0,
    tempo: "normal",
    restQuality: "good",
    goal: "strength",
};

export default function Estimator() {
    const [step, setStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [form, setForm] = useState<EstimatorForm>(DEFAULT_FORM);
    const [result, setResult] = useState<EstimatorResult | null>(null);

    // analytics refs
    const viewedRef = useRef(false);
    const lastStepRef = useRef<number>(-1);
    const submittedRef = useRef(false);
    const downloadedRef = useRef(false);

    useEffect(() => {
        if (viewedRef.current) return;
        viewedRef.current = true;

        const key = "ch_viewed_tool_max_rep_estimator";
        if (typeof window === "undefined") return;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");

        trackEvent("tool_view", { tool: "max_rep_estimator" });
    }, []);

    useEffect(() => {
        if (lastStepRef.current === step) return;
        lastStepRef.current = step;

        trackEvent("tool_step_view", {
            tool: "max_rep_estimator",
            step,
            stepName: steps[step]?.title,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    const canProceed = useMemo(() => {
        if (step === 0) return form.exercise !== "";
        if (step === 1) return form.reps >= 1 && form.bodyweightKg > 0 && form.addedLoadKg >= 0;
        if (step === 2) return true;
        return false;
    }, [step, form]);

    const next = () => (step < steps.length - 1 ? setStep((s) => s + 1) : generate());
    const back = () => step > 0 && setStep((s) => s - 1);

    function generate() {
        if (isGenerating) return;

        if (!submittedRef.current) {
            submittedRef.current = true;
            trackEvent("tool_submit", {
                tool: "max_rep_estimator",
                exercise: form.exercise,
                reps: form.reps,
                bodyweightKg: form.bodyweightKg,
                addedLoadKg: form.addedLoadKg,
                rir: form.rir,
                tempo: form.tempo,
                restQuality: form.restQuality,
                goal: form.goal,
            });
        }

        setIsGenerating(true);

        setTimeout(() => {
            const r = createMaxRepEstimate(form);
            setResult(r);
            setShowResult(true);
            setIsGenerating(false);
            window.scrollTo({ top: 0, behavior: "smooth" });

            trackEvent("tool_result", {
                tool: "max_rep_estimator",
                exercise: r.exercise,
                estimated1RMKg: r.estimated1RMKg,
                strengthRatio: r.strengthRatio,
            });
        }, 650);
    }

    if (showResult && result) {
        return (
            <div className="space-y-8 sm:space-y-10">
                <MaxRepResultHero
                    title={result.title}
                    subtitle="1RM-equivalent and rep-max table based on your inputs."
                    badges={[
                        form.exercise.toUpperCase(),
                        `${form.reps} reps`,
                        `${form.bodyweightKg}kg BW`,
                        form.addedLoadKg > 0 ? `+${form.addedLoadKg}kg` : "Bodyweight",
                        `RIR ${form.rir}`,
                        form.goal,
                    ]}
                />

                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                    <MaxRepResult r={result} />
                </motion.div>
            </div>
        );
    }

    if (isGenerating) {
        return (
            <section className="flex flex-col items-center justify-center min-h-[60svh] space-y-8 sm:space-y-12">
                <div className="text-center space-y-2 sm:space-y-3 max-w-md px-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#f472b6] bg-clip-text text-transparent">
                        Calculating your max…
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                        Blending formulas, applying RIR/tempo/rest modifiers, and building your rep-max table.
                    </p>
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

                    {step === 0 && (
                        <div className="animate-in slide-in-from-right duration-300">
                            <StepExercise value={form.exercise} onChange={(v) => setForm((p) => ({ ...p, exercise: v }))} />
                        </div>
                    )}

                    {step === 1 && (
                        <div className="animate-in slide-in-from-right duration-300">
                            <StepPerformance
                                reps={form.reps}
                                onReps={(n) => setForm((p) => ({ ...p, reps: n }))}
                                bodyweightKg={form.bodyweightKg}
                                onBodyweight={(n) => setForm((p) => ({ ...p, bodyweightKg: n }))}
                                addedLoadKg={form.addedLoadKg}
                                onAddedLoad={(n) => setForm((p) => ({ ...p, addedLoadKg: n }))}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in slide-in-from-right duration-300">
                            <StepAdvanced
                                rir={form.rir}
                                onRir={(n) => setForm((p) => ({ ...p, rir: n }))}
                                tempo={form.tempo}
                                onTempo={(v) => setForm((p) => ({ ...p, tempo: v }))}
                                restQuality={form.restQuality}
                                onRestQuality={(v) => setForm((p) => ({ ...p, restQuality: v }))}
                                goal={form.goal}
                                onGoal={(v) => setForm((p) => ({ ...p, goal: v }))}
                            />
                        </div>
                    )}

                    <div className="hidden sm:flex gap-3">
                        {step > 0 && (
                            <button onClick={back} className="h-12 px-5 rounded-xl border border-white/10 hover:bg-white/5 transition">
                                Back
                            </button>
                        )}
                        <button
                            onClick={next}
                            disabled={!canProceed}
                            className="h-12 flex-1 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed bg-purple-500 hover:opacity-95 transition"
                        >
                            {step === steps.length - 1 ? "Estimate My Max" : "Continue"}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

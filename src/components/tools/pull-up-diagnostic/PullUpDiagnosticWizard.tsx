"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Stepper from "@calis/components/Stepper";
import QuestionCard from "./QuestionCard";
import ResultPanel from "./ResultPanel";
import type {
    Answers,
    FailurePoint,
    HangTimeBucket,
    LatFeel,
    Pain,
    TrainDays,
    YesKindaNo,
} from "./types";
import { diagnose } from "./diagnose";
import AffiliateRecommendations from "@calis/components/AffiliateRecommendations";

/** ---------------- helpers ---------------- */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function getRatioBucketFromPullups(maxPullups: number) {
    // very simple bucket. adjust later if you want.
    if (maxPullups <= 1) return 0.9; // beginner-ish
    if (maxPullups <= 5) return 1.15; // early intermediate
    if (maxPullups <= 10) return 1.45; // advanced-ish
    return 1.85; // elite-ish
}

function affiliateRatioFromAnswers(a: Answers) {
    // If weight exists, bias slightly up (more "serious" setup likely)
    const base = getRatioBucketFromPullups(a.maxPullups);
    if (a.weightKg) return base + 0.05;
    return base;
}

/** ---------------- defaults ---------------- */
const defaultAnswers: Answers = {
    maxPullups: 0,
    negative: "no",
    hangTime: "<10",
    weightKg: undefined,
    trainDays: 2,
    failPoint: "start",
    latFeel: "no",
    pain: "none",
};

const steps = [
    { title: "Max Pull-ups", description: "Strict reps, full hang to chin over bar." },
    { title: "Negative Control", description: "Can you control the descent?" },
    { title: "Dead Hang", description: "How long can you hang from the bar?" },
    { title: "Bodyweight", description: "Optional, helps personalize advice." },
    { title: "Training Days", description: "How often can you train pull-ups?" },
    { title: "Failure Point", description: "Where do you get stuck?" },
    { title: "Lat Engagement", description: "Do you feel your lats working?" },
    { title: "Pain Check", description: "Any pain we should account for?" },
] as const;

export default function PullUpDiagnosticWizard() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Answers>(defaultAnswers);
    const [done, setDone] = useState(false);

    const result = useMemo(() => (done ? diagnose(answers) : null), [done, answers]);
    const progress = Math.round(((step + 1) / 8) * 100);

    function next() {
        setStep((s) => clamp(s + 1, 0, 7));
    }
    function back() {
        setStep((s) => clamp(s - 1, 0, 7));
    }
    function reset() {
        setAnswers(defaultAnswers);
        setStep(0);
        setDone(false);
    }
    function set<K extends keyof Answers>(key: K, value: Answers[K]) {
        setAnswers((a) => ({ ...a, [key]: value }));
    }

    if (done && result) {
        // ✅ Affiliate logic for THIS tool:
        // - Use a proxy "strengthRatio" derived from maxPullups / context.
        // - You can later replace this with a true strength score if you compute one.
        const affiliateRatio = affiliateRatioFromAnswers(answers);

        return (
            <div className="space-y-5 sm:space-y-6">
                <ResultPanel answers={answers} result={result} onReset={reset} />

                {/* Affiliate section (same strategy as estimator) */}
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-4">
                        <h3 className="text-xl font-extrabold">Recommended gear for your blocker</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Based on your answers (pull-up level + where you fail + hang time).
                        </p>
                    </div>

                    {/* Optional: add a small personalized hint */}
                    <div className="mb-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-gray-300">
                        <p className="font-semibold text-gray-200">Quick tip</p>
                        <p className="mt-1 text-gray-400">
                            Your primary focus is{" "}
                            <span className="text-gray-200 font-semibold">
                {answers.failPoint === "grip"
                    ? "grip endurance"
                    : answers.failPoint === "start"
                        ? "getting off the dead hang"
                        : answers.failPoint === "middle"
                            ? "mid-range strength"
                            : "top-range strength"}
              </span>
                            . These picks help you train that faster.
                        </p>
                    </div>

                    {/* Reuse your affiliate component */}
                    <AffiliateRecommendations strengthRatio={affiliateRatio} />

                    {/* Extra micro-recs based on answers (optional, tiny + effective) */}
                    <ExtraGearRow answers={answers} />
                </section>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Stepper */}
            <Stepper step={step} labels={steps.map((s) => s.title)} />

            {/* Glass container */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f15]/90 to-[#12121a]/90 backdrop-blur-xl">
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(138,92,246,0.14),rgba(255,255,255,0))]" />
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative p-5 sm:p-10 space-y-6 sm:space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold">{steps[step].title}</h2>
                        <p className="text-gray-400 text-sm sm:text-base">{steps[step].description}</p>
                    </div>

                    {/* Progress */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-white/70">Progress</p>
                            <p className="text-sm text-white/70">{progress}%</p>
                        </div>

                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-black/40">
                            <div
                                className="h-full bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#f472b6] transition-[width] duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Question */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.22 }}
                            className="space-y-4"
                        >


                            {step === 0 && (
                                <QuestionCard title="Q1. What’s your current max pull-ups?" subtitle="Strict reps, full hang to chin over bar.">
                                    <div className="flex items-center gap-3">
                                        <MobileIntInput
                                            value={answers.maxPullups}
                                            onChange={(v) => set("maxPullups", v)}
                                            min={0}
                                            max={30}
                                            step={1}
                                            unit="reps"
                                        />
                                    </div>

                                    <div className="mt-3 text-xs text-white/60">
                                        Tip: Count only clean reps (no kipping).
                                    </div>
                                </QuestionCard>
                            )}


                            {step === 2 && (
                                <QuestionCard title="Q3. Dead hang time (from a bar)">
                                    <ChoiceRow<HangTimeBucket>
                                        value={answers.hangTime}
                                        onChange={(v) => set("hangTime", v)}
                                        options={[
                                            { value: "<10", label: "< 10s" },
                                            { value: "10-30", label: "10–30s" },
                                            { value: "30-60", label: "30–60s" },
                                            { value: "60+", label: "60s+" },
                                        ]}
                                    />
                                </QuestionCard>
                            )}

                            {/* ✅ Replace your step === 3 block with this (mobile-friendly numeric input + +/- buttons) */}
                            {step === 3 && (
                                <QuestionCard title="Q4. Bodyweight (optional)" subtitle="If you don’t want to enter it, leave empty.">
                                    <MobileNumberInput
                                        value={answers.weightKg}
                                        onChange={(v) => set("weightKg", v)}
                                        min={30}
                                        max={250}
                                        step={0.5}
                                        placeholder="e.g. 78"
                                        unit="kg"
                                    />
                                </QuestionCard>
                            )}


                            {step === 4 && (
                                <QuestionCard title="Q5. How many days per week can you train pull-ups?">
                                    <ChoiceRow<TrainDays>
                                        value={answers.trainDays}
                                        onChange={(v) => set("trainDays", v)}
                                        options={[
                                            { value: 1, label: "1" },
                                            { value: 2, label: "2" },
                                            { value: 3, label: "3" },
                                            { value: 4, label: "4+" },
                                        ]}
                                    />
                                </QuestionCard>
                            )}

                            {step === 5 && (
                                <QuestionCard title="Q6. Where do you fail?">
                                    <ChoiceRow<FailurePoint>
                                        value={answers.failPoint}
                                        onChange={(v) => set("failPoint", v)}
                                        options={[
                                            { value: "start", label: "At the start (can’t leave the hang)" },
                                            { value: "middle", label: "Middle range (stuck halfway)" },
                                            { value: "top", label: "Near the top (chin almost over bar)" },
                                            { value: "grip", label: "Grip gives out first" },
                                        ]}
                                    />
                                </QuestionCard>
                            )}

                            {step === 6 && (
                                <QuestionCard title="Q7. Do you feel your lats working?">
                                    <ChoiceRow<LatFeel>
                                        value={answers.latFeel}
                                        onChange={(v) => set("latFeel", v)}
                                        options={[
                                            { value: "yes", label: "✅ Yes" },
                                            { value: "sometimes", label: "⚠️ Sometimes" },
                                            { value: "no", label: "❌ No (mostly arms)" },
                                        ]}
                                    />
                                </QuestionCard>
                            )}

                            {step === 7 && (
                                <QuestionCard title="Q8. Any pain?">
                                    <ChoiceRow<Pain>
                                        value={answers.pain}
                                        onChange={(v) => set("pain", v)}
                                        options={[
                                            { value: "none", label: "None" },
                                            { value: "elbow", label: "Elbow pain" },
                                            { value: "shoulder", label: "Shoulder pain" },
                                            { value: "wrist", label: "Wrist/hand pain" },
                                        ]}
                                    />

                                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                                        <p className="text-sm font-semibold">Ready?</p>
                                        <p className="mt-1 text-sm text-white/70">
                                            Next step will show your primary blocker + a 4-week plan.
                                        </p>
                                    </div>
                                </QuestionCard>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                        <button
                            onClick={back}
                            disabled={step === 0}
                            className="h-12 px-5 rounded-xl border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>

                        {step < 7 ? (
                            <button
                                onClick={next}
                                className="h-12 flex-1 rounded-xl font-semibold text-white bg-purple-500 hover:opacity-95 transition"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={() => setDone(true)}
                                className="h-12 flex-1 rounded-xl font-semibold text-white bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#f472b6] hover:opacity-95 transition shadow-[0_16px_60px_rgba(168,85,247,.25)]"
                            >
                                Get results
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

/** Premium choice row */
function ChoiceRow<T extends string | number>({
                                                  value,
                                                  onChange,
                                                  options,
                                              }: {
    value: T;
    onChange: (v: T) => void;
    options: Array<{ value: T; label: string }>;
}) {
    return (
        <div className="grid gap-2">
            {options.map((opt) => {
                const active = opt.value === value;
                return (
                    <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={[
                            "w-full rounded-2xl border px-4 py-3 text-left text-sm transition",
                            "focus:outline-none focus:ring-2 focus:ring-purple-500/25",
                            active
                                ? "border-purple-500/50 bg-purple-500/15 shadow-[0_10px_30px_rgba(168,85,247,.15)]"
                                : "border-white/10 bg-black/30 hover:bg-white/5 hover:border-white/15",
                        ].join(" ")}
                    >
                        <span className={active ? "text-white" : "text-white/90"}>{opt.label}</span>
                        {active && <span className="block mt-1 text-xs text-white/60">Selected</span>}
                    </button>
                );
            })}
        </div>
    );
}

/** Optional: tiny extra recs based on precise answers (keeps affiliate feeling "smart") */
function ExtraGearRow({ answers }: { answers: Answers }) {
    const items: Array<{ name: string; reason: string }> = [];

    if (answers.hangTime === "<10") items.push({ name: "Pull-up assist bands", reason: "Build strength while improving hang time." });
    if (answers.failPoint === "grip") items.push({ name: "Chalk / grip aid", reason: "Grip endurance is your limiter." });
    if (answers.latFeel === "no") items.push({ name: "Gym rings", reason: "Better lat engagement and scap control." });
    if (answers.pain === "elbow") items.push({ name: "Elbow sleeves", reason: "Support the joint while you rebuild volume." });

    if (items.length === 0) return null;

    return (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-sm font-semibold text-gray-200">Extra picks (based on your answers)</div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.slice(0, 4).map((it) => (
                    <div key={it.name} className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <div className="text-sm font-semibold text-gray-100">{it.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{it.reason}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ✅ Add this component at the bottom of the SAME FILE (under ChoiceRow) */
function MobileNumberInput({
                               value,
                               onChange,
                               min,
                               max,
                               step = 1,
                               placeholder,
                               unit,
                           }: {
    value: number | undefined;
    onChange: (v: number | undefined) => void;
    min: number;
    max: number;
    step?: number;
    placeholder?: string;
    unit?: string;
}) {
    const clamp = (n: number) => Math.max(min, Math.min(max, n));

    const display = value === undefined ? "" : String(value);

    const parse = (raw: string) => {
        const v = raw.replace(",", ".").trim();
        if (v === "") return undefined;
        const num = Number(v);
        if (!Number.isFinite(num)) return value;
        return clamp(num);
    };

    const bump = (dir: -1 | 1) => {
        const current = value ?? min;
        const next = clamp(Math.round((current + dir * step) * 10) / 10);
        onChange(next);
    };

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => bump(-1)}
                className="h-12 w-12 rounded-xl border border-white/10 bg-black/35 hover:bg-white/5 transition text-lg text-white/90"
                aria-label="Decrease bodyweight"
            >
                −
            </button>

            <div className="relative flex-1">
                <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    enterKeyHint="done"
                    value={display}
                    onChange={(e) => onChange(parse(e.target.value))}
                    placeholder={placeholder}
                    className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 pr-12 text-white outline-none focus:border-white/20 focus:ring-2 focus:ring-purple-500/20 text-center"
                />
                {unit ? (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60">
            {unit}
          </span>
                ) : null}
            </div>

            <button
                type="button"
                onClick={() => bump(1)}
                className="h-12 w-12 rounded-xl border border-white/10 bg-black/35 hover:bg-white/5 transition text-lg text-white/90"
                aria-label="Increase bodyweight"
            >
                +
            </button>
        </div>
    );
}

function MobileIntInput({
                            value,
                            onChange,
                            min,
                            max,
                            step = 1,
                            unit,
                        }: {
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
}) {
    const clamp = (n: number) => Math.max(min, Math.min(max, n));

    const parse = (raw: string) => {
        // keep only digits
        const clean = raw.replace(/\D/g, "");
        if (clean === "") return min;
        const num = Number(clean);
        if (!Number.isFinite(num)) return value;
        return clamp(num);
    };

    const bump = (dir: -1 | 1) => onChange(clamp(value + dir * step));

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => bump(-1)}
                className="h-12 w-12 rounded-xl border border-white/10 bg-black/35 hover:bg-white/5 transition text-lg text-white/90"
                aria-label="Decrease reps"
            >
                −
            </button>

            <div className="relative w-40">
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    enterKeyHint="done"
                    value={String(value)}
                    onChange={(e) => onChange(parse(e.target.value))}
                    className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 pr-14 text-white outline-none focus:border-white/20 focus:ring-2 focus:ring-purple-500/20 text-center"
                />
                {unit ? (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60">
            {unit}
          </span>
                ) : null}
            </div>

            <button
                type="button"
                onClick={() => bump(1)}
                className="h-12 w-12 rounded-xl border border-white/10 bg-black/35 hover:bg-white/5 transition text-lg text-white/90"
                aria-label="Increase reps"
            >
                +
            </button>
        </div>
    );
}

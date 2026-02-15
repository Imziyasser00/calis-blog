"use client";

import React, { useMemo, useState } from "react";
import { EstimatorResult } from "@calis/lib/max-rep-estimator";
import AffiliateRecommendations from "@calis/components/AffiliateRecommendations";
import { Flame, PlusCircle, Gauge, Info, Sparkles, Target } from "lucide-react";

export default function MaxRepResult({ r }: { r: EstimatorResult }) {
    const [simpleMode, setSimpleMode] = useState(true);

    const estAdded1RM = useMemo(() => {
        const v = r.estimated1RMKg - r.input.bodyweightKg;
        return Math.round(v * 10) / 10;
    }, [r]);

    return (
        <section className="space-y-4">
            {/* Simple/Advanced toggle */}
            <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-gray-400 flex items-center gap-2">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-300" />
              {simpleMode ? "Simple view (recommended)" : "Advanced view"}
          </span>
                </div>

                <button
                    type="button"
                    onClick={() => setSimpleMode((s) => !s)}
                    className="h-10 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
                >
                    {simpleMode ? "Show advanced" : "Show simple"}
                </button>
            </div>

            {/* Top stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {simpleMode ? (
                    <>
                        <Stat
                            icon={<Flame className="h-5 w-5 text-orange-300" />}
                            title="Estimated max strength"
                            value={`${r.estimated1RMKg} kg`}
                            pill="Total load"
                            sub="Estimated 1-rep max equivalent (bodyweight + added load)."
                        />
                        <Stat
                            icon={<PlusCircle className="h-5 w-5 text-cyan-300" />}
                            title="Estimated max added weight"
                            value={`${estAdded1RM} kg`}
                            pill="Added load"
                            sub="Roughly how much extra weight you could handle for 1 hard rep."
                        />
                        <Stat
                            icon={<Gauge className="h-5 w-5 text-purple-300" />}
                            title="Strength level"
                            value={`${r.strengthRatio}× BW`}
                            pill="Ratio"
                            sub="Higher = stronger for this movement (example: 1.3× BW)."
                        />
                    </>
                ) : (
                    <>
                        <Stat
                            icon={<Flame className="h-5 w-5 text-orange-300" />}
                            title="Estimated 1RM-equivalent"
                            value={`${r.estimated1RMKg} kg`}
                            pill="BW + load"
                            sub="Total load at your estimated max."
                        />
                        <Stat
                            icon={<Info className="h-5 w-5 text-cyan-300" />}
                            title="Current total load"
                            value={`${r.estimatedBWPlusLoadKg} kg`}
                            pill="Input"
                            sub="Your entered bodyweight + added load."
                        />
                        <Stat
                            icon={<Gauge className="h-5 w-5 text-purple-300" />}
                            title="Strength ratio"
                            value={`${r.strengthRatio}`}
                            pill="1RM / BW"
                            sub="Normalized strength indicator."
                        />
                    </>
                )}
            </div>

            {/* Rep table */}
            <GlassCard>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-purple-300" />
                            <div className="font-semibold text-lg">
                                {simpleMode ? "What you could likely do" : "Estimated rep max table"}
                            </div>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                            {simpleMode
                                ? "Realistic targets based on your input. Use them to choose the right difficulty."
                                : "Total load (BW + added load) you could likely hit for each rep target."}
                        </div>
                    </div>

                    {simpleMode && (
                        <div className="hidden sm:block text-xs text-gray-500 max-w-[260px] text-right">
                            Tip: No weights? Use harder/easier variations until you match the rep target.
                        </div>
                    )}
                </div>

                <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {r.repTable.map((p) => (
                        <RepTile
                            key={p.reps}
                            label={simpleMode ? `${p.reps} hard reps` : `${p.reps}RM`}
                            value={`${p.estLoadKg}`}
                            sub={simpleMode ? "kg total load" : "kg total"}
                        />
                    ))}
                </div>

                {simpleMode && (
                    <InfoCallout
                        title="How to use this"
                        text="Pick a rep range, then choose a difficulty (or added weight) that keeps you in that range with clean form."
                    />
                )}
            </GlassCard>

            {/* Training suggestion */}
            <GlassCard>
                <div className="font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-300" />
                    {simpleMode ? "What to do next" : "Training suggestion"}
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Mini
                        title={simpleMode ? "Aim for" : "Rep range"}
                        value={r.suggestedWork.range}
                        accent="from-purple-400/20 via-cyan-400/10 to-transparent"
                    />
                    <Mini
                        title={simpleMode ? "Effort" : "Intensity"}
                        value={simpleMode ? simplifyIntensity(r.suggestedWork.intensityHint) : r.suggestedWork.intensityHint}
                        accent="from-cyan-400/20 via-purple-400/10 to-transparent"
                    />
                    <Mini
                        title={simpleMode ? "Structure" : "Sets & rest"}
                        value={simpleMode ? simplifySets(r.suggestedWork.setsHint) : r.suggestedWork.setsHint}
                        accent="from-pink-400/20 via-purple-400/10 to-transparent"
                    />
                </div>

                {simpleMode && <ExampleBox r={r} />}

                {r.notes.length > 0 && (
                    <div className="mt-4 text-sm text-gray-400 space-y-1">
                        {r.notes.map((n, i) => (
                            <div key={i}>• {n}</div>
                        ))}
                    </div>
                )}
            </GlassCard>

            <AffiliateRecommendations strengthRatio={r.strengthRatio} />
        </section>
    );
}

function ExampleBox({ r }: { r: EstimatorResult }) {
    const target = r.suggestedWork.range.includes("3–6")
        ? 5
        : r.suggestedWork.range.includes("4–8")
            ? 6
            : r.suggestedWork.range.includes("6–12")
                ? 10
                : 15;

    const match = r.repTable.reduce((best, p) => {
        if (!best) return p;
        return Math.abs(p.reps - target) < Math.abs(best.reps - target) ? p : best;
    }, r.repTable[0]);

    return (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm">
            <div className="flex items-center gap-2 font-semibold text-gray-200">
                <Info className="h-4 w-4 text-purple-300" />
                Example (based on your estimate)
            </div>
            <div className="text-gray-400 mt-2">
                Train around{" "}
                <span className="text-gray-200 font-semibold">{target} reps</span>.
                Your matching total load is roughly{" "}
                <span className="text-gray-200 font-semibold">{match.estLoadKg} kg</span>.
                <br />
                With weights: adjust load to land close to that. Without weights: pick a harder/easier variation to hit the reps.
            </div>
        </div>
    );
}

/* ---------- UI bits ---------- */

function GlassCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-5 overflow-hidden">
            {/* glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.10),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.12),transparent_45%),radial-gradient(circle_at_50%_120%,rgba(244,114,182,0.10),transparent_40%)]" />
            <div className="relative">{children}</div>
        </div>
    );
}

function Stat({
                  icon,
                  title,
                  value,
                  pill,
                  sub,
              }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    pill: string;
    sub: string;
}) {
    return (
        <div className="group relative rounded-3xl border border-white/10 bg-white/5 p-5 overflow-hidden transition hover:bg-white/10 hover:-translate-y-[1px]">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.18),transparent_45%)]" />

            <div className="relative">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center">
                            {icon}
                        </div>
                        <div>
                            <div className="text-sm text-gray-300 font-semibold">{title}</div>
                            <div className="text-xs text-gray-500">{pill}</div>
                        </div>
                    </div>

                    <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-black/30 text-gray-300">
            Est.
          </span>
                </div>

                <div className="mt-4 text-3xl font-extrabold bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#f472b6] bg-clip-text text-transparent">
                    {value}
                </div>

                <div className="mt-2 text-xs text-gray-500 leading-relaxed">{sub}</div>
            </div>
        </div>
    );
}

function RepTile({ label, value, sub }: { label: string; value: string; sub: string }) {
    return (
        <div className="group relative rounded-2xl border border-white/10 bg-black/25 p-3 text-center overflow-hidden transition hover:bg-white/5 hover:-translate-y-[1px]">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.14),transparent_55%)]" />
            <div className="relative">
                <div className="text-xs text-gray-400">{label}</div>
                <div className="text-2xl font-extrabold mt-1 text-gray-100">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{sub}</div>
            </div>
        </div>
    );
}

function Mini({
                  title,
                  value,
                  accent,
              }: {
    title: string;
    value: string;
    accent: string;
}) {
    return (
        <div className="relative rounded-2xl border border-white/10 bg-black/25 p-4 overflow-hidden">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent}`} />
            <div className="relative">
                <div className="text-xs text-gray-400">{title}</div>
                <div className="font-semibold mt-1 text-gray-100">{value}</div>
            </div>
        </div>
    );
}

function InfoCallout({ title, text }: { title: string; text: string }) {
    return (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-center gap-2 font-semibold text-gray-200">
                <Info className="h-4 w-4 text-cyan-300" />
                {title}
            </div>
            <div className="text-sm text-gray-400 mt-2">{text}</div>
        </div>
    );
}

/* ---------- helpers ---------- */

function simplifyIntensity(s: string) {
    if (s.toLowerCase().includes("rpe")) return "Stop with ~1–3 reps left (don’t fully fail every set).";
    return s;
}

function simplifySets(s: string) {
    return s.replace("•", " |");
}

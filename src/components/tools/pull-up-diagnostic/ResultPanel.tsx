"use client";

import React from "react";
import type { Answers, DiagnosticResult } from "./types";
import { blockerCopy, blockerLabels, painNote, roadmaps, roadmapTier } from "./diagnosticConfig";

export default function ResultPanel({
                                        answers,
                                        result,
                                        onReset,
                                    }: {
    answers: Answers;
    result: DiagnosticResult;
    onReset: () => void;
}) {
    const primary = blockerCopy[result.primary];
    const secondary = result.secondary ? blockerCopy[result.secondary] : null;

    const tier = roadmapTier(answers.trainDays);
    const weeks = roadmaps[result.primary][tier];

    const painMsg = painNote(result);

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-white/50">
                            Primary blocker
                        </p>
                        <h2 className="mt-1 text-2xl font-bold">{primary.title}</h2>
                        <p className="mt-2 text-white/70">{primary.explanation}</p>

                        <div className="mt-4">
                            <p className="text-sm font-semibold">Focus</p>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
                                {primary.focus.map((x) => (
                                    <li key={x}>{x}</li>
                                ))}
                            </ul>
                        </div>

                        {secondary ? (
                            <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                                <p className="text-xs uppercase tracking-wider text-white/50">
                                    Secondary blocker
                                </p>
                                <p className="mt-1 text-sm font-semibold">
                                    {blockerLabels[result.secondary!]}
                                </p>
                                <p className="mt-2 text-sm text-white/70">
                                    {secondary.title} {secondary.explanation}
                                </p>
                            </div>
                        ) : null}

                        {painMsg ? (
                            <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                                <p className="text-sm font-semibold">⚠️ Pain-first note</p>
                                <p className="mt-2 text-sm text-white/70">{painMsg}</p>
                            </div>
                        ) : null}
                    </div>

                    <button
                        onClick={onReset}
                        className="shrink-0 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-wider text-white/50">Plan</p>
                <h3 className="mt-1 text-lg font-semibold">
                    4-week focus plan ({answers.trainDays} day{answers.trainDays > 1 ? "s" : ""}/week)
                </h3>

                <div className="mt-4 space-y-4">
                    {weeks.map((w) => (
                        <div key={w.title} className="rounded-xl border border-white/10 bg-black/30 p-4">
                            <p className="font-semibold">{w.title}</p>
                            <ul className="mt-2 space-y-2 text-sm text-white/70">
                                {w.items.map((it) => (
                                    <li key={it.label} className="flex items-start justify-between gap-4">
                                        <span>{it.label}</span>
                                        <span className="text-white/60">{it.sets}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {result.notes.length ? (
                    <div className="mt-5">
                        <p className="text-sm font-semibold">Notes</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
                            {result.notes.map((n) => (
                                <li key={n}>{n}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>


        </div>
    );
}

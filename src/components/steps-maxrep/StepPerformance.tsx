"use client";

import React from "react";

export default function StepPerformance({
                                            reps,
                                            onReps,
                                            bodyweightKg,
                                            onBodyweight,
                                            addedLoadKg,
                                            onAddedLoad,
                                        }: {
    reps: number;
    onReps: (n: number) => void;
    bodyweightKg: number;
    onBodyweight: (n: number) => void;
    addedLoadKg: number;
    onAddedLoad: (n: number) => void;
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <NumberField
                label="Reps you can do"
                hint="Use your best recent set"
                value={reps}
                onChange={(n) => onReps(n)}
                step={1}
                min={1}
                max={50}
                inputMode="numeric"
            />

            <NumberField
                label="Bodyweight (kg)"
                hint="Used for BW strength ratio"
                value={bodyweightKg}
                onChange={(n) => onBodyweight(n)}
                step={0.5}
                min={20}
                max={250}
                inputMode="decimal"
            />

            <NumberField
                label="Added load (kg)"
                hint="Belt / vest / plates"
                value={addedLoadKg}
                onChange={(n) => onAddedLoad(n)}
                step={0.5}
                min={0}
                max={200}
                inputMode="decimal"
            />
        </div>
    );
}

function NumberField({
                         label,
                         hint,
                         value,
                         onChange,
                         step = 1,
                         min = 0,
                         max = 999,
                         inputMode = "numeric",
                     }: {
    label: string;
    hint: string;
    value: number;
    onChange: (n: number) => void;
    step?: number;
    min?: number;
    max?: number;
    inputMode?: "numeric" | "decimal";
}) {
    const clamp = (n: number) => Math.max(min, Math.min(max, n));

    const parse = (raw: string) => {
        const v = raw.replace(",", ".").trim();
        if (v === "") return value; // keep current while user clears briefly
        const num = Number(v);
        if (!Number.isFinite(num)) return value;
        return clamp(num);
    };

    const pattern =
        inputMode === "decimal" ? "[0-9]*[.,]?[0-9]*" : "[0-9]*";

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="font-semibold">{label}</div>
            <div className="text-sm text-gray-400 mb-3">{hint}</div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onChange(clamp(value - step))}
                    className="h-12 w-12 rounded-xl border border-white/10 bg-black/30 hover:bg-white/5 transition text-lg"
                    aria-label={`Decrease ${label}`}
                >
                    −
                </button>

                <input
                    type="text"
                    inputMode={inputMode}
                    pattern={pattern}
                    enterKeyHint="done"
                    value={String(value)}
                    onChange={(e) => onChange(parse(e.target.value))}
                    className="flex-1 h-12 px-4 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-center"
                />

                <button
                    type="button"
                    onClick={() => onChange(clamp(value + step))}
                    className="h-12 w-12 rounded-xl border border-white/10 bg-black/30 hover:bg-white/5 transition text-lg"
                    aria-label={`Increase ${label}`}
                >
                    +
                </button>
            </div>

            <div className="mt-2 text-xs text-gray-500">
                Min {min} • Max {max} • Step {step}
            </div>
        </div>
    );
}

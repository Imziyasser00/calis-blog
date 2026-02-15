"use client";

import { EstimatorGoal } from "@calis/lib/max-rep-estimator";

export default function StepAdvanced({
                                         rir,
                                         onRir,
                                         tempo,
                                         onTempo,
                                         restQuality,
                                         onRestQuality,
                                         goal,
                                         onGoal,
                                     }: {
    rir: number;
    onRir: (n: number) => void;
    tempo: "normal" | "slow" | "explosive";
    onTempo: (v: "normal" | "slow" | "explosive") => void;
    restQuality: "good" | "ok" | "poor";
    onRestQuality: (v: "good" | "ok" | "poor") => void;
    goal: EstimatorGoal;
    onGoal: (v: EstimatorGoal) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold">Reps in Reserve (RIR)</div>
                <div className="text-sm text-gray-400 mb-3">
                    If you stopped before failure, tell me how many reps you had left.
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min={0}
                        max={5}
                        value={rir}
                        onChange={(e) => onRir(Number(e.target.value))}
                        className="w-full"
                    />
                    <div className="w-10 text-right font-semibold">{rir}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Picker
                    title="Tempo"
                    value={tempo}
                    options={[
                        { id: "normal", label: "Normal" },
                        { id: "slow", label: "Slow" },
                        { id: "explosive", label: "Explosive" },
                    ]}
                    onChange={onTempo}
                />
                <Picker
                    title="Rest quality"
                    value={restQuality}
                    options={[
                        { id: "good", label: "Good" },
                        { id: "ok", label: "OK" },
                        { id: "poor", label: "Poor" },
                    ]}
                    onChange={onRestQuality}
                />
            </div>

            <Picker
                title="Primary goal"
                value={goal}
                options={[
                    { id: "strength", label: "Strength" },
                    { id: "hypertrophy", label: "Hypertrophy" },
                    { id: "endurance", label: "Endurance" },
                ]}
                onChange={onGoal}
            />
        </div>
    );
}

function Picker<T extends string>({
                                      title,
                                      value,
                                      options,
                                      onChange,
                                  }: {
    title: string;
    value: T;
    options: { id: T; label: string }[];
    onChange: (v: T) => void;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="font-semibold mb-3">{title}</div>
            <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                    <button
                        key={o.id}
                        onClick={() => onChange(o.id)}
                        className={[
                            "h-10 px-4 rounded-xl border text-sm transition",
                            value === o.id ? "border-purple-500 bg-white/5" : "border-white/10 hover:bg-white/5",
                        ].join(" ")}
                    >
                        {o.label}
                    </button>
                ))}
            </div>
        </div>
    );
}


"use client";

import { EstimatorExercise } from "@calis/lib/max-rep-estimator";

const options: { id: EstimatorExercise; label: string; hint: string }[] = [
    { id: "pullup", label: "Pull-Up", hint: "BW or weighted" },
    { id: "chinup", label: "Chin-Up", hint: "BW or weighted" },
    { id: "dip", label: "Dip", hint: "BW or weighted" },
    { id: "pushup", label: "Push-Up", hint: "BW, weighted, or deficit" },
    { id: "row", label: "Inverted Row", hint: "bar/rings" },
    { id: "pistol", label: "Pistol Squat", hint: "single-leg strength" },
    { id: "squat", label: "Bodyweight Squat", hint: "endurance baseline" },
];

export default function StepExercise({
                                         value,
                                         onChange,
                                     }: {
    value: EstimatorExercise | "";
    onChange: (v: EstimatorExercise) => void;
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((o) => (
                <button
                    key={o.id}
                    onClick={() => onChange(o.id)}
                    className={[
                        "text-left p-4 rounded-2xl border transition",
                        value === o.id ? "border-purple-500 bg-white/5" : "border-white/10 hover:bg-white/5",
                    ].join(" ")}
                >
                    <div className="font-semibold">{o.label}</div>
                    <div className="text-sm text-gray-400">{o.hint}</div>
                </button>
            ))}
        </div>
    );
}

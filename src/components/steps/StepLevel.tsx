import type { Level } from "../../lib/types";

const LEVELS = [
    { id: "beginner", name: "Beginner", icon: "🌱", desc: "New to calisthenics / coming back" },
    { id: "intermediate", name: "Intermediate", icon: "💪", desc: "10+ push-ups, 5+ pull-ups" },
    { id: "advanced", name: "Advanced", icon: "🔥", desc: "Basics mastered, chasing skills" },
] as const;

export default function StepLevel({ value, onChange }: { value: Level; onChange: (v: Level) => void }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {LEVELS.map((l) => (
                <button
                    key={l.id}
                    onClick={() => onChange(l.id as Level)}
                    className={`group relative p-5 sm:p-7 rounded-2xl border-2 transition text-left ${
                        value === l.id
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-white/10 hover:border-white/20 hover:bg-white/[.04]"
                    }`}
                >
                    <div className="text-3xl sm:text-4xl mb-3">{l.icon}</div>
                    <h3 className="font-bold text-lg sm:text-xl">{l.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">{l.desc}</p>
                    {value === l.id && <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-purple-500 grid place-items-center">✓</div>}
                </button>
            ))}
        </div>
    );
}

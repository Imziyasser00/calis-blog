import type { Goal } from "../../lib/types";

const GOALS = [
    { id: "strength", name: "Strength", icon: "💎", desc: "Build power & muscle" },
    { id: "endurance", name: "Endurance", icon: "⚡", desc: "Increase stamina" },
    { id: "skills", name: "Skills", icon: "🎯", desc: "Unlock advanced moves" },
    { id: "balanced", name: "Balanced", icon: "⚖️", desc: "Well-rounded progress" },
] as const;

export default function StepGoal({ value, onChange }: { value: Goal; onChange: (v: Goal) => void }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {GOALS.map((g) => (
                <button
                    key={g.id}
                    onClick={() => onChange(g.id as Goal)}
                    className={`group relative p-5 sm:p-7 rounded-2xl border-2 transition text-left ${
                        value === g.id
                            ? "border-[#a855f7] bg-[#a855f7]/10 shadow-[0_10px_36px_rgba(168,85,247,.25)]"
                            : "border-white/10 hover:border-white/20 hover:bg-white/[.04]"
                    }`}
                >
                    <div className="text-3xl sm:text-4xl mb-3">{g.icon}</div>
                    <h3 className="font-bold text-lg sm:text-xl">{g.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">{g.desc}</p>
                    {value === g.id && <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#a855f7] grid place-items-center">✓</div>}
                </button>
            ))}
        </div>
    );
}

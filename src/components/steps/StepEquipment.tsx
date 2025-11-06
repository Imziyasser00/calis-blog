const OPTIONS = [
    { id: "pull-up-bar", name: "Pull-up Bar", icon: "🏋️" },
    { id: "rings", name: "Gymnastic Rings", icon: "⭕" },
    { id: "parallel-bars", name: "Parallel Bars", icon: "🔲" },
    { id: "none", name: "No Equipment", icon: "🤸" },
] as const;

export default function StepEquipment({
                                          values,
                                          onToggle,
                                      }: {
    values: string[];
    onToggle: (id: string) => void;
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {OPTIONS.map((eq) => {
                const active = values.includes(eq.id);
                return (
                    <button
                        key={eq.id}
                        onClick={() => onToggle(eq.id)}
                        className={`group relative p-5 sm:p-7 rounded-2xl border-2 transition text-left ${
                            active
                                ? "border-[#a855f7] bg-[#a855f7]/10 shadow-[0_10px_36px_rgba(168,85,247,.25)]"
                                : "border-white/10 hover:border-white/20 hover:bg-white/[.04]"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-3xl sm:text-4xl">{eq.icon}</div>
                            <h3 className="font-bold text-lg sm:text-xl">{eq.name}</h3>
                        </div>
                        {active && <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#a855f7] grid place-items-center">✓</div>}
                    </button>
                );
            })}
        </div>
    );
}

export default function StepDays({ value, onChange }: { value: number; onChange: (n: number) => void }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {[2, 3, 4, 5, 6].map((d) => (
                    <button
                        key={d}
                        onClick={() => onChange(d)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 font-bold text-xl sm:text-2xl transition ${
                            value === d
                                ? "border-purple-500 text-purple-500"
                                : "border-white/10 hover:border-white/20 hover:bg-white/[.04] text-gray-400"
                        }`}
                    >
                        {d}
                    </button>
                ))}
            </div>
            <p className="text-center text-gray-300">
                Training <span className="text-[#22d3ee] font-semibold">{value}</span> days/week
            </p>
        </div>
    );
}

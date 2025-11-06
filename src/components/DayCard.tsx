import { Clock } from "lucide-react";
import Pill from "./ui/Pill";

export default function DayCard({
                                    index,
                                    total,
                                    type,
                                    duration,
                                    exercises,
                                }: {
    index: number;
    total: number;
    type: string;
    duration: string;
    exercises: Array<{ name: string; sets: number; reps: string }>;
}) {
    const day = index + 1;
    return (
        <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f15]/90 to-[#12121a]/90 backdrop-blur-xl">
            <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#22d3ee] to-[#a855f7] flex items-center justify-center text-base sm:text-lg font-bold shadow-[0_8px_28px_rgba(168,85,247,.45)]">
                            {day}
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold">{type}</h3>
                            <p className="text-xs sm:text-sm text-gray-400">Day {day} of {total}</p>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-gray-300 border border-white/10 rounded-lg px-2 py-1">
                        <Clock className="h-3 w-3" /> {duration}
                    </div>
                </div>

                <div className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3">
                    {exercises.map((ex, i) => (
                        <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-black/30 border border-white/5 hover:border-[#22d3ee]/40 transition">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#22d3ee]/25 to-[#a855f7]/25 border border-[#22d3ee]/30 flex items-center justify-center text-xs sm:text-sm font-bold text-[#22d3ee]">
                                {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold truncate">{ex.name}</h4>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                                <Pill tone="purple">{ex.sets} sets</Pill>
                                <Pill tone="cyan">{ex.reps}</Pill>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}

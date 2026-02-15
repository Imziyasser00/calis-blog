"use client";

export default function MaxRepResultHero({
                                             title,
                                             subtitle,
                                             badges,

                                         }: {
    title: string;
    subtitle: string;
    badges?: string[];
}) {
    return (
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f15]/90 to-[#12121a]/90 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(138,92,246,0.12),rgba(255,255,255,0))]" />
            <div className="relative p-6 sm:p-10 space-y-6">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold">Your Results</h2>
                    <p className="text-gray-300">{title}</p>
                    <p className="text-sm text-gray-400">{subtitle}</p>

                    {badges?.length ? (
                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                            {badges.map((b) => (
                                <span key={b} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-gray-200">
                  {b}
                </span>
                            ))}
                        </div>
                    ) : null}
                </div>


            </div>
        </section>
    );
}

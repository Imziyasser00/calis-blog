import Link from "next/link";
import { ArrowRight, Gauge, Wand2 } from "lucide-react";

export function InteractiveToolsSection() {
    return (
        <section className="mb-20" aria-labelledby="interactive-tools">
            <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                    <h2 id="interactive-tools" className="text-2xl font-bold">
                        Interactive Tools
                    </h2>
                    <p className="mt-1 text-sm text-white/60 max-w-2xl">
                        Simple tools that turn your current reps and goals into clear next steps.
                        No login, no fluff — just numbers you can use.
                    </p>
                </div>

                <Link
                    href="/tools"
                    className="text-sm text-purple-400 hover:text-purple-300 transition rounded-md px-2 py-1"
                >
                    Browse all tools
                </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                {/* Max Rep Estimator */}
                <Link
                    href="/tools/max-rep-estimator"
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] p-6 transition hover:border-purple-500/40"
                >
                    {/* glow */}
                    <div className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition duration-700">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.25),transparent_60%)]" />
                    </div>

                    {/* top gradient line */}
                    <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-purple-500/0 via-purple-500/60 to-purple-500/0 opacity-0 group-hover:opacity-100 transition" />

                    <div className="relative flex items-start justify-between">
                        <div className="inline-flex items-center gap-2 text-xs text-purple-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                            Live • Takes ~60s
                        </div>

                        <div className="rounded-xl bg-purple-500/10 p-2 ring-1 ring-purple-500/20">
                            <Gauge className="h-4 w-4 text-purple-300" />
                        </div>
                    </div>

                    <h3 className="mt-4 text-xl font-semibold group-hover:text-purple-300 transition-colors">
                        Max Rep Estimator
                    </h3>

                    <p className="mt-2 text-sm text-white/65">
                        Plug in your best sets and get a realistic strength level plus a direction to progress
                        without ego lifting.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/70 group-hover:text-white transition">
                        Check my level
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                </Link>

                {/* Workout Generator */}
                <Link
                    href="/tools/workout-generator"
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] p-6 transition hover:border-fuchsia-500/40"
                >
                    {/* glow */}
                    <div className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition duration-700">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.25),transparent_60%)]" />
                    </div>

                    {/* top gradient line */}
                    <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/60 to-fuchsia-500/0 opacity-0 group-hover:opacity-100 transition" />

                    <div className="relative flex items-start justify-between">
                        <div className="inline-flex items-center gap-2 text-xs text-purple-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                            Live • Takes ~90s
                        </div>

                        <div className="rounded-xl bg-fuchsia-500/10 p-2 ring-1 ring-fuchsia-500/20">
                            <Wand2 className="h-4 w-4 text-fuchsia-300" />
                        </div>
                    </div>

                    <h3 className="mt-4 text-xl font-semibold group-hover:text-fuchsia-300 transition-colors">
                        Workout Generator
                    </h3>

                    <p className="mt-2 text-sm text-white/65">
                        Choose your goal, days per week, and equipment, then get a simple routine you can actually
                        stick to.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/70 group-hover:text-white transition">
                        Generate my routine
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                </Link>
            </div>
        </section>
    );
}

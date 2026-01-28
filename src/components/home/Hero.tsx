import Link from "next/link";
import { ArrowRight, BicepsFlexed, Sparkles, Gauge, ClipboardList, Activity } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* background aesthetics */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30 bg-purple-600/40" />
                <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30 bg-fuchsia-500/30" />
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(168,85,247,0.12),transparent_60%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.65))]" />
            </div>

            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
                {/* Left */}
                <div className="space-y-7">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        Beginner-friendly tools & guides, updated weekly
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
              Start Calisthenics
            </span>{" "}
                        Without Feeling Lost
                    </h1>

                    <p className="text-base md:text-lg text-white/70 max-w-xl">
                        Get your first real pull-up and a consistent routine with simple workouts, step-by-step progressions,
                        and friendly tools that tell you exactly what to do next.
                    </p>

                    {/* Primary actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/beginner-calisthenics"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        >
                            <Sparkles className="h-4 w-4" />
                            I’m New – Start Here
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <Link
                            href="/tools"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        >
                            <BicepsFlexed className="h-4 w-4" />
                            I Already Train – Use Tools
                        </Link>
                    </div>

                    {/* Lead magnet */}
                    <div className="flex gap-2 items-center">
                        🎁
                        <p className="text-sm md:text-base text-white/60 max-w-md">
                            Get the{" "}
                            <span className="font-semibold text-white">Beginner Strength Passport</span>: 3-day starter plan, pull-up
                            roadmap, and habit checklist.
                            <Link
                                href="#newsletter"
                                className="ml-1 underline underline-offset-2 text-purple-400 font-bold decoration-purple-400 hover:text-white"
                            >
                                Send it to my email
                            </Link>
                            .
                        </p>
                    </div>

                    {/* Quick links */}
                    <nav aria-label="Popular tools" className="flex flex-wrap items-center gap-2 pt-1 text-sm text-white/60">
                        <span className="mr-1">Popular:</span>

                        <Link
                            href="/tools/max-rep-estimator"
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10 transition"
                        >
                            Max Rep Estimator <span className="sr-only">(calisthenics strength level)</span>
                        </Link>

                        <Link
                            href="/tools/workout-generator"
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10 transition"
                        >
                            Workout Generator <span className="sr-only">(routine in minutes)</span>
                        </Link>
                    </nav>

                    {/* Trust signals */}
                    <div className="flex flex-wrap gap-6 pt-2 text-sm">
                        <div className="flex items-center gap-2 text-white/70">
                            <span className="font-semibold text-white">Beginner → Intermediate</span> paths you can follow
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                            <span className="font-semibold text-white">Pull-up focused</span> progressions & drills
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                            <span className="font-semibold text-white">No-equipment</span> options included
                        </div>
                    </div>
                </div>

                {/* Right: Tool Preview panel */}
                <div className="relative">
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] p-6 shadow-2xl backdrop-blur transition">
                        <div className="pointer-events-none absolute -inset-24 opacity-80">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(168,85,247,0.22),transparent_55%)]" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.18),transparent_55%)]" />
                        </div>

                        <div className="pointer-events-none absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-fuchsia-500/0 opacity-70" />

                        <div className="relative">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/50">Start in 60 seconds</p>
                                    <h2 className="mt-2 text-xl md:text-2xl font-semibold">Pick a tool and get your next step</h2>
                                    <p className="mt-2 text-sm text-white/70">
                                        Use your current reps to get a realistic starting level, then choose the progression path that fits
                                        your goal.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3">
                                <Link
                                    href="/tools/pull-up-diagnostic"
                                    className="group/item relative overflow-hidden flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-cyan-500/40 hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                                >
                                    <div className="pointer-events-none absolute -inset-16 opacity-0 group-hover/item:opacity-100 transition duration-700">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.20),transparent_60%)]" />
                                    </div>

                                    <div className="relative flex items-center gap-3">
                                        <div className="rounded-xl bg-cyan-500/10 p-2 ring-1 ring-cyan-500/20">
                                            <Activity className="h-4 w-4 text-cyan-200" />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium">Pull-Up Diagnostic</p>
                                                <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-200">
                          NEW
                        </span>
                                            </div>
                                            <p className="text-xs text-white/60">Find your bottleneck and the best next drill</p>
                                        </div>
                                    </div>

                                    <ArrowRight className="relative h-4 w-4 text-white/60 transition group-hover/item:translate-x-0.5 group-hover/item:text-white/80" />
                                </Link>

                                <Link
                                    href="/tools/max-rep-estimator"
                                    className="group/item relative overflow-hidden flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-purple-500/40 hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                >
                                    <div className="pointer-events-none absolute -inset-16 opacity-0 group-hover/item:opacity-100 transition duration-700">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(168,85,247,0.22),transparent_60%)]" />
                                    </div>

                                    <div className="relative flex items-center gap-3">
                                        <div className="rounded-xl bg-purple-500/10 p-2 ring-1 ring-purple-500/20">
                                            <Gauge className="h-4 w-4 text-purple-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Max Rep Estimator</p>
                                            <p className="text-xs text-white/60">Know your current level in seconds</p>
                                        </div>
                                    </div>

                                    <ArrowRight className="relative h-4 w-4 text-white/60 transition group-hover/item:translate-x-0.5 group-hover/item:text-white/80" />
                                </Link>

                                <Link
                                    href="/tools/workout-generator"
                                    className="group/item relative overflow-hidden flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-fuchsia-500/40 hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                                >
                                    <div className="pointer-events-none absolute -inset-16 opacity-0 group-hover/item:opacity-100 transition duration-700">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(236,72,153,0.20),transparent_60%)]" />
                                    </div>

                                    <div className="relative flex items-center gap-3">
                                        <div className="rounded-xl bg-fuchsia-500/10 p-2 ring-1 ring-fuchsia-500/20">
                                            <ClipboardList className="h-4 w-4 text-fuchsia-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Workout Generator</p>
                                            <p className="text-xs text-white/60">Get a simple routine you can stick to</p>
                                        </div>
                                    </div>

                                    <ArrowRight className="relative h-4 w-4 text-white/60 transition group-hover/item:translate-x-0.5 group-hover/item:text-white/80" />
                                </Link>
                            </div>

                            <div className="mt-5 flex items-center justify-between text-xs text-white/50">
                                <span>No login needed to try the tools</span>
                                <span className="rounded-full text-green-500 font-bold border border-white/10 bg-white/5 px-2 py-1">
                  Free
                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-purple-600/10 blur-2xl"
                    />
                </div>
            </div>
        </section>
    );
}

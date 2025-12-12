import Link from "next/link";
import { ArrowRight, Sparkles, ClipboardList, Dumbbell, GraduationCap } from "lucide-react";

export function StartHereSection() {
    return (
        <section className="mb-20" aria-labelledby="start-here">
            <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                    <h2 id="start-here" className="text-2xl font-bold">
                        Start Here (Beginner-Friendly)
                    </h2>
                    <p className="mt-1 text-sm text-white/60 max-w-2xl">
                        New to calisthenics? Follow a simple path: assess your level, pick a routine, learn the basics, then progress.
                    </p>
                </div>

                <Link
                    href="/blog/how-to-build-a-beginner-friendly-calisthenics-routine-step-by-step-guide"
                    className="text-sm text-purple-400 hover:text-purple-300 transition rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                    Read the full Beginner Guide
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <Link
                    href="/tools/max-rep-estimator"
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] p-6 transition hover:border-purple-500/40"
                >
                    <div className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition duration-700">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.22),transparent_60%)]" />
                    </div>

                    <div className="relative flex items-start justify-between gap-4">
                        <div className="inline-flex items-center gap-2 text-xs text-purple-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                            Step 1
                        </div>
                        <div className="rounded-xl bg-purple-500/10 p-2 ring-1 ring-purple-500/20">
                            <Sparkles className="h-4 w-4 text-purple-300" />
                        </div>
                    </div>

                    <h3 className="relative mt-4 text-lg font-semibold group-hover:text-purple-300 transition-colors">
                        Test your level
                    </h3>
                    <p className="relative mt-2 text-sm text-white/65">
                        Use your reps to estimate your current strength and get a progression direction.
                    </p>

                    <div className="relative mt-4 inline-flex items-center gap-2 text-sm text-white/70 group-hover:text-white transition">
                        Take the test <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                </Link>

                {/* Step 2 */}
                <Link
                    href="/tools/workout-generator"
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] p-6 transition hover:border-fuchsia-500/40"
                >
                    <div className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition duration-700">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.20),transparent_60%)]" />
                    </div>

                    <div className="relative flex items-start justify-between gap-4">
                        <div className="inline-flex items-center gap-2 text-xs text-fuchsia-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
                            Step 2
                        </div>
                        <div className="rounded-xl bg-fuchsia-500/10 p-2 ring-1 ring-fuchsia-500/20">
                            <ClipboardList className="h-4 w-4 text-fuchsia-300" />
                        </div>
                    </div>

                    <h3 className="relative mt-4 text-lg font-semibold group-hover:text-fuchsia-300 transition-colors">
                        Get a routine
                    </h3>
                    <p className="relative mt-2 text-sm text-white/65">
                        Generate a workout based on your goal, time, and level (strength, skills, fat loss).
                    </p>

                    <div className="relative mt-4 inline-flex items-center gap-2 text-sm text-white/70 group-hover:text-white transition">
                        Generate workout <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                </Link>

                {/* Step 3 */}
                <Link
                    href="/topics"
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] p-6 transition hover:border-white/20"
                >
                    <div className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition duration-700">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_60%)]" />
                    </div>

                    <div className="relative flex items-start justify-between gap-4">
                        <div className="inline-flex items-center gap-2 text-xs text-white/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                            Step 3
                        </div>
                        <div className="rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
                            <GraduationCap className="h-4 w-4 text-white/80" />
                        </div>
                    </div>

                    <h3 className="relative mt-4 text-lg font-semibold group-hover:text-white transition-colors">
                        Learn progressions
                    </h3>
                    <p className="relative mt-2 text-sm text-white/65">
                        Explore skill progressions, exercise form cues, and training principles to improve safely.
                    </p>

                    <div className="relative mt-4 inline-flex items-center gap-2 text-sm text-white/70 group-hover:text-white transition">
                        Browse topics <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                </Link>
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-purple-500/10 p-2 ring-1 ring-purple-500/20">
                        <Dumbbell className="h-4 w-4 text-purple-300" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Not sure where to start?</p>
                        <p className="text-sm text-white/60">
                            Follow the beginner guide and get a simple routine you can repeat weekly.
                        </p>
                    </div>
                </div>

                <Link
                    href="/blog/how-to-build-a-beginner-friendly-calisthenics-routine-step-by-step-guide"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                    Start the Beginner Guide
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </section>
    );
}

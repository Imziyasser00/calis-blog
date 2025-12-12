import Link from "next/link";
import { ArrowRight, Sparkles, Gauge, ClipboardCheck, ShieldCheck } from "lucide-react";

export function StartHereSection() {
    return (
        <section className="mb-20" aria-labelledby="start-here">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10]">
                {/* background glow */}
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-20 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25 bg-purple-600/40" />
                    <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-20 bg-fuchsia-500/30" />
                    <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(168,85,247,0.12),transparent_60%)]" />
                </div>

                <div className="relative p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        {/* Left */}
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                                <Sparkles className="h-3.5 w-3.5 text-purple-300" />
                                Start Here
                            </div>

                            <h2 id="start-here" className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">
                                New to calisthenics? Follow a clear roadmap.
                            </h2>

                            <p className="mt-2 text-white/60">
                                Stop guessing. Use a beginner-friendly path that tells you what to train, how often, and how to progress
                                without wrecking your joints.
                            </p>

                            {/* mini trust points */}
                            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <ShieldCheck className="h-4 w-4 text-purple-300" />
                  joint-friendly progressions
                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <ClipboardCheck className="h-4 w-4 text-purple-300" />
                  weekly plan included
                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <Gauge className="h-4 w-4 text-purple-300" />
                  track your level
                </span>
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/beginner-calisthenics"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                >
                                    Open Beginner Hub
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <Link
                                    href="/tools/max-rep-estimator"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                >
                                    Check your level
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Right: “3 steps” card */}
                        <div className="w-full lg:max-w-sm">
                            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur">
                                <p className="text-xs uppercase tracking-wider text-white/50">How it works</p>

                                <div className="mt-4 space-y-3 text-sm">
                                    <Step n="1" title="Pick your level" desc="Use regressions you can do cleanly." />
                                    <Step n="2" title="Train 3x/week" desc="Simple plan, repeat weekly, progress slowly." />
                                    <Step n="3" title="Upgrade when ready" desc="More reps → harder variation → skill work." />
                                </div>

                                <div className="mt-5 text-xs text-white/45">
                                    Tip: stop <span className="text-white/70">1–2 reps before failure</span> to keep form clean.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
    return (
        <div className="flex gap-3">
            <div className="h-6 w-6 shrink-0 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-200 flex items-center justify-center text-xs">
                {n}
            </div>
            <div>
                <div className="font-medium text-white/90">{title}</div>
                <div className="text-white/60">{desc}</div>
            </div>
        </div>
    );
}

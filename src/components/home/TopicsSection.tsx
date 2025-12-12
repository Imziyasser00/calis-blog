import Link from "next/link";
import { ArrowRight, Sparkles, Dumbbell, Flame, Apple, Brain, Swords } from "lucide-react";

const TOPICS = [
    {
        title: "Beginner’s Guide",
        desc: "Start with the basics: form, routine, and progress.",
        href: "/topics/beginners-guide",
        icon: Sparkles,
        glow: "from-purple-500/25 via-fuchsia-500/10 to-transparent",
        borderHover: "hover:border-purple-500/40",
    },
    {
        title: "Exercises & Progressions",
        desc: "Step-by-step progressions for core movements.",
        href: "/topics/exercises-progressions",
        icon: Dumbbell,
        glow: "from-purple-500/20 via-indigo-500/10 to-transparent",
        borderHover: "hover:border-purple-500/30",
    },
    {
        title: "Skills & Moves",
        desc: "Handstand, muscle-up, L-sit, and more.",
        href: "/topics/skills-moves",
        icon: Swords,
        glow: "from-fuchsia-500/20 via-purple-500/10 to-transparent",
        borderHover: "hover:border-fuchsia-500/35",
    },
    {
        title: "Strength & Conditioning",
        desc: "Build power, endurance, and athletic capacity.",
        href: "/topics/strength-conditioning",
        icon: Flame,
        glow: "from-orange-500/15 via-fuchsia-500/10 to-transparent",
        borderHover: "hover:border-white/20",
    },
    {
        title: "Nutrition & Recovery",
        desc: "Protein, sleep, and recovery habits that work.",
        href: "/topics/nutrition-recovery",
        icon: Apple,
        glow: "from-emerald-500/15 via-purple-500/10 to-transparent",
        borderHover: "hover:border-white/20",
    },
    {
        title: "Mindset & Motivation",
        desc: "Consistency, discipline, and training psychology.",
        href: "/topics/mindset-motivation",
        icon: Brain,
        glow: "from-cyan-500/12 via-purple-500/10 to-transparent",
        borderHover: "hover:border-white/20",
    },
];

export function TopicsTilesSection() {
    return (
        <section className="mb-20" aria-labelledby="topics">
            <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                    <h2 id="topics" className="text-2xl font-bold">
                        Calisthenics Topics & Training Guides
                    </h2>
                    <p className="mt-1 text-sm text-white/60 max-w-2xl">
                        Pick a lane. Each topic is a guided path with tutorials, progressions, and practical cues.
                    </p>
                </div>

                <Link
                    href="/topics"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                    View all topics <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {TOPICS.map((t) => {
                    const Icon = t.icon;
                    return (
                        <Link
                            key={t.title}
                            href={t.href}
                            className={[
                                "group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] p-5 transition",
                                t.borderHover,
                            ].join(" ")}
                        >
                            {/* glow */}
                            <div className="pointer-events-none absolute -inset-24 opacity-70">
                                <div className={`absolute inset-0 bg-gradient-to-br ${t.glow}`} />
                            </div>

                            <div className="relative flex items-start justify-between gap-4">
                                <div className="rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
                                    <Icon className="h-4 w-4 text-white/80 group-hover:text-white transition" />
                                </div>

                                <ArrowRight className="h-4 w-4 text-white/40 transition group-hover:text-white/80 group-hover:translate-x-0.5" />
                            </div>

                            <h3 className="relative mt-4 text-lg font-semibold">
                                {t.title}
                            </h3>

                            <p className="relative mt-2 text-sm text-white/65">
                                {t.desc}
                            </p>

                            <div className="relative mt-4 text-xs text-white/50">
                                Explore guides →
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

import Link from "next/link";
import { ArrowRight, Gauge, Wand2, Activity, Sparkles, TrendingUp } from "lucide-react";

type ToolCard = {
    href: string;
    aria: string;
    eyebrow: string;
    title: string;
    desc: string;
    cta: string;
    Icon: React.ComponentType<{ className?: string }>;
    theme: {
        ring: string;
        hoverBorder: string;
        focusRing: string;
        dot: string;
        iconWrap: string;
        icon: string;
        hoverText: string;
        topLine: string;
        glow: string; // radial gradient
        badge?: {
            text: string;
            border: string;
            bg: string;
            textColor: string;
        };
    };
};

const TOOLS: ToolCard[] = [
    {
        href: "/tools/future-self",
        aria: "Open Future Self Simulator tool",
        eyebrow: "Live • Takes ~30s",
        title: "Future Self Simulator",
        desc: "Project your push-up max in 3, 6, or 12 months. Inspect the curve and download a clean chart.",
        cta: "Simulate my progress",
        Icon: TrendingUp,
        theme: {
            ring: "ring-emerald-500/20",
            hoverBorder: "hover:border-emerald-500/40",
            focusRing: "focus-visible:ring-emerald-500",
            dot: "bg-emerald-400",
            iconWrap: "bg-emerald-500/10",
            icon: "text-emerald-200",
            hoverText: "group-hover:text-emerald-200",
            topLine: "from-emerald-500/0 via-emerald-500/60 to-emerald-500/0",
            glow: "bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.22),transparent_60%)]",
        },
    },
    {
        href: "/tools/pull-up-diagnostic",
        aria: "Open Pull-Up Diagnostic tool",
        eyebrow: "Live • Takes ~45s",
        title: "Pull-Up Diagnostic",
        desc: "Find your bottleneck (grip, lats, start, top range) and get the next best drill to fix it.",
        cta: "Diagnose my pull-up",
        Icon: Activity,
        theme: {
            ring: "ring-cyan-500/20",
            hoverBorder: "hover:border-cyan-500/40",
            focusRing: "focus-visible:ring-cyan-500",
            dot: "bg-cyan-400",
            iconWrap: "bg-cyan-500/10",
            icon: "text-cyan-200",
            hoverText: "group-hover:text-cyan-200",
            topLine: "from-cyan-500/0 via-cyan-500/60 to-cyan-500/0",
            glow: "bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.25),transparent_60%)]",
            badge: {
                text: "New",
                border: "border-cyan-500/30",
                bg: "bg-cyan-500/10",
                textColor: "text-cyan-200",
            },
        },
    },
    {
        href: "/tools/max-rep-estimator",
        aria: "Open Max Rep Estimator tool",
        eyebrow: "Live • Takes ~60s",
        title: "Max Rep Estimator",
        desc: "Plug in your best sets and get a realistic strength level plus a direction to progress without ego lifting.",
        cta: "Check my level",
        Icon: Gauge,
        theme: {
            ring: "ring-purple-500/20",
            hoverBorder: "hover:border-purple-500/40",
            focusRing: "focus-visible:ring-purple-500",
            dot: "bg-purple-500",
            iconWrap: "bg-purple-500/10",
            icon: "text-purple-300",
            hoverText: "group-hover:text-purple-300",
            topLine: "from-purple-500/0 via-purple-500/60 to-purple-500/0",
            glow: "bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.25),transparent_60%)]",
        },
    },
    {
        href: "/tools/workout-generator",
        aria: "Open Workout Generator tool",
        eyebrow: "Live • Takes ~90s",
        title: "Workout Generator",
        desc: "Choose your goal, days per week, and equipment, then get a simple routine you can actually stick to.",
        cta: "Generate my routine",
        Icon: Wand2,
        theme: {
            ring: "ring-fuchsia-500/20",
            hoverBorder: "hover:border-fuchsia-500/40",
            focusRing: "focus-visible:ring-fuchsia-500",
            dot: "bg-purple-500",
            iconWrap: "bg-fuchsia-500/10",
            icon: "text-fuchsia-300",
            hoverText: "group-hover:text-fuchsia-300",
            topLine: "from-fuchsia-500/0 via-fuchsia-500/60 to-fuchsia-500/0",
            glow: "bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.25),transparent_60%)]",
        },
    },
];

export function InteractiveToolsSection() {
    return (
        <section className="mb-20" aria-labelledby="interactive-tools">
            <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                    <h2 id="interactive-tools" className="text-2xl font-bold">
                        Interactive Tools
                    </h2>
                    <p className="mt-1 text-sm text-white/60 max-w-2xl">
                        Simple tools that turn your current reps and goals into clear next steps. No login, no fluff, just numbers you can use.
                    </p>
                </div>

                <Link href="/tools" className="text-sm text-purple-400 hover:text-purple-300 transition rounded-md px-2 py-1">
                    Browse all tools
                </Link>
            </div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.map((t) => (
                    <li key={t.href}>
                        <Link
                            href={t.href}
                            aria-label={t.aria}
                            className={[
                                "group block relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] p-6 transition",
                                t.theme.hoverBorder,
                                "focus-visible:outline-none focus-visible:ring-2",
                                t.theme.focusRing,
                            ].join(" ")}
                        >
                            {/* ✅ Hover glow only where hover exists (reduces mobile paint work) */}
                            <div
                                className={[
                                    "pointer-events-none absolute -inset-20 opacity-0 transition duration-700",
                                    "supports-[hover:hover]:group-hover:opacity-100",
                                ].join(" ")}
                            >
                                <div className={["absolute inset-0", t.theme.glow].join(" ")} />
                            </div>

                            {/* ✅ Top line only on hover-capable devices */}
                            <div
                                className={[
                                    "absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r opacity-0 transition",
                                    t.theme.topLine,
                                    "supports-[hover:hover]:group-hover:opacity-100",
                                ].join(" ")}
                            />

                            <div className="relative flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={["inline-flex items-center gap-2 text-xs", t.theme.icon].join(" ")}>
                                        <span className={["h-1.5 w-1.5 rounded-full", t.theme.dot].join(" ")} />
                                        {t.eyebrow}
                                    </div>

                                    {t.theme.badge && (
                                        <span
                                            className={[
                                                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]",
                                                t.theme.badge.border,
                                                t.theme.badge.bg,
                                                t.theme.badge.textColor,
                                            ].join(" ")}
                                        >
                      <Sparkles className="h-3 w-3" />
                                            {t.theme.badge.text}
                    </span>
                                    )}
                                </div>

                                <div className={["rounded-xl p-2 ring-1", t.theme.iconWrap, t.theme.ring].join(" ")}>
                                    <t.Icon className={["h-4 w-4", t.theme.icon].join(" ")} />
                                </div>
                            </div>

                            <h3 className={["mt-4 text-xl font-semibold transition-colors", t.theme.hoverText].join(" ")}>
                                {t.title}
                            </h3>

                            <p className="mt-2 text-sm text-white/65">{t.desc}</p>

                            <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/70 group-hover:text-white transition">
                                {t.cta}
                                <ArrowRight className="h-4 w-4 transition supports-[hover:hover]:group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

import "server-only";
import Link from "next/link";
import Image from "next/image";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import type { Metadata } from "next";
import {
    Activity,
    Timer,
    Shield,
    Apple,
    Award,
    Zap,
    Users,
    Rocket,
    PenTool,
} from "lucide-react";
import Script from "next/script";

export const revalidate = 60;

const SITE_URL = "https://www.calishub.com";

/* ------------------------- METADATA ------------------------- */
export const metadata: Metadata = {
    title: {
        default: "About · CalisHub",
        template: "%s · CalisHub",
    },
    description:
        "CalisHub helps you learn calisthenics the smart way with clear progressions, workouts, mobility, and realistic programs from beginner to advanced.",
    alternates: {
        canonical: `${SITE_URL}/about`,
    },
    openGraph: {
        type: "website",
        url: `${SITE_URL}/about`,
        siteName: "CalisHub",
        title: "About · CalisHub",
        description:
            "CalisHub is your home for smart calisthenics: progressions, technique cues, workouts, mobility, and sustainable programs.",
        images: [
            {
                url: `${SITE_URL}/og/about.png`,
                width: 1200,
                height: 630,
                alt: "About CalisHub",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "About · CalisHub",
        description:
            "Learn what CalisHub is about: realistic calisthenics training, from beginner to advanced.",
        images: [`${SITE_URL}/og/about.png`],
    },
    robots: {
        index: true,
        follow: true,
    },
    category: "About",
    keywords: [
        "calisthenics",
        "bodyweight training",
        "calisthenics progressions",
        "home workouts",
        "strength training",
    ],
};

/* --------------------------- PAGE --------------------------- */
export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="container mx-auto px-4 py-12">
                {/* Intro */}
                <section className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm text-purple-400">
            <Rocket className="h-4 w-4" />
            About
          </span>

                    <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                        CalisHub: learn calisthenics the smart way.
                    </h1>

                    <p className="mt-4 text-white/60">
                        We publish practical guides, progressions, and honest workout advice
                        so you can build real strength, mobility, and skills without fancy
                        equipment.
                    </p>
                </section>

                {/* Mission / Style / Audience */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <InfoCard title="Our Mission" icon={<Rocket className="h-5 w-5" />}>
                        Make calisthenics accessible and sustainable, from your first push-up
                        to advanced skills.
                    </InfoCard>

                    <InfoCard title="How We Teach" icon={<PenTool className="h-5 w-5" />}>
                        Clear explanations, visual cues, and step-by-step progressions backed
                        by real training experience.
                    </InfoCard>

                    <InfoCard title="Who It’s For" icon={<Users className="h-5 w-5" />}>
                        Beginners, returning athletes, and intermediates chasing skills like
                        L-sit, handstand, and front lever.
                    </InfoCard>
                </section>

                {/* What we cover */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">What we cover</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        <TopicPill
                            icon={<Activity className="h-5 w-5" />}
                            title="Progressions & Skills"
                            desc="Structured steps from basics to advanced movements."
                        />
                        <TopicPill
                            icon={<Timer className="h-5 w-5" />}
                            title="Programs & Workouts"
                            desc="Weekly splits, deloads, and routines that fit real life."
                        />
                        <TopicPill
                            icon={<Shield className="h-5 w-5" />}
                            title="Technique & Injury Prevention"
                            desc="Form cues, mobility, and prehab for joints and tendons."
                        />
                        <TopicPill
                            icon={<Apple className="h-5 w-5" />}
                            title="Nutrition & Recovery"
                            desc="Protein basics, supplements, sleep, and recovery habits."
                        />
                        <TopicPill
                            icon={<Award className="h-5 w-5" />}
                            title="Beginner to Advanced"
                            desc="Start simple and progress safely toward harder skills."
                        />
                        <TopicPill
                            icon={<Zap className="h-5 w-5" />}
                            title="Minimal Gear"
                            desc="Bars, rings, and equipment you actually need."
                        />
                    </div>
                </section>

                {/* Team */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Who’s behind CalisHub?</h2>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-1 ring-purple-500/40 shrink-0">
                                <Image
                                    src="/logo.png"
                                    alt="CalisHub"
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-semibold">The CalisHub Team</h3>
                                <p className="text-white/60 mt-1">
                                    Calisthenics nerds and everyday athletes. We test what we write
                                    and keep everything realistic.
                                </p>

                                <div className="flex flex-wrap gap-3 mt-4 text-sm">
                                    <Link
                                        href="/blog"
                                        className="rounded-lg border border-purple-500 px-3 py-1.5 text-purple-400 hover:bg-purple-500/10"
                                    >
                                        Read the blog →
                                    </Link>
                                    <Link
                                        href="/topics"
                                        className="rounded-lg border border-white/10 px-3 py-1.5 text-white/70 hover:border-purple-500/50 hover:text-white"
                                    >
                                        Browse topics
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section>
                    <div className="rounded-2xl border border-purple-500/40 bg-purple-500/5 p-6 md:p-8 text-center">
                        <h3 className="text-xl md:text-2xl font-semibold">
                            Get new workouts & guides
                        </h3>
                        <p className="text-white/60 mt-2">
                            No spam. Just actionable calisthenics content.
                        </p>

                        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/#newsletter"
                                className="rounded-lg border border-purple-500 px-4 py-2 text-purple-400 hover:bg-purple-500/10"
                            >
                                Subscribe
                            </Link>
                            <Link
                                href="/blog"
                                className="rounded-lg border border-white/10 px-4 py-2 text-white/70 hover:border-purple-500/50 hover:text-white"
                            >
                                Read latest articles
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* JSON-LD */}
            <Script id="ld-about" type="application/ld+json" strategy="beforeInteractive">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "AboutPage",
                    name: "About CalisHub",
                    url: `${SITE_URL}/about`,
                    description:
                        "CalisHub helps people learn calisthenics with realistic progressions, workouts, and technique guidance.",
                    publisher: {
                        "@type": "Organization",
                        name: "CalisHub",
                        url: SITE_URL,
                        logo: {
                            "@type": "ImageObject",
                            url: `${SITE_URL}/logo.png`,
                        },
                        sameAs: ["https://www.tiktok.com/@calishub.com"],
                    },
                })}
            </Script>
        </div>
    );
}

/* ----------------- small components ----------------- */

function InfoCard({
                      title,
                      icon,
                      children,
                  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-full">
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
                    {icon}
                </div>
                <h3 className="font-semibold">{title}</h3>
            </div>
            <p className="text-white/60 mt-3">{children}</p>
        </div>
    );
}

function TopicPill({
                       icon,
                       title,
                       desc,
                   }: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-purple-500/40 transition">
            <div className="flex items-center gap-2 text-purple-400">
                {icon}
                <h3 className="font-medium">{title}</h3>
            </div>
            <p className="text-white/60 mt-2 text-sm">{desc}</p>
        </div>
    );
}

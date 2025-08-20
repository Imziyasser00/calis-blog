import "server-only"
import Link from "next/link"
import Image from "next/image"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"
import type { Metadata } from "next"
import { Activity, Timer, Shield, Apple, Award, Zap, Users, Rocket, PenTool } from "lucide-react"

export const revalidate = 60

export const metadata: Metadata = {
    title: "About — CalisHub",
    description:
        "CalisHub is your home for smart calisthenics: progressions, technique cues, workouts, mobility, and realistic programs—from absolute beginner to advanced.",
    openGraph: {
        title: "About — CalisHub",
        description:
            "CalisHub is your home for smart calisthenics: progressions, technique cues, workouts, mobility, and realistic programs—from absolute beginner to advanced.",
    },
    alternates: {
        canonical: "/about",
    },
}

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
                    <p className="mt-4 text-gray-400">
                        We publish practical guides, progressions, and honest workout advice so you can build real strength,
                        mobility, and skills—without fancy equipment. Clear steps, clean form, realistic programs.
                    </p>
                </section>

                {/* Mission / Style / Audience */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <InfoCard title="Our Mission" icon={<Rocket className="h-5 w-5" />}>
                        Make calisthenics accessible and sustainable—from your first push-up to your first muscle-up.
                    </InfoCard>
                    <InfoCard title="How We Teach" icon={<PenTool className="h-5 w-5" />}>
                        Short, clear explanations, visual cues, and step-by-step progressions backed by experience.
                    </InfoCard>
                    <InfoCard title="Who It’s For" icon={<Users className="h-5 w-5" />}>
                        Absolute beginners, returning athletes, and intermediates chasing skills like L-sit, HS, and front lever.
                    </InfoCard>
                </section>

                {/* What we cover */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">What we cover</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        <TopicPill icon={<Activity className="h-5 w-5" />} title="Progressions & Skills" desc="Push-ups to planche: structured steps with standards and common fixes." />
                        <TopicPill icon={<Timer className="h-5 w-5" />} title="Programs & Workouts" desc="Evidence-based templates, deloads, and weekly splits for real life." />
                        <TopicPill icon={<Shield className="h-5 w-5" />} title="Technique & Injury-proofing" desc="Form cues, mobility flows, and prehab for shoulders, wrists, elbows." />
                        <TopicPill icon={<Apple className="h-5 w-5" />} title="Nutrition & Recovery" desc="Protein basics, creatine, sleep, and fueling for bodyweight strength." />
                        <TopicPill icon={<Award className="h-5 w-5" />} title="Beginner to Advanced" desc="From your first pull-up to solid handstands and beyond." />
                        <TopicPill icon={<Zap className="h-5 w-5" />} title="Gear & Minimal Setup" desc="Bars, rings, and budget picks you actually need (and what you don’t)." />
                    </div>
                </section>

                {/* Author / team */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Who’s behind CalisHub?</h2>
                    <div className="rounded-2xl border border-gray-800 p-6 md:p-8 bg-gradient-to-b from-gray-900/40 to-transparent">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-1 ring-purple-500/40 shrink-0">
                                <Image
                                    src="/logo.png" // replace with your image or remove block
                                    alt="CalisHub"
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold">The CalisHub Team</h3>
                                <p className="text-gray-400 mt-1">
                                    calisthenics nerds, and everyday athletes. We test what we write and keep it realistic.
                                </p>
                                <div className="flex flex-wrap gap-3 mt-4 text-sm">
                                    <Link href="/blog" className="rounded-lg border border-purple-500 px-3 py-1.5 text-purple-400 hover:bg-purple-950/50">
                                        Read the blog →
                                    </Link>
                                    <Link href="/topics" className="rounded-lg border border-gray-800 px-3 py-1.5 text-gray-300 hover:border-purple-500/60 hover:text-white">
                                        Browse topics
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Milestones</h2>
                    <div className="space-y-5">
                        <Milestone date="2024" title="The idea">
                            We started drafting simple, no-BS guides for friends who wanted to get stronger at home.
                        </Milestone>
                        <Milestone date="2025" title="CalisHub v1">
                            Launched the blog with beginner progressions, weekly plans, and mobility routines.
                        </Milestone>
                        <Milestone date="Soon" title="Skills library & tools">
                            A searchable exercise library, printable plans, and ring/bar skills roadmaps.
                        </Milestone>
                    </div>
                </section>

                {/* CTA */}
                <section className="mb-4">
                    <div className="rounded-2xl border border-purple-500/40 p-6 md:p-8 text-center bg-purple-500/5">
                        <h3 className="text-xl md:text-2xl font-semibold">Get new workouts & guides</h3>
                        <p className="text-gray-400 mt-2">
                            No spam—just actionable progressions and realistic programs.
                        </p>
                        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/#newsletter"
                                className="inline-flex items-center justify-center rounded-lg border border-purple-500 px-4 py-2 text-purple-400 hover:bg-purple-950/50"
                            >
                                Subscribe
                            </Link>
                            <Link
                                href="/blog"
                                className="inline-flex items-center justify-center rounded-lg border border-gray-800 px-4 py-2 text-gray-300 hover:border-purple-500/60 hover:text-white"
                            >
                                Read latest articles
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

/* ----------------- small components ----------------- */

function InfoCard({
                      title,
                      icon,
                      children,
                  }: {
    title: string
    icon: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div className="rounded-2xl border border-gray-800 p-6 h-full bg-gray-900/40">
            <div className="flex items-center gap-3">
                <div className="bg-purple-500/10 p-2 rounded-lg text-purple-500">{icon}</div>
                <h3 className="font-semibold">{title}</h3>
            </div>
            <p className="text-gray-400 mt-3">{children}</p>
        </div>
    )
}

function TopicPill({
                       icon,
                       title,
                       desc,
                   }: {
    icon: React.ReactNode
    title: string
    desc: string
}) {
    return (
        <div className="rounded-2xl border border-gray-800 p-5 bg-gray-900/30 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-2 text-purple-400">
                {icon}
                <h3 className="font-medium">{title}</h3>
            </div>
            <p className="text-gray-400 mt-2 text-sm">{desc}</p>
        </div>
    )
}

function Milestone({
                       date,
                       title,
                       children,
                   }: {
    date: string
    title: string
    children: React.ReactNode
}) {
    return (
        <div className="relative pl-6">
            <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-purple-500" />
            <div className="text-sm text-purple-400">{date}</div>
            <div className="font-semibold mt-0.5">{title}</div>
            <p className="text-gray-400 mt-1">{children}</p>
        </div>
    )
}

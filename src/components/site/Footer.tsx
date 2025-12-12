import Link from "next/link";
import { Mail } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";

export default function Footer() {
    return (
            <footer className=" border-t border-white/10 bg-black">
            {/* subtle glow */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -inset-24 opacity-40 blur-3xl bg-[radial-gradient(circle_at_20%_0%,rgba(168,85,247,0.14),transparent_55%)]" />
                <div className="absolute -inset-24 opacity-30 blur-3xl bg-[radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.10),transparent_55%)]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-10 md:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4 md:col-span-2">
                        <Link href="/" className="text-4xl font-bold tracking-tighter">
                            Calis<span className="text-purple-400">Hub</span>
                        </Link>
                        <p className="text-white/60 max-w-lg">
                            Calisthenics workouts, skills, and progress. Clean guides, practical tools, no fluff.
                        </p>

                        <div className="flex items-center gap-4">
                            <Link
                                href="https://www.tiktok.com/@calishub.com"
                                className="text-white/50 hover:text-white transition"
                                aria-label="CalisHub on TikTok"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FaTiktok className="h-5 w-5" />
                            </Link>

                            <Link
                                href="#newsletter"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/70 hover:bg-white/[0.06] transition"
                            >
                                <Mail className="h-4 w-4" />
                                Subscribe
                            </Link>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-white/80">Explore</p>
                        <ul className="space-y-2 text-sm">
                            <li><Link className="text-white/60 hover:text-white transition" href="/tools">Tools</Link></li>
                            <li><Link className="text-white/60 hover:text-white transition" href="/topics">Topics</Link></li>
                            <li><Link className="text-white/60 hover:text-white transition" href="/exercises">Exercises</Link></li>
                            <li><Link className="text-white/60 hover:text-white transition" href="/blog">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Start here (SEO + UX win) */}
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-white/80">Start here</p>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    className="text-white/60 hover:text-white transition"
                                    href="/blog/how-to-build-a-beginner-friendly-calisthenics-routine-step-by-step-guide"
                                >
                                    Beginner Guide
                                </Link>
                            </li>
                            <li>
                                <Link className="text-white/60 hover:text-white transition" href="/tools/max-rep-estimator">
                                    Max Rep Estimator
                                </Link>
                            </li>
                            <li>
                                <Link className="text-white/60 hover:text-white transition" href="/tools/workout-generator">
                                    Workout Generator
                                </Link>
                            </li>
                            <li>
                                <Link className="text-white/60 hover:text-white transition" href="/topics/exercises-progressions">
                                    Exercise Progressions
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-white/50">
                    <p>© {new Date().getFullYear()} CalisHub. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/about" className="hover:text-white transition">About</Link>
                        <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
                        <Link href="/contact" className="hover:text-white transition">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

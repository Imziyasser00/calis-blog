import Link from "next/link";
import { Search, ArrowRight, MessageCircle } from "lucide-react";

export function AnswersCtaSection() {
    return (
        <section className="mb-20">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b10] p-6 sm:p-8">
                {/* glow */}
                <div aria-hidden className="pointer-events-none absolute -inset-24 opacity-70">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(168,85,247,0.18),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(217,70,239,0.12),transparent_55%)]" />
                </div>

                <div className="relative">
                    {/* pill */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        Quick Q&A for beginners
                    </div>

                    <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold">
                                Got a question?
                                <span className="block bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
                  Find the answer in 10 seconds.
                </span>
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm text-white/60">
                                Search real calisthenics questions, get short answers + key points, and jump into the right tool or progression.
                            </p>

                            {/* search -> /answers?q=... */}
                            <form action="/answers" method="GET" className="mt-5 relative max-w-xl">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                                <input
                                    name="q"
                                    placeholder="Try: “elbow pain dips”, “core frequency”, “chin-ups easier?”"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-28 py-2.5 text-sm text-white/85 placeholder:text-white/35 outline-none focus:ring-2 focus:ring-purple-500/60"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:border-purple-500/40 hover:text-white transition"
                                >
                                    Search <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            </form>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <Link
                                    href="/answers"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:border-purple-500/40 hover:text-white transition"
                                >
                                    Browse Answers <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/answers#ask"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:border-purple-500/40 hover:text-white transition"
                                >
                                    Ask a question <MessageCircle className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* side card */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <p className="text-sm text-white/70">
                                You can help shape CalisHub.
                            </p>
                            <p className="mt-2 text-xs text-white/50">
                                If your question isn’t answered yet, submit it and we’ll add it to the Answers library.
                            </p>
                            <div className="mt-4 text-xs text-white/55">
                                Popular searches:
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {["beginner routine", "wrist pain push-ups", "pull-up plateau", "dip shoulder pain"].map((t) => (
                                        <Link
                                            key={t}
                                            href={`/answers?q=${encodeURIComponent(t)}`}
                                            className="rounded-full border border-white/10 bg-black/20 px-3 py-1 hover:border-purple-500/40 transition"
                                        >
                                            {t}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

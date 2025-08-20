import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, BookOpen } from "lucide-react";
import { urlFor } from "@calis/lib/sanity.image";
import type { Hero as HeroType } from "@calis/types/content";

export default function Hero({ post }: { post: HeroType | null }) {
    const heroImg = post?.mainImage
        ? urlFor(post.mainImage).width(1600).height(900).fit("crop").url()
        : undefined;

    const heroHref = post?.slug ? `/blog/${post.slug}` : "/blog";

    return (
        <section className="relative overflow-hidden">
            {/* background aesthetics */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
            >
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30 bg-purple-600/40" />
                <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30 bg-fuchsia-500/30" />
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(168,85,247,0.10),transparent_60%)]" />
            </div>

            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
                {/* Left column */}
                <div className="space-y-7">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        New content weekly
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                        Build real strength with{" "}
                        <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
              Calisthenics
            </span>
                    </h1>

                    <p className="text-base md:text-lg text-white/70 max-w-xl">
                        Actionable workouts, skill progressions, and gear advice — powered
                        by a clean Sanity + Next.js stack. Learn smarter, progress faster.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/blog"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        >
                            <BookOpen className="h-4 w-4" />
                            Latest Articles
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <a
                            href="#newsletter"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        >
                            <Mail className="h-4 w-4" />
                            Join Newsletter
                        </a>
                    </div>

                    {/* Quick stats / trust signals */}
                    <div className="flex flex-wrap gap-6 pt-2 text-sm">
                        <div className="flex items-center gap-2 text-white/70">
                            <span className="font-semibold text-white">100+</span>
                            tutorials
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                            <span className="font-semibold text-white">Beginner → Advanced</span>
                            progressions
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                            <span className="font-semibold text-white">No-equipment</span>
                            options
                        </div>
                    </div>
                </div>

                {/* Right column: feature card */}
                <Link
                    href={heroHref}
                    className="group relative block"
                    aria-label={post?.title ? `Read: ${post.title}` : "Browse blog"}
                >
                    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] shadow-2xl backdrop-blur">
                        {/* glow ring on hover */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 transition group-hover:ring-purple-400/40" />

                        {heroImg ? (
                            <>
                                <Image
                                    src={heroImg}
                                    alt={post?.mainImage?.alt || post?.title || ''}
                                    role={post?.mainImage?.alt || post?.title ? undefined : 'presentation'}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="max-w-[90%]">
                                        <h3 className="text-lg md:text-xl font-semibold leading-snug line-clamp-2">
                                            {post?.title || "Featured: Start your calisthenics journey"}
                                        </h3>
                                        <p className="mt-1 text-sm text-white/70 line-clamp-1">
                                            { "Foundations, progressions, and cues that actually help you improve."}
                                        </p>
                                    </div>

                                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur transition group-hover:bg-black/40">
                                        Read now
                                        <ArrowRight className="h-3.5 w-3.5 transition -translate-x-0 group-hover:translate-x-0.5" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex h-full items-center justify-center text-white/60">
                                No hero image yet
                            </div>
                        )}
                    </div>
                </Link>
            </div>
        </section>
    );
}

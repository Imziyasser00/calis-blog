import { Suspense } from "react";
import Newsletter from "@calis/components/Newsletter";
import { client } from "@calis/lib/sanity.client";
import { getHomepageData } from "@calis/lib/sanity/queries";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import Hero from "@calis/components/home/Hero";
import FeaturedGrid from "@calis/components/home/FeaturedGrid";
import RecentGrid from "@calis/components/home/RecentGrid";
import TopicChips from "@calis/components/home/TopicChips";
import { PostsGridSkeleton, HeroSkeleton } from "@calis/components/skeletons";
import Link from "next/link";

export const revalidate = 60; // ISR


export default async function Home() {
    const data = await getHomepageData(client);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="container mx-auto px-4 py-12">
                {/* Hero */}
                <section className="mb-20">
                    <Suspense fallback={<HeroSkeleton />}>
                        <Hero post={data.hero ?? null} />
                    </Suspense>
                </section>
                {/* Interactive Tools section (high on page) */}
                <section className="mb-20" aria-labelledby="interactive-tools">
                    <div className="flex items-center justify-between mb-6">
                        <h2 id="interactive-tools" className="text-2xl font-bold">
                            Interactive Tools
                        </h2>
                        <Link href="/tools" className="text-purple-500 hover:text-purple-400 text-sm">
                            Browse all tools
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Max Rep Estimator */}
                        <Link
                            href="/tools/max-rep-estimator"
                            className="group rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all bg-gray-950 p-6"
                        >
                            <div className="mb-3 inline-flex items-center gap-2 text-xs tracking-wider text-purple-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                Live
                            </div>
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                                Max Rep Estimator
                            </h3>
                            <p className="text-gray-300">
                                Find your true strength level and progression path with science-based estimates.
                            </p>
                        </Link>

                        {/* Workout Generator (coming soon) */}
                        <a
                            href="#newsletter"
                            className="group rounded-2xl border border-gray-800 hover:border-gray-700 transition-all bg-gray-950 p-6"
                            id="workout-generator"
                        >
                            <div className="mb-3 inline-flex items-center gap-2 text-xs tracking-wider text-gray-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                                Coming Soon
                            </div>
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">
                                Workout Generator
                            </h3>
                            <p className="text-gray-300 mb-3">
                                Auto-create sessions tailored to your goals (strength, skills, fat loss).
                            </p>
                            <span className="inline-flex rounded-lg px-3 py-1 border border-purple-500/40 text-sm text-purple-300 group-hover:border-purple-500/70">
                Get notified at launch
              </span>
                        </a>
                    </div>
                </section>
                {/* Recent (next 6) */}
                <section className="mb-20">
                    <h2 className="text-2xl font-bold mb-8">Recent Articles</h2>
                    <Suspense fallback={<PostsGridSkeleton count={6} />}>
                        <RecentGrid posts={data.recent} />
                    </Suspense>
                </section>

                {/* Topics */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Topics</h2>
                        <a href="/topics" className="text-purple-500 hover:text-purple-400 text-sm">Browse all</a>
                    </div>
                    <TopicChips topics={data.topics} />
                </section>

                {/* Newsletter */}
                <Newsletter />
            </main>

            <Footer />
        </div>
    );
}

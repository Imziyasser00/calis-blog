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
import {InteractiveToolsSection} from "@calis/components/home/InteractiveToolsSection";
import {StartHereSection} from "@calis/components/home/StartHereSection";
import {TopicsTilesSection} from "@calis/components/home/TopicsSection";

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
                        <Hero />
                    </Suspense>
                </section>
                {/* Interactive Tools section (high on page) */}
                <InteractiveToolsSection />
                {/* Start Here Section */}
                <StartHereSection />
                    {/* Topics */}
                <TopicsTilesSection />
                {/* Recent (next 6) */}
                <section className="mb-20" aria-labelledby="recent-articles">
                    <div className="flex items-end justify-between gap-4 mb-6">
                        <div>
                            <h2 id="recent-articles" className="text-2xl font-bold">
                                Latest Calisthenics Guides
                            </h2>
                            <p className="mt-1 text-sm text-white/60 max-w-2xl">
                                Fresh progressions, workouts, and practical cues to help you improve faster.
                            </p>
                        </div>

                        <Link
                            href="/blog"
                            className="text-sm text-purple-400 hover:text-purple-300 transition rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        >
                            Browse all
                        </Link>
                    </div>

                    <Suspense fallback={<PostsGridSkeleton count={6} />}>
                        <RecentGrid posts={data.recent} />
                    </Suspense>
                </section>



                {/* Newsletter */}
                <Newsletter />
                <Footer />

            </main>

        </div>
    );
}

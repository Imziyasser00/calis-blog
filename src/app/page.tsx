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

                {/* Featured (latest 3) */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold">Featured Articles</h2>
                        <a href="/blog" className="text-purple-500 hover:text-purple-400 text-sm flex items-center gap-2">
                            View all
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </a>
                    </div>
                    <Suspense fallback={<PostsGridSkeleton count={3} />}>
                        <FeaturedGrid posts={data.featured} />
                    </Suspense>
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

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@calis/lib/sanity.image";
import type { Hero as HeroType } from "@calis/types/content";

export default function Hero({ post }: { post: HeroType | null }) {
    const heroImg = post?.mainImage
        ? urlFor(post.mainImage).width(1600).height(900).fit("crop").url()
        : undefined;

    return (
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Build strength with <span className="text-purple-500">Calisthenics</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl">
                    Actionable workouts, skill progressions, and gear advice — powered by a clean Sanity + Next.js stack.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/blog" className="inline-flex">
                        <span className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-700">Latest Articles</span>
                    </Link>
                    <a href="#newsletter" className="inline-flex">
                        <span className="inline-flex items-center justify-center rounded-md border border-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-900">Join Newsletter</span>
                    </a>
                </div>
            </div>

            <Link
                href={post?.slug ? `/blog/${post.slug}` : "/blog"}
                className="relative h-[400px] rounded-xl overflow-hidden border border-gray-800 block"
            >
                {heroImg ? (
                    <>
                        <Image src={heroImg} alt={post?.title || "Latest post"} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-lg md:text-xl font-semibold line-clamp-2">{post?.title}</h3>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">No hero image yet</div>
                )}
            </Link>
        </div>
    );
}

import Image from "next/image";
import Link from "next/link";
import { BrainCircuit, Clock, ArrowRight } from "lucide-react";
import type { PostCard as PostCardType } from "@calis/types/content";
import { urlFor } from "@calis/lib/sanity.image";
import { formatDate } from "@calis/lib/utils/dates";
import { excerptWords, isTruncatedByWords } from "@calis/lib/utils/text";

export default function ArticleCard({
                                        post,
                                        priority = false,
                                    }: {
    post: PostCardType;
    priority?: boolean;
}) {
    const image = post.mainImage
        ? urlFor(post.mainImage).width(900).height(560).fit("crop").quality(70).auto("format").url()
        : "/placeholder.svg";

    const category = post.categoryTitles?.[0] || "Training";
    const date = formatDate(post.publishedAt);
    const preview = excerptWords(post.excerpt, 40);
    const needsEllipsis = isTruncatedByWords(post.excerpt, 40);

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-2xl"
        >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] transition hover:border-purple-500/35">
                {/* subtle glow */}
                <div className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition duration-700">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(168,85,247,0.18),transparent_60%)]" />
                </div>

                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                    <Image
                        src={image}
                        alt={post.mainImage?.alt || post.title}
                        fill
                        priority={priority}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Category pill */}
                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur">
                        <BrainCircuit className="h-3.5 w-3.5 text-purple-300" />
                        {category}
                    </div>

                    {/* Read cue */}
                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur">
                        Read <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                </div>

                {/* Content */}
                <div className="relative p-5">
                    <h3 className="text-base font-semibold leading-snug group-hover:text-purple-200 transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    {preview && (
                        <p className="mt-2 text-sm text-white/60 line-clamp-2">
                            {preview}
                            {needsEllipsis ? "…" : ""}
                        </p>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-xs text-white/45">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

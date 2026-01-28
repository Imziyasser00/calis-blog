import Image from "next/image";
import Link from "next/link";
import { BrainCircuit, Clock, ArrowRight } from "lucide-react";
import type { PostCard as PostCardType } from "@calis/types/content";
import { urlFor } from "@calis/lib/sanity.image";
import { formatDate } from "@calis/lib/utils/dates";
import { excerptWords } from "@calis/lib/utils/text";

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

    const category = post.categoryTitles?.[0];
    const preview = post.excerpt ? excerptWords(post.excerpt, 40) : null;

    const dateLabel = post.publishedAt ? formatDate(post.publishedAt) : null;
    const dateISO = post.publishedAt ? new Date(post.publishedAt).toISOString() : null;

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] transition hover:border-purple-500/35 focus-within:ring-2 focus-within:ring-purple-500/70">
            {/* Hover glow */}
            <div className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition duration-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(168,85,247,0.18),transparent_60%)]" />
            </div>

            {/* Image (clickable) */}
            <Link
                href={`/blog/${post.slug}`}
                aria-label={`Read article: ${post.title}`}
                className="relative block aspect-[16/10] overflow-hidden"
            >
                <Image
                    src={image}
                    alt={post.mainImage?.alt || post.title}
                    fill
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {category && (
                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur">
                        <BrainCircuit className="h-3.5 w-3.5 text-purple-300" />
                        {category}
                    </div>
                )}

                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur">
                    Read <ArrowRight className="h-3.5 w-3.5" />
                </div>
            </Link>

            {/* Content */}
            <div className="relative p-5">
                <h3 className="text-base font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-purple-200">
                    <Link href={`/blog/${post.slug}`} className="outline-none">
                        {post.title}
                    </Link>
                </h3>

                {preview && <p className="mt-2 text-sm text-white/60 line-clamp-2">{preview}</p>}

                {dateLabel && dateISO && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/45">
                        <Clock className="h-3.5 w-3.5" />
                        <time dateTime={dateISO}>{dateLabel}</time>
                    </div>
                )}
            </div>
        </article>
    );
}

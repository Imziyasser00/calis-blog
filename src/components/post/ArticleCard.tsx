import Image from "next/image";
import Link from "next/link";
import { BrainCircuit, Clock } from "lucide-react";
import type { PostCard as PostCardType } from "@calis/types/content";
import { urlFor } from "@calis/lib/sanity.image";
import { formatDate } from "@calis/lib/utils/dates";
import { excerptWords, isTruncatedByWords } from "@calis/lib/utils/text"; // <-- add

export default function ArticleCard({ post }: { post: PostCardType }) {
    const image = post.mainImage ? urlFor(post.mainImage).width(800).height(500).fit("crop").url() : "/placeholder.svg";
    const category = post.categoryTitles?.[0] || "Training";
    const date = formatDate(post.publishedAt);
    const preview = excerptWords(post.excerpt, 40);
    const needsEllipsis = isTruncatedByWords(post.excerpt, 40);

    return (
        <Link href={`/blog/${post.slug}`} className="group">
            <div className="space-y-3">
                <div className="relative h-72 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
                    <Image
                        src={image}
                        alt={post.mainImage?.alt || post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
                        <BrainCircuit className="h-4 w-4" />
                        <span>{category}</span>
                    </div>
                    <h3 className="font-medium group-hover:text-purple-400 transition-colors">{post.title}</h3>
                    {preview && (
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                            {preview}
                            {needsEllipsis ? "…" : ""}
                        </p>
                    )}
                    <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

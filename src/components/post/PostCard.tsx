// components/post/PostCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Clock, Cpu, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@calis/components/ui/card";
import type { PostCard as PostCardType } from "@calis/types/content";
import { urlFor } from "@calis/lib/sanity.image";
import { formatDate } from "@calis/lib/utils/dates";
import { excerptWords, isTruncatedByWords } from "@calis/lib/utils/text";
import clsx from "clsx";

type Props = {
    post: PostCardType;
    variant?: "default" | "featured";
    className?: string;
};

export default function PostCard({ post, variant = "default", className }: Props) {
    const image = post.mainImage
        ? urlFor(post.mainImage).width(1600).height(900).fit("crop").url()
        : "/placeholder.svg";

    const category = post.categoryTitles?.[0] || "Calisthenics";
    const date = post.publishedAt ? formatDate(post.publishedAt) : "";
    const rawExcerpt = post.excerpt ?? "";
    const preview = excerptWords(rawExcerpt, 44);
    const needsEllipsis = isTruncatedByWords(rawExcerpt, 44);

    // sizes: make featured card reserve a bit more room
    const imageHeight = variant === "featured" ? "md:h-64 h-56" : "h-48";

    return (
        <Link
            href={`/blog/${post.slug ?? ""}`}
            className={clsx("group block focus:outline-none", className)}
        >
            <Card
                className={clsx(
                    "p-x pt-0 relative overflow-hidden border-gray-800 bg-gray-900/60 backdrop-blur-[1px]",
                    "transition-all duration-300",
                    "hover:border-purple-500/50 hover:shadow-[0_10px_40px_-12px_rgba(168,85,247,0.35)]",
                    "focus-visible:ring-2 focus-visible:ring-purple-500/60",
                    variant === "featured" && "ring-1 ring-purple-500/10",
                    className
                )}
            >
                {/* full-bleed image at the top */}
                <div className={clsx("relative bg-yellow-400 w-full", imageHeight)}>
                    <Image
                        src={image}
                        alt={post.title}
                        fill
                        className="object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                        priority={variant === "featured"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-t-lg" />
                    {/* category pill */}
                    <div className="absolute left-3 top-3 flex items-center gap-2">
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-2.5 py-1 text-xs font-medium text-purple-300 ring-1 ring-purple-400/25 backdrop-blur">
        <Cpu className="h-3.5 w-3.5" />
          {category}
      </span>
                    </div>
                    {/* date in overlay */}
                    {date && (
                        <div className="absolute bottom-3 left-3 hidden rounded-full bg-black/50 px-2.5 py-1 text-xs text-gray-200 ring-1 ring-white/10 backdrop-blur md:block">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
            {date}
        </span>
                        </div>
                    )}
                </div>

                {/* rest of the card with padding */}
                <CardHeader className="pb-2">
                    <CardTitle className="tracking-tight text-white text-2xl md:text-[1.6rem] leading-snug">
                        <span className="line-clamp-2">{post.title}</span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                    {preview && (
                        <p
                            className={clsx(
                                "text-gray-400/90",
                                variant === "featured" ? "line-clamp-4" : "line-clamp-3"
                            )}
                        >
                            {preview}
                            {needsEllipsis ? "…" : ""}
                        </p>
                    )}
                </CardContent>

                <CardFooter className="mt-2 flex items-center justify-between text-sm">
                    {date && (
                        <div className="md:hidden text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-4 w-4" />
            {date}
        </span>
                        </div>
                    )}
                    <div className="ml-auto inline-flex items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-1.5 text-sm font-medium text-purple-300 ring-1 ring-purple-400/20 transition-colors group-hover:bg-purple-500/15 group-hover:text-purple-200">
                        Read more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </CardFooter>
            </Card>

        </Link>
    );
}

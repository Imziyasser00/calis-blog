// components/post/PostCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Clock, Cpu } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@calis/components/ui/card";
import type { PostCard as PostCardType } from "@calis/types/content";
import { urlFor } from "@calis/lib/sanity.image";
import { formatDate } from "@calis/lib/utils/dates";
import { excerptWords, isTruncatedByWords } from "@calis/lib/utils/text"; // <-- add

export default function PostCard({ post }: { post: PostCardType }) {
    const image = post.mainImage ? urlFor(post.mainImage).width(1200).height(800).fit("crop").url() : "/placeholder.svg";
    const category = post.categoryTitles?.[0] || "Calisthenics";
    const date = formatDate(post.publishedAt);
    const preview = excerptWords(post.excerpt, 40);
    const needsEllipsis = isTruncatedByWords(post.excerpt, 40);

    return (
        <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500/50 transition-colors">
            <div className="relative h-48">
                <Image src={image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <CardHeader>
                <div className="flex items-center gap-2 text-sm text-purple-500 mb-2">
                    <Cpu className="h-5 w-5" />
                    <span>{category}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
                {preview && (
                    <CardDescription className="text-gray-400 line-clamp-3">
                        {preview}{needsEllipsis ? "…" : ""}
                    </CardDescription>
                )}
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{date}</span>
                </div>
                <Link href={`/blog/${post.slug}`} className="text-purple-500 hover:text-purple-400">Read more →</Link>
            </CardFooter>
        </Card>
    );
}

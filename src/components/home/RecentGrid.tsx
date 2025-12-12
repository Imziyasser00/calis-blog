import ArticleCard from "@calis/components/post/ArticleCard";
import type { PostCard as PostCardType } from "@calis/types/content";

export default function RecentGrid({ posts }: { posts: PostCardType[] }) {
    const shown = posts.slice(0, 3);

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((p, idx) => (
                <ArticleCard key={p._id} post={p} priority={idx < 1} />
            ))}
        </div>
    );
}

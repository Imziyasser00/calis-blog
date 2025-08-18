import ArticleCard from "@calis/components/post/ArticleCard";
import type { PostCard as PostCardType } from "@calis/types/content";

export default function RecentGrid({ posts }: { posts: PostCardType[] }) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
                <ArticleCard key={p._id} post={p} />
            ))}
        </div>
    );
}

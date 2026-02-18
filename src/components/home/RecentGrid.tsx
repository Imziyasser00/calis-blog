import ArticleCard from "@calis/components/post/ArticleCard";
import type { PostCard as PostCardType } from "@calis/types/content";

export default function RecentGrid({ posts }: { posts: PostCardType[] }) {
    return (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((p, idx) => (
                <li key={p._id}>
                    <ArticleCard post={p} priority={idx === 0} />
                </li>
            ))}
        </ul>
    );
}

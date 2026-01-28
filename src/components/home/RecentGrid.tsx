import ArticleCard from "@calis/components/post/ArticleCard";
import type { PostCard as PostCardType } from "@calis/types/content";

export default function RecentGrid({ posts }: { posts: PostCardType[] }) {
    const shown = posts.slice(0, 3);

    return (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((p, idx) => (
                <li key={p._id}>
                    <ArticleCard post={p} priority={idx < 1} />
                </li>
            ))}
        </ul>
    );
}

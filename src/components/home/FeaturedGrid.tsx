import PostCard from "@calis/components/post/PostCard";
import type { PostCard as PostCardType } from "@calis/types/content";

export default function FeaturedGrid({ posts }: { posts: PostCardType[] }) {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            {posts.map((p) => (
                <PostCard key={p._id} post={p} variant="featured" />
            ))}
        </div>
    );
}

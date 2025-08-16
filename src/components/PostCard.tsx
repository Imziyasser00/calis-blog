import Link from 'next/link'
import Image from 'next/image'
export default function PostCard({ post }: { post: any }) {
    const cover = post.coverImage?.asset?.url
    return (
        <article className="rounded-2xl border p-4 hover:shadow-sm transition">
            {cover && <Image src={cover} alt={post.coverImage?.alt || post.title} width={1200} height={675} className="rounded-xl mb-3" />}
            <h3 className="text-xl font-semibold mb-1"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
            <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
        </article>
    )
}

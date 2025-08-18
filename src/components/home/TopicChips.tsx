import Link from "next/link";
import type { Category } from "@calis/types/content";

export default function TopicChips({ topics }: { topics: Category[] }) {
    return (
        <ul className="flex flex-wrap gap-2 text-sm">
            {topics.map((t) => (
                <li key={t._id}>
                    <Link
                        href={t.slug?.current ? `/topics/${t.slug.current}` : "/topics"}
                        className="px-3 py-1 rounded-full border border-purple-500/40 hover:border-purple-500/70 text-gray-200"
                    >
                        {t.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

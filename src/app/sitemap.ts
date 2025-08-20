// app/sitemap.ts
import { MetadataRoute } from "next";
import { client } from "@calis/lib/sanity.client";

const SITE_URL = (process.env.SITE_URL ?? "https://www.calishub.com").replace(/\/+$/, "");

// If you use a different field names, tweak GROQ accordingly
const POSTS_GROQ = /* groq */ `
*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{
  "slug": slug.current,
  publishedAt,
  _updatedAt
}
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1) Static routes you actually have
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${SITE_URL}/`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${SITE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/topics`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.4,
        },
    ];

    const posts: { slug: string; publishedAt?: string; _updatedAt?: string }[] =
        await client.fetch(POSTS_GROQ);

    const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: new Date(p._updatedAt ?? p.publishedAt ?? Date.now()),
        changeFrequency: "daily",
        priority: 0.8,
    }));

    return [...staticRoutes, ...postRoutes];
}

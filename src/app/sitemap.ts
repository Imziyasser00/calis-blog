import { MetadataRoute } from "next";
import { client } from "@calis/lib/sanity.client";

const SITE_URL = "https://www.calishub.com";

const POSTS_GROQ = /* groq */ `
*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{
  "slug": slug.current,
  publishedAt,
  _updatedAt
}
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // -----------------
    // Static routes
    // -----------------
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${SITE_URL}/`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/beginner-calisthenics`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.85,
        },
        {
            url: `${SITE_URL}/blog`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/topics`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/tools`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/tools/max-rep-estimator`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/tools/workout-generator`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        }

    ];

    // -----------------
    // Blog posts
    // -----------------
    const posts: {
        slug: string;
        publishedAt?: string;
        _updatedAt?: string;
    }[] = await client.fetch(POSTS_GROQ);

    const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: new Date(p._updatedAt ?? p.publishedAt ?? "2024-01-01"),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...postRoutes];
}

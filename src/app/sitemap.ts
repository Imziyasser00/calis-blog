import { MetadataRoute } from "next";
import { client } from "@calis/lib/sanity.client";

const SITE_URL = "https://www.calishub.com";

const POSTS_GROQ =  `
*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{
  "slug": slug.current,
  publishedAt,
  _updatedAt
}
`;

const ANSWERS_GROQ =  `
*[_type == "answerPage" && defined(slug.current) && !(_id in path("drafts.**")) && !(seo.noindex == true)]{
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
            url: `${SITE_URL}/library`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/library/pullup-passport`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.75,
        },
        {
            url: `${SITE_URL}/topics`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/tools`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/tools/max-rep-estimator`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/tools/ull-up-diagnostic`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/tools/workout-generator`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/answers`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.85,
        },

        {
            url: `${SITE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date(),
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

    const answers: {
        slug: string;
        publishedAt?: string;
        _updatedAt?: string;
    }[] = await client.fetch(ANSWERS_GROQ);


    const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: new Date(p._updatedAt ?? p.publishedAt ?? "2024-01-01"),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    const answerRoutes: MetadataRoute.Sitemap = answers.map((a) => ({
        url: `${SITE_URL}/answers/${a.slug}`,
        lastModified: new Date(a._updatedAt ?? a.publishedAt ?? "2024-01-01"),
        changeFrequency: "monthly",
        priority: 0.75,
    }));

    return [...staticRoutes, ...postRoutes, ...answerRoutes];
}

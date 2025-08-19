import { groq } from "next-sanity";
import type { HomeData } from "@calis/types/content";

const postCardFields = `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "excerpt": pt::text(body),
  mainImage,
  "categoryTitles": coalesce(categories[]->title, [])
`;

export const heroQuery = groq`
  *[_type=="post" && defined(slug.current)]|order(publishedAt desc)[0]{
    title, "slug": slug.current, mainImage
  }
`;

export const topicsQuery = groq`
  *[_type=="category"]|order(title asc){ _id, title, slug }
`;

// --- unified query for featured + recent ---
const combinedQuery = groq`
  *[_type=="post" && defined(slug.current)]
  | order(publishedAt desc)[0...9]{
    ${postCardFields}
  }
`;

export async function getHomepageData(client: any): Promise<HomeData> {
    const [hero, combined, topics] = await Promise.all([
        client.fetch(heroQuery),
        client.fetch(combinedQuery),
        client.fetch(topicsQuery),
    ]);

    const featured = combined.slice(0, 3);
    const recent = combined.slice(0, 6);

    return {
        hero: hero ?? null,
        featured,
        recent,
        topics: topics ?? [],
    };
}

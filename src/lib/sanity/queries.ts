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

export const heroQuery = groq`*[_type=="post" && defined(slug.current)]|order(publishedAt desc)[0]{
  title, "slug": slug.current, mainImage
}`;

export const featuredQuery = groq`*[_type=="post" && defined(slug.current)]|order(publishedAt desc)[0...3]{${postCardFields}}`;
export const recentQuery = groq`*[_type=="post" && defined(slug.current)]|order(publishedAt desc)[3...9]{${postCardFields}}`;
export const topicsQuery = groq`*[_type=="category"]|order(title asc){ _id, title, slug }`;

export async function getHomepageData(client: any): Promise<HomeData> {
    const [hero, featured, recent, topics] = await Promise.all([
        client.fetch(heroQuery),
        client.fetch(featuredQuery),
        client.fetch(recentQuery),
        client.fetch(topicsQuery),
    ]);
    return {
        hero: hero ?? null,
        featured: featured ?? [],
        recent: recent ?? [],
        topics: topics ?? [],
    };
}

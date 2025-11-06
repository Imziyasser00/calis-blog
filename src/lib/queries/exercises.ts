import { groq } from "next-sanity";

export const EXERCISES_INDEX = groq`
*[_type=="exercise"]|order(name asc){
  _id,
  name,
  "slug": slug.current,
  shortDescription,
  difficulty,
  "primaryMuscles": primaryMuscles[]->name,
  "coverImage": coverImage{ alt, "url": asset->url }
}
`;

export const EXERCISE_BY_SLUG = groq`
*[_type=="exercise" && slug.current==$slug][0]{
  _id,
  name,
  "slug": slug.current,
  shortDescription,
  body,
  difficulty, type,
  "primaryMuscles": primaryMuscles[]->{name, "slug": slug.current},
  "secondaryMuscles": secondaryMuscles[]->{name, "slug": slug.current},
  "equipment": equipment[]->{name, "slug": slug.current},
  tags[]->{label, "slug": slug.current},
  coverImage{ alt, "url": asset->url },
  "gallery": gallery[]{ alt, "url": asset->url },
  demoVideoUrl,
  gif{ alt, "url": asset->url },
  setup,
  execution[]{ title, text, image{ alt, "url": asset->url } },
  cues,
  commonMistakes[]{ title, fix, image{ alt, "url": asset->url } },
  safetyNotes,
  contraindications,
  programming{ beginner, intermediate, advanced },
  tempo,
  rest,
  regressions[]->{ name, "slug": slug.current, coverImage{ "url": asset->url, alt } },
  progressions[]->{ name, "slug": slug.current, coverImage{ "url": asset->url, alt } },
  variations[]->{ name, "slug": slug.current, coverImage{ "url": asset->url, alt } },
  seo{ metaTitle, metaDescription, canonicalUrl, ogImage{ "url": asset->url, alt } },
  publishedAt
}
`;

export const ALL_EXERCISE_SLUGS = groq`
*[_type=="exercise" && defined(slug.current)].slug.current
`;

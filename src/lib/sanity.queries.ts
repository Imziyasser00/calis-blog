import { groq } from 'next-sanity'

export const settingsQuery = groq`*[_type == "siteSettings"][0]{title,description,siteUrl, defaultOgImage{asset->{url, metadata{lqip}}}}`

const postFields = `{
  _id, title, "slug": slug.current, excerpt, publishedAt, updatedAt,
  coverImage{asset->{url, metadata{lqip}}, alt},
  seo{metaTitle, metaDescription, ogImage{asset->{url}}},
  author->{name, image, slug},
  "categories": categories[]->{title, slug}
}`

export const allPostsQuery = groq`*[_type == "post" && defined(slug.current)]|order(publishedAt desc) ${postFields}`
export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] ${postFields} `
export const allPostSlugsQuery = groq`*[_type == "post" && defined(slug.current)].slug.current`

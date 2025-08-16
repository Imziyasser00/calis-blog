import type { MetadataRoute } from 'next'
import { client } from '@calis/lib/sanity.client'
import { allPostSlugsQuery } from '@calis/lib/sanity.queries'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = process.env.SITE_URL || 'http://localhost:3000'
    const slugs: string[] = await client.fetch(allPostSlugsQuery)
    const posts = slugs.map((slug) => ({ url: `${base}/blog/${slug}`, changeFrequency: 'daily' as const, priority: 0.8 }))
    return [ { url: base, changeFrequency: 'daily', priority: 1 }, ...posts ]
}

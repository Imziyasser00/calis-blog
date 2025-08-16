// src/app/(blog)/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@calis/lib/sanity.client'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
// No `any` here:
const builder = imageUrlBuilder({ projectId, dataset })

type SanityCrop = { top: number; bottom: number; left: number; right: number }
type SanityHotspot = { x: number; y: number; height: number; width: number }
type SanityAsset = { _id?: string; url?: string; _ref?: string }

type SanityImage = {
    asset?: SanityAsset
    crop?: SanityCrop
    hotspot?: SanityHotspot
}

type OgPost = {
    title?: string
    mainImage?: SanityImage
}

const query = /* groq */ `
*[_type == "post" && slug.current == $slug][0]{
  title,
  mainImage{
    ...,
    asset->{
      _id,
      url
    }
  }
}
`

export default async function OG({ params }: { params: { slug: string } }) {
    const post = await client.fetch<OgPost>(query, { slug: params.slug })

    const title = post?.title ?? 'Calisthenics Blog'
    const ogUrl =
        post?.mainImage
            ? builder.image(post.mainImage).width(size.width).height(size.height).fit('crop').auto('format').url()
            : null

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    background: 'linear-gradient(135deg,#0ea5e9,#111827)',
                }}
            >
                {ogUrl ? (
                    <img
                        src={ogUrl}
                        alt="" // decorative image => a11y OK
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.28,
                            filter: 'grayscale(14%)',
                        }}
                    />
                ) : null}

                <div
                    style={{
                        maxWidth: 1000,
                        padding: 64,
                        fontSize: 64,
                        fontWeight: 800,
                        color: 'white',
                        textAlign: 'center',
                        lineHeight: 1.08,
                        textShadow: '0 2px 12px rgba(0,0,0,.45)',
                    }}
                >
                    {title}
                </div>
            </div>
        ),
        { ...size }
    )
}

// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@calis/lib/sanity.client'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const builder = imageUrlBuilder(client as any)

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
    const post = await client.fetch(query, { slug: params.slug })

    const title: string = post?.title || 'Calisthenics Blog'
    const ogImgUrl: string | null = post?.mainImage
        ? builder.image(post.mainImage)
            .width(size.width)
            .height(size.height)
            .fit('crop')              // respects hotspot/crop
            .auto('format')           // webp/png depending on renderer
            .url()
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
                {ogImgUrl ? (
                    <img
                        src={ogImgUrl}
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

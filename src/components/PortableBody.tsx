'use client'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@calis//lib/sanity.image'

const components: PortableTextComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?._ref) return null
            const url = urlFor(value).width(1200).fit('max').url()
            const blur = value?.asset?.metadata?.lqip
            return (
                <figure className="my-6">
                    <Image
                        src={url}
                        alt={value?.alt || ''}
                        role={value?.alt ? undefined : 'presentation'}
                        width={1200}
                        height={675}
                        className="rounded-xl"
                        placeholder={blur ? 'blur' : 'empty'}
                        blurDataURL={blur}
                    />
                    {value?.alt && <figcaption className="mt-2 text-sm text-gray-500">{value.alt}</figcaption>}
                </figure>
            )
        },
    },
}
// @ts-ignore
export default function PortableBody({ value }: { value: any })

"use client"

import { useState } from "react"
import Image from "next/image"


type GalleryImage = {
    url: string
    alt: string
}

export function GalleryLightbox({ images }: { images: GalleryImage[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const handlePrevious = () => {
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1)
        }
    }

    const handleNext = () => {
        if (selectedIndex !== null && selectedIndex < images.length - 1) {
            setSelectedIndex(selectedIndex + 1)
        }
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                    >
                        <Image
                            src={image.url || "/placeholder.svg"}
                            alt={image.alt || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </button>
                ))}
            </div>
        </>
    )
}

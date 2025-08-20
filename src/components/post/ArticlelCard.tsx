"use client";
import { useState, useRef } from "react"
import {useRouter, useSearchParams} from "next/navigation"
import Link from "next/link";
import {BrainCircuit, Clock, Search as SearchIcon} from "lucide-react";
import Image from "next/image";


// --- Card ---
export function ArticleCard({
                         title,
                         description,
                         category,
                         date,
                         slug = "",
                         imageUrl,
                     }: {
    title: string
    description?: string
    category?: string
    date?: string
    slug?: string
    imageUrl: string
}) {
    const shortDesc =
        (description || "").trim().slice(0, 150) + ((description || "").length > 150 ? "…" : "")

    return (
        <Link href={`/blog/${slug}`} className="group block">
            <div className="space-y-3">
                <div className="relative h-52 sm:h-56 md:h-64 xl:h-72 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                </div>
                <div>
                    {category && (
                        <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
                            <BrainCircuit className="h-4 w-4" />
                            <span>{category}</span>
                        </div>
                    )}
                    <h3 className="font-medium group-hover:text-purple-400 transition-colors leading-snug">{title}</h3>
                    {shortDesc && <p className="text-gray-400 text-sm mt-2 line-clamp-2">{shortDesc}</p>}
                    {date && (
                        <div className="flex items-center gap-1 mt-3 text-[11px] sm:text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{date}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}




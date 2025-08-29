"use client"
import { useEffect, useState } from "react"

export default function Toc() {
    const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])

    useEffect(() => {
        const nodes = Array.from(document.querySelectorAll("article h2, article h3"))
        const hs = nodes.map((el) => {
            if (!el.id)
                el.id =
                    el.textContent?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") ?? ""
            return { id: el.id, text: el.textContent || "", level: el.tagName === "H2" ? 2 : 3 }
        })
        setHeadings(hs)
    }, [])

    if (!headings.length) return null
    return (
        <nav aria-label="Table of contents" className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="font-semibold mb-2">Contents</p>
            <ul className="space-y-1">
                {headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
                        <a
                            className="underline decoration-purple-500/60 hover:decoration-purple-400"
                            href={`#${h.id}`}
                        >
                            {h.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}



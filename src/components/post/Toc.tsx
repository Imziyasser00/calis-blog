"use client";

import { useEffect, useState } from "react";

type TocItem = {
    id: string;
    text: string;
    level: 2 | 3;
};

function slugify(s: string) {
    return s
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export default function Toc() {
    const [items, setItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    // 1) Build TOC from article headings + ensure each heading has an id
    useEffect(() => {
        const headings = Array.from(
            document.querySelectorAll("article h2, article h3")
        ) as HTMLHeadingElement[];

        const used = new Set<string>();
        const toc: TocItem[] = [];

        for (const h of headings) {
            const text = (h.textContent || "").trim();
            if (!text) continue;

            const level = h.tagName === "H2" ? 2 : 3;

            let id = h.id?.trim() || slugify(text);
            // ensure unique
            let unique = id;
            let i = 2;
            while (used.has(unique)) {
                unique = `${id}-${i++}`;
            }
            used.add(unique);
            h.id = unique;

            toc.push({ id: unique, text, level });
        }

        setItems(toc);
    }, []);

    // 2) Highlight active heading while scrolling
    useEffect(() => {
        if (!items.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        setActiveId(e.target.id);
                    }
                }
            },
            {
                rootMargin: "-40% 0px -55% 0px",
                threshold: 0,
            }
        );

        for (const item of items) {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        }

        return () => observer.disconnect();
    }, [items]);

    if (items.length < 2) return null;

    return (
        <aside
            aria-label="Table of contents"
            className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 w-[270px]"
        >
            <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur">
                <p className="mb-4 text-xs uppercase tracking-wide text-white/40">
                    On this page
                </p>

                <ul className="space-y-1.5">
                    {items.map((item) => {
                        const isActive = item.id === activeId;

                        return (
                            <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
                                <a
                                    href={`#${item.id}`}
                                    className={[
                                        "group relative block text-sm leading-snug transition-colors",
                                        isActive
                                            ? "text-purple-300"
                                            : "text-white/55 hover:text-white",
                                    ].join(" ")}
                                >
                  <span
                      className={[
                          "absolute -left-3 top-1 h-4 w-[2px] rounded-full transition-opacity",
                          isActive ? "bg-purple-400 opacity-100" : "opacity-0",
                      ].join(" ")}
                  />
                                    {item.text}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}

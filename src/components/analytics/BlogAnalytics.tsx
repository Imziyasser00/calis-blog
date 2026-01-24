"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@calis/lib/analytics/track";

type Props = {
    slug: string;
    title?: string;
    category?: string;
    author?: string;
};

function getScrollPercent() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const scrollHeight = doc.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return 100;
    return Math.round((scrollTop / scrollHeight) * 100);
}

export default function BlogAnalytics({ slug, title, category, author }: Props) {
    const viewedRef = useRef(false);
    const engagedRef = useRef(false);
    const sentScrollRef = useRef<Record<number, boolean>>({});

    // 1) blog_view (once per tab session per post)
    useEffect(() => {
        const key = `ch_blog_view_${slug}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");

        if (!viewedRef.current) {
            viewedRef.current = true;
            trackEvent("blog_view", { slug, title, category, author });
        }
    }, [slug, title, category, author]);

    // 2) blog_engaged (45s visible)
    useEffect(() => {
        const t = window.setTimeout(() => {
            if (engagedRef.current) return;
            if (document.visibilityState !== "visible") return;

            engagedRef.current = true;
            trackEvent("blog_engaged", { slug, title, category, engagedSeconds: 45 });
        }, 45_000);

        return () => window.clearTimeout(t);
    }, [slug, title, category]);

    // 3) blog_scroll thresholds
    useEffect(() => {
        const thresholds = [25, 50, 75, 90];

        const onScroll = () => {
            const pct = getScrollPercent();
            for (const th of thresholds) {
                if (pct >= th && !sentScrollRef.current[th]) {
                    sentScrollRef.current[th] = true;
                    trackEvent("blog_scroll", { slug, title, category, percent: th });
                }
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [slug, title, category]);

    return null;
}

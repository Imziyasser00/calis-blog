"use client";

import dynamic from "next/dynamic";

const NewsletterForm = dynamic(() => import("./NewsletterForm"), {
    ssr: false,
    loading: () => (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="h-4 w-2/3 bg-white/10 rounded mb-3" />
            <div className="h-10 w-full bg-white/10 rounded mb-3" />
            <div className="h-10 w-full bg-white/10 rounded" />
        </div>
    ),
});

export default function NewsletterFormClient() {
    return <NewsletterForm />;
}

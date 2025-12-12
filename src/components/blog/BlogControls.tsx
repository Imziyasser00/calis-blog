"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

type Category = { _id: string; title: string; slug?: string };

export default function BlogControls({
                                         categories,
                                         placeholder = "Search articles (e.g. pull-ups, handstand, protein)…",
                                     }: {
    categories: Category[];
    placeholder?: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const qFromUrl = sp.get("q") ?? "";
    const catFromUrl = sp.get("cat") ?? "";

    const [q, setQ] = useState(qFromUrl);

    // keep input synced if user navigates back/forward
    useEffect(() => setQ(qFromUrl), [qFromUrl]);

    const selectedCat = catFromUrl;

    const pushParams = (next: { q?: string; cat?: string; page?: string }) => {
        const params = new URLSearchParams(sp.toString());

        // always reset page when changing filters/search
        params.delete("page");

        if (next.q !== undefined) {
            const v = next.q.trim();
            if (v) params.set("q", v);
            else params.delete("q");
        }

        if (next.cat !== undefined) {
            const v = next.cat.trim();
            if (v) params.set("cat", v);
            else params.delete("cat");
        }

        // allow manual override if needed
        if (next.page !== undefined) {
            if (next.page) params.set("page", next.page);
            else params.delete("page");
        }

        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: true });
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        pushParams({ q });
    };

    const clearSearch = () => pushParams({ q: "" });

    const pills = useMemo(() => categories.slice(0, 10), [categories]);

    return (
        <div className="mb-10 space-y-5">
            {/* Search */}
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/45">
                        <Search className="h-4 w-4" />
                    </div>

                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder={placeholder}
                        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-10 text-sm text-white/90 placeholder:text-white/35 outline-none focus:ring-2 focus:ring-purple-500/60"
                        aria-label="Search blog articles"
                    />

                    {q.trim().length > 0 && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <button
                    type="submit"
                    className="h-11 rounded-xl bg-purple-600 px-5 text-sm font-medium text-white hover:bg-purple-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                    Search
                </button>
            </form>

            {/* Category pills */}
            {pills.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => pushParams({ cat: "" })}
                        className={[
                            "rounded-full border px-3 py-1 text-sm transition",
                            !selectedCat
                                ? "border-purple-500/50 bg-purple-500/10 text-white"
                                : "border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-purple-500/40",
                        ].join(" ")}
                    >
                        All
                    </button>

                    {pills.map((c) => {
                        const value = c.slug || c.title; // choose slug if you have it
                        const isActive = selectedCat === value;

                        return (
                            <button
                                key={c._id}
                                type="button"
                                onClick={() => pushParams({ cat: value })}
                                className={[
                                    "rounded-full border px-3 py-1 text-sm transition",
                                    isActive
                                        ? "border-purple-500/50 bg-purple-500/10 text-white"
                                        : "border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-purple-500/40",
                                ].join(" ")}
                            >
                                {c.title}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Active filters hint */}
            {(qFromUrl || catFromUrl) && (
                <div className="text-sm text-white/55">
                    Showing results
                    {qFromUrl ? (
                        <>
                            {" "}
                            for <span className="text-white">“{qFromUrl}”</span>
                        </>
                    ) : null}
                    {catFromUrl ? (
                        <>
                            {" "}
                            in <span className="text-white">{catFromUrl}</span>
                        </>
                    ) : null}
                    .{" "}
                    <button
                        type="button"
                        onClick={() => router.push(pathname)}
                        className="text-purple-300 hover:text-purple-200 transition"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}

"use client";

import { useState } from "react";

export default function AskQuestionInlineSection({
                                                     defaultTopic,
                                                 }: {
    defaultTopic?: string;
}) {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState<null | "ok" | "err">(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setDone(null);

        const fd = new FormData(e.currentTarget);
        const question = String(fd.get("question") || "");
        const email = String(fd.get("email") || "");
        const topic = String(fd.get("topic") || defaultTopic || "");

        try {
            const res = await fetch("/api/answer-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question,
                    email,
                    topic,
                    source: "answer-slug",
                }),
            });

            if (!res.ok) throw new Error("bad");
            setDone("ok");
            e.currentTarget.reset();
        } catch {
            setDone("err");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="rounded-2xl border border-white/10 bg-[#0b0b10] p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Still not sure?
            </div>

            <h3 className="mt-4 text-lg font-semibold">
                Ask your question (we’ll add it to Answers)
            </h3>
            <p className="mt-1 text-sm text-white/60">
                If this answer didn’t fit your exact situation, drop your question and we’ll publish a clean reply.
            </p>

            <form onSubmit={onSubmit} className="mt-5 grid gap-3">
        <textarea
            name="question"
            required
            rows={3}
            placeholder="Type your question…"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 placeholder:text-white/35 outline-none focus:ring-2 focus:ring-purple-500/60"
        />

                <div className="grid gap-3 sm:grid-cols-2">
                    <input
                        name="topic"
                        defaultValue={defaultTopic || ""}
                        placeholder="Topic (optional)"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 placeholder:text-white/35 outline-none focus:ring-2 focus:ring-purple-500/60"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email (optional)"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 placeholder:text-white/35 outline-none focus:ring-2 focus:ring-purple-500/60"
                    />
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:border-purple-500/40 hover:text-white transition disabled:opacity-60"
                >
                    {loading ? "Submitting..." : "Submit"} <span aria-hidden>→</span>
                </button>

                {done === "ok" && (
                    <p className="text-sm text-white/70">✅ Received. We’ll post an answer soon.</p>
                )}
                {done === "err" && (
                    <p className="text-sm text-white/60">❌ Something went wrong. Try again.</p>
                )}
            </form>
        </section>
    );
}

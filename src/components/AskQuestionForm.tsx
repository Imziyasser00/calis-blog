"use client";

import { useState } from "react";

export default function AskQuestionForm() {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState<null | "ok" | "err">(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setDone(null);

        const fd = new FormData(e.currentTarget);
        const question = String(fd.get("question") || "");
        const email = String(fd.get("email") || "");
        const topic = String(fd.get("topic") || "");

        try {
            const res = await fetch("/api/answer-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, email, topic, source: "answers-form" }),
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
        <form onSubmit={onSubmit} className="mt-6 grid gap-3 max-w-2xl">
      <textarea
          name="question"
          required
          rows={4}
          placeholder="Type your calisthenics question… (be specific)"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 placeholder:text-white/35 outline-none focus:ring-2 focus:ring-purple-500/60"
      />

            <input
                name="topic"
                placeholder="Topic (optional) e.g. pull-ups, core, beginner routine"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 placeholder:text-white/35 outline-none focus:ring-2 focus:ring-purple-500/60"
            />

            <input
                type="email"
                name="email"
                placeholder="Email (optional, if you want a reply)"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 placeholder:text-white/35 outline-none focus:ring-2 focus:ring-purple-500/60"
            />

            <button
                disabled={loading}
                type="submit"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:border-purple-500/40 hover:text-white transition disabled:opacity-60"
            >
                {loading ? "Submitting..." : "Submit question"} <span aria-hidden>→</span>
            </button>

            {done === "ok" && (
                <p className="text-sm text-white/70">
                    ✅ Got it. We’ll add an answer soon.
                </p>
            )}
            {done === "err" && (
                <p className="text-sm text-white/60">
                    ❌ Something went wrong. Try again.
                </p>
            )}

            <p className="text-xs text-white/45">
                No spam. Optional email only for follow-up.
            </p>
        </form>
    );
}

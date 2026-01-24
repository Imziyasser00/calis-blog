"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, X, Loader2 } from "lucide-react";
import { trackEvent } from "@calis/lib/analytics/track";

function isValidEmail(email: string) {
    return /^\S+@\S+\.\S+$/.test(email.trim().toLowerCase());
}

type Props = {
    // Keep this for your Library page (static PDFs)
    pdfUrl?: string;

    // New: for generator dynamic PDF creation
    onAfterUnlock?: () => Promise<void> | void;

    buttonClassName?: string;
    buttonLabel?: string;

    // Optional copy tweak
    title?: string;
    subtitle?: string;
};

export default function DownloadGate({
                                         pdfUrl,
                                         onAfterUnlock,
                                         buttonClassName,
                                         buttonLabel = "Download PDF",
                                         title = "Download the PDF",
                                         subtitle = "Enter your email to unlock your download.",
                                     }: Props) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [hp, setHp] = useState(""); // honeypot
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => isValidEmail(email) && !loading, [email, loading]);

    // handy metadata builder
    const gateMeta = useMemo(() => {
        const kind = onAfterUnlock ? "dynamic" : "static";
        return {
            kind,
            pdfUrl: pdfUrl ?? null,
            buttonLabel,
            title,
        };
    }, [onAfterUnlock, pdfUrl, buttonLabel, title]);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        if (open) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!isValidEmail(email)) {
            setError("Please enter a valid email.");
            return;
        }

        // basic bot trap
        if (hp) {
            setOpen(false);
            return;
        }

        // ---- analytics: submit attempt (valid email) ----
        trackEvent("download_gate_submit", {
            ...gateMeta,
            emailDomain: email.split("@")[1]?.toLowerCase() ?? null, // not PII, still useful
        });

        setLoading(true);
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || !data?.ok) {
                trackEvent("newsletter_subscribe_error", {
                    ...gateMeta,
                    status: res.status,
                    error: data?.error ?? "subscribe_failed",
                });
                throw new Error(data?.error || "Could not subscribe. Try again.");
            }

            // ---- analytics: subscribe success ----
            trackEvent("newsletter_subscribe_success", {
                ...gateMeta,
            });

            // download after successful save
            if (onAfterUnlock) {
                await onAfterUnlock();

                // ---- analytics: download triggered (dynamic) ----
                trackEvent("pdf_download", {
                    ...gateMeta,
                    method: "onAfterUnlock",
                });
            } else if (pdfUrl) {
                const a = document.createElement("a");
                a.href = pdfUrl;
                a.download = "";
                document.body.appendChild(a);
                a.click();
                a.remove();

                // ---- analytics: download triggered (static) ----
                trackEvent("pdf_download", {
                    ...gateMeta,
                    method: "anchor_click",
                });
            } else {
                trackEvent("pdf_download_error", {
                    ...gateMeta,
                    error: "no_download_action",
                });
                throw new Error("No download action provided.");
            }

            setOpen(false);
            setEmail("");
            setHp("");
        } catch (err: any) {
            setError(err?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    // ---- analytics: gate opened ----
                    trackEvent("download_gate_open", gateMeta);
                    setOpen(true);
                }}
                className={
                    buttonClassName ??
                    "inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                }
            >
                <Download className="h-4 w-4" />
                {buttonLabel}
            </button>

            {open && (
                <div className="fixed inset-0 z-50">
                    {/* backdrop */}
                    <button aria-label="Close" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/70" />

                    {/* modal */}
                    <div className="relative mx-auto mt-24 w-[92%] max-w-md rounded-2xl border border-white/10 bg-black/90 p-5 backdrop-blur">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-semibold">{title}</h3>
                                <p className="mt-1 text-sm text-white/60">{subtitle}</p>
                            </div>

                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-lg p-2 text-white/60 hover:text-white hover:bg-white/10"
                                aria-label="Close dialog"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="mt-4 space-y-3">
                            <label className="block text-sm text-white/70">
                                Email
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@email.com"
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>

                            {/* honeypot */}
                            <div className="hidden">
                                <label>
                                    Leave this empty
                                    <input value={hp} onChange={(e) => setHp(e.target.value)} />
                                </label>
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="inline-flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-60 disabled:hover:bg-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                {loading ? "Saving..." : "Download"}
                            </button>

                            <p className="text-xs text-white/45">No spam. Unsubscribe anytime.</p>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

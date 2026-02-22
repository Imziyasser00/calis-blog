"use client"

import { useMemo, useState } from "react"
import {
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Loader2,
    Mail,
    ShieldCheck,
    Zap,
    LineChart,
    Bell,
} from "lucide-react"

type Props = {
    apiPath?: string // default: "/api/waitlist"
    source?: string // default: "home_coming_soon_card"
    title?: string
    description?: string
}

function isEmail(v: string) {
    return /^\S+@\S+\.\S+$/.test(v)
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ")
}

export default function ComingSoonWaitlistCard({
                                                   apiPath = "/api/waitlist",
                                                   source = "home_coming_soon_card",
                                                   title = "Pull-Up Tracker App",
                                                   description =
                                                   "Coming soon: a lightweight mobile tracker to log sets, see progress charts, and stay consistent. Join the waitlist for early access.",
                                               }: Props) {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email])
    const validEmail = useMemo(() => isEmail(normalizedEmail), [normalizedEmail])

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validEmail || status === "loading") return

        setStatus("loading")
        setMessage("")

        try {
            const url = new URL(window.location.href)

            const utm = {
                source: url.searchParams.get("utm_source") || "",
                medium: url.searchParams.get("utm_medium") || "",
                campaign: url.searchParams.get("utm_campaign") || "",
                content: url.searchParams.get("utm_content") || "",
                term: url.searchParams.get("utm_term") || "",
            }

            const res = await fetch(apiPath, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: normalizedEmail,
                    source,
                    platform: "web",
                    locale: navigator.language || "",
                    utm,
                }),
            })

            const data = await res.json().catch(() => ({}))

            if (!res.ok || !data?.ok) {
                setStatus("error")
                setMessage(data?.error || "Something went wrong. Try again.")
                return
            }

            setStatus("success")
            setMessage("Saved. You’re on the waitlist ✅")
            setEmail("")
        } catch {
            setStatus("error")
            setMessage("Network error. Please try again.")
        }
    }

    return (
        <section
            aria-labelledby="coming-soon-waitlist"
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] shadow-2xl"
        >
            {/* Aesthetic background layer */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl opacity-30 bg-purple-600/40" />
                <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full blur-3xl opacity-30 bg-fuchsia-500/30" />
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(168,85,247,0.12),transparent_60%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.70))]" />
            </div>

            {/* Top highlight line */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-fuchsia-500/0 opacity-70"
            />

            <div className="p-6 md:p-8">
                <div className="grid lg:grid-cols-[1fr,440px] gap-8 lg:items-center">
                    {/* Left */}
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-purple-500" />
                            Coming soon
                            <span className="mx-1 text-white/30">•</span>
                            <span className="text-white/80">Mobile app</span>
                        </div>

                        <h2 id="coming-soon-waitlist" className="mt-4 text-2xl md:text-4xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
                {title}
              </span>
                        </h2>

                        <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed">
                            {description}
                        </p>

                        {/* Feature bullets (richer, icons) */}
                        <ul className="mt-6 grid gap-3 text-sm text-white/70">
                            <li className="flex items-start gap-3">
                <span className="mt-0.5 rounded-lg bg-emerald-500/10 p-1.5 ring-1 ring-emerald-500/20">
                  <Zap className="h-4 w-4 text-emerald-200" />
                </span>
                                <span>
                  <span className="text-white/90 font-medium">Fast logging</span>{" "}
                                    of sets, reps, and notes in seconds
                </span>
                            </li>
                            <li className="flex items-start gap-3">
                <span className="mt-0.5 rounded-lg bg-purple-500/10 p-1.5 ring-1 ring-purple-500/20">
                  <LineChart className="h-4 w-4 text-purple-200" />
                </span>
                                <span>
                  <span className="text-white/90 font-medium">Progress charts</span>{" "}
                                    with realistic milestones
                </span>
                            </li>
                            <li className="flex items-start gap-3">
                <span className="mt-0.5 rounded-lg bg-fuchsia-500/10 p-1.5 ring-1 ring-fuchsia-500/20">
                  <Bell className="h-4 w-4 text-fuchsia-200" />
                </span>
                                <span>
                  <span className="text-white/90 font-medium">Gentle reminders</span>{" "}
                                    and simple streaks (no clutter)
                </span>
                            </li>
                        </ul>

                        {/* Chips */}
                        <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/70">
                            {["Beginner-friendly", "No fluff UI", "Pull-up focused", "Progressive overload"].map((t) => (
                                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                  {t}
                </span>
                            ))}
                        </div>

                        <div className="mt-5 flex items-center gap-2 text-xs text-white/50">
                            <ShieldCheck className="h-4 w-4 text-white/50" />
                            <span>No spam. One email for launch. Unsubscribe anytime.</span>
                        </div>
                    </div>

                    {/* Right: form */}
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-5 md:p-6 backdrop-blur">
                            {/* inner glow */}
                            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(168,85,247,0.20),transparent_55%)]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.16),transparent_55%)]" />
                            </div>

                            <div className="relative">
                                <p className="text-xs uppercase tracking-wider text-white/50">Get early access</p>
                                <h3 className="mt-2 text-lg font-semibold text-white">Join the waitlist</h3>
                                <p className="mt-1 text-sm text-white/70">
                                    Drop your email. We’ll notify you when it’s ready.
                                </p>

                                {status === "success" ? (
                                    <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-100">
                                        <div className="flex items-start gap-3">
                      <span className="mt-0.5 rounded-lg bg-emerald-500/15 p-1.5 ring-1 ring-emerald-500/20">
                        <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                      </span>
                                            <div>
                                                <p className="text-sm font-medium">{message || "You’re in ✅"}</p>
                                                <p className="mt-1 text-xs text-emerald-100/80">
                                                    Want to help shape the app? Reply to the launch email with feature requests.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStatus("idle")
                                                setMessage("")
                                            }}
                                            className="mt-3 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 transition"
                                        >
                                            Add another email
                                            <ArrowRight className="ml-2 h-3.5 w-3.5 text-white/60" />
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={onSubmit} className="mt-4 space-y-3" aria-describedby="waitlist-help">
                                        <label className="block">
                                            <span className="sr-only">Email address</span>
                                            <div
                                                className={cn(
                                                    "flex items-center gap-2 rounded-xl border bg-white/5 px-3 py-2.5 transition",
                                                    "focus-within:ring-2 focus-within:ring-purple-500",
                                                    status === "error" ? "border-red-500/30" : "border-white/10"
                                                )}
                                            >
                                                <Mail className="h-4 w-4 text-white/50" />
                                                <input
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value)
                                                        if (status !== "idle") {
                                                            setStatus("idle")
                                                            setMessage("")
                                                        }
                                                    }}
                                                    type="email"
                                                    inputMode="email"
                                                    autoComplete="email"
                                                    placeholder="you@example.com"
                                                    className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                                                    aria-invalid={status === "error" ? true : undefined}
                                                />
                                                {validEmail && email.length > 3 ? (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                                                ) : null}
                                            </div>
                                        </label>

                                        <button
                                            type="submit"
                                            disabled={!validEmail || status === "loading"}
                                            className={cn(
                                                "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
                                                status === "loading" ? "bg-purple-600/80" : "bg-purple-600 hover:bg-purple-700",
                                                (!validEmail || status === "loading") && "disabled:opacity-60 disabled:hover:bg-purple-600"
                                            )}
                                        >
                                            {status === "loading" ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Saving…
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="h-4 w-4" />
                                                    Join waitlist
                                                    <ArrowRight className="h-4 w-4" />
                                                </>
                                            )}
                                        </button>

                                        <div className="flex items-start gap-2 text-xs text-white/50">
                                            <ShieldCheck className="mt-0.5 h-4 w-4 text-white/50" />
                                            <p id="waitlist-help">
                                                By joining, you agree to receive an email when the app launches.
                                            </p>
                                        </div>

                                        {/* Error message */}
                                        {status === "error" && message ? (
                                            <div
                                                className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-100"
                                                role="status"
                                                aria-live="polite"
                                            >
                                                {message}
                                            </div>
                                        ) : null}
                                    </form>
                                )}

                                {/* mini trust row */}
                                <div className="mt-5 flex items-center justify-between text-xs text-white/50">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                    Save to waitlist
                  </span>
                                    <span className="text-white/50">Takes 2 seconds</span>
                                </div>
                            </div>
                        </div>

                        <div aria-hidden="true" className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-purple-600/10 blur-2xl" />
                    </div>
                </div>
            </div>
        </section>
    )
}

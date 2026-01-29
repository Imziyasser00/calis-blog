import NewsletterForm from "./NewsletterForm";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function Newsletter() {
    return (
        <section id="newsletter" className="relative">
            {/* Background glow */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -inset-16 rounded-3xl opacity-40 blur-3xl bg-gradient-to-tr from-purple-700/20 via-purple-500/10 to-fuchsia-500/10" />
            </div>

            <div className="relative overflow-hidden rounded-2xl">
                {/* Gradient outline */}
                <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-purple-500/50 via-fuchsia-500/30 to-purple-500/50 [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] pointer-events-none" />

                {/* Card content */}
                <div className="relative z-10 rounded-2xl border border-white/10 bg-[#0b0b10]/70 p-6 sm:p-8 backdrop-blur">
                    <div className="grid gap-8 md:grid-cols-5 md:items-center">
                        {/* Left: copy (server-rendered = SEO win) */}
                        <div className="md:col-span-3 space-y-3">
                            <div className="inline-flex items-center gap-2 text-purple-300">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-xs uppercase tracking-wider">Beginner Strength Passport</span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold">
                                Get your 3-day starter plan & pull-up roadmap.
                            </h2>

                            <p className="text-white/65">
                                One simple PDF with a 3-day routine, a realistic roadmap to your first pull-up, and a habit checklist so
                                you don&apos;t fall off after week one. You&apos;ll also get occasional beginner-friendly tips from
                                CalisHub.
                            </p>

                            <div className="flex items-center gap-2 text-xs text-white/60">
                                <ShieldCheck className="h-4 w-4" />
                                <span>Privacy-friendly. No spam. One-click unsubscribe.</span>
                            </div>
                        </div>

                        {/* Right: form (client) */}
                        <div className="md:col-span-2">
                            <NewsletterForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

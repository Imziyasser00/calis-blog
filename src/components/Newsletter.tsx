"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@calis/components/ui/button";
import { Input } from "@calis/components/ui/input";
import { Mail, Sparkles, ShieldCheck } from "lucide-react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const handleSubscribe = async (e: FormEvent) => {
        e.preventDefault();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast("Invalid email", { description: "Please enter a valid email address." });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    intent: "beginner-strength-passport", // optional: helps you tag this in backend
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to subscribe");

            setIsSuccess(true);
            setEmail("");

            setTimeout(() => setIsSuccess(false), 3500);
        } catch (err: any) {
            toast("Something went wrong", { description: err?.message || "Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="newsletter" className="relative">
            {/* Background glow */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -inset-16 rounded-3xl opacity-40 blur-3xl bg-gradient-to-tr from-purple-700/20 via-purple-500/10 to-fuchsia-500/10" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative overflow-hidden rounded-2xl"
            >
                {/* Gradient outline */}
                <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-purple-500/50 via-fuchsia-500/30 to-purple-500/50 [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] pointer-events-none" />

                {/* Subtle animated shapes */}
                {!prefersReducedMotion && (
                    <>
                        <motion.div
                            className="absolute -top-20 -right-24 h-64 w-64 rounded-full bg-purple-500/10 blur-2xl"
                            animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-2xl"
                            animate={{ y: [0, 12, 0], x: [0, -12, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                        />
                    </>
                )}

                {/* Card content */}
                <div className="relative z-10 rounded-2xl border border-white/10 bg-[#0b0b10]/70 p-6 sm:p-8 backdrop-blur">
                    <div className="grid gap-8 md:grid-cols-5 md:items-center">
                        {/* Left: copy */}
                        <div className="md:col-span-3 space-y-3">
                            <div className="inline-flex items-center gap-2 text-purple-300">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-xs uppercase tracking-wider">
                                    Beginner Strength Passport
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold">
                                Get your 3-day starter plan & pull-up roadmap.
                            </h2>

                            <p className="text-white/65">
                                One simple PDF with a 3-day routine, a realistic roadmap to your first pull-up,
                                and a habit checklist so you don&apos;t fall off after week one. You&apos;ll also
                                get occasional beginner-friendly tips from CalisHub.
                            </p>

                            <div className="flex items-center gap-2 text-xs text-white/60">
                                <ShieldCheck className="h-4 w-4" />
                                <span>Privacy-friendly. No spam. One-click unsubscribe.</span>
                            </div>
                        </div>

                        {/* Right: form */}
                        <div className="md:col-span-2">
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                                <div className="group relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/45">
                                        <Mail className="h-4 w-4" />
                                    </div>

                                    <Input
                                        type="email"
                                        inputMode="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        className="bg-black/50 border-white/10 pl-9 h-11 focus-visible:ring-purple-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        aria-label="Email address"
                                        required
                                    />

                                    <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-transparent transition group-focus-within:ring-purple-500/40" />
                                </div>

                                <motion.div
                                    whileHover={{ y: prefersReducedMotion ? 0 : -1 }}
                                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                                    className="inline-flex"
                                >
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="h-11 w-full cursor-pointer bg-purple-600 hover:bg-purple-700 disabled:opacity-80"
                                    >
                                        {isSubmitting ? "Sending…" : "Send my passport"}
                                    </Button>
                                </motion.div>

                                <p className="text-xs text-white/45">
                                    You&apos;ll receive the PDF by email and 1–2 helpful updates per month.
                                </p>

                                {/* Success inline message */}
                                <motion.div
                                    initial={false}
                                    animate={{
                                        opacity: isSuccess ? 1 : 0,
                                        y: isSuccess ? 0 : -4,
                                        height: isSuccess ? "auto" : 0,
                                    }}
                                    className="overflow-hidden text-sm"
                                >
                                    {isSuccess && (
                                        <div className="rounded-md border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-purple-200">
                                            🎉 Passport sent! Check your inbox (and spam folder) in the next minute.
                                        </div>
                                    )}
                                </motion.div>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

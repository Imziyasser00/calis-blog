"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@calis/components/ui/button";
import { Input } from "@calis/components/ui/input";
import { Mail } from "lucide-react";

export default function NewsletterForm() {
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
                    intent: "beginner-strength-passport",
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

            <p className="text-xs text-white/45">You&apos;ll receive the PDF by email and 1–2 helpful updates per month.</p>

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
    );
}

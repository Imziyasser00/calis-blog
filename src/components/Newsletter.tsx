"use client"

import { useState, useRef, type FormEvent } from "react"
import { Button } from "@calis/components/ui/button"
import { Input } from "@calis/components/ui/input"
import { toast } from "sonner"

export default function Newsletter() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const newsletterRef = useRef<HTMLElement>(null)

    const handleSubscribe = async (e: FormEvent) => {
        e.preventDefault()
        if (!email || !email.includes("@")) {
            toast( "Invalid email",{
                description: "Please enter a valid email address.",
            })

            return
        }
        setIsSubmitting(true)

        // TODO: replace with your real subscribe endpoint (Formspree, API route, etc.)
        setTimeout(() => {
            toast("Subscription successful!", {
                description: "hank you for subscribing to our newsletter.",
            })
            setEmail("")
            setIsSubmitting(false)
        }, 800)
    }

    return (
        <section ref={newsletterRef} id="newsletter" className="bg-gray-900 rounded-xl p-8 mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Stay Updated</h2>
                    <p className="text-gray-400">
                        Subscribe to our newsletter to receive the latest calisthenics guides, tutorials, and gear reviews.
                    </p>
                </div>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-black border-gray-800 focus-visible:ring-purple-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap" disabled={isSubmitting}>
                        {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </Button>
                </form>
            </div>
        </section>
    )
}

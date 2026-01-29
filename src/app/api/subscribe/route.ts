import { NextResponse } from "next/server"
import { serverClient } from "@calis/lib/sanity.server"
import crypto from "crypto"
import { sendWelcomeEmail } from "@calis/lib/mail"

export const dynamic = "force-dynamic"

type Body = { email?: string }

function isEmail(v: string) {
    return /^\S+@\S+\.\S+$/.test(v)
}

function idForEmail(email: string) {
    const norm = email.trim().toLowerCase()
    const hash = crypto.createHash("sha256").update(norm).digest("hex").slice(0, 24)
    return `subscriber.${hash}`
}

function getClientIp(req: Request) {
    const xf = req.headers.get("x-forwarded-for") || ""
    const first = xf.split(",")[0]?.trim()
    const xri = req.headers.get("x-real-ip") || ""
    return first || xri || ""
}

function maskIp(ip: string) {
    if (!ip) return ""
    if (ip.includes(":")) {
        const parts = ip.split(":")
        const kept = parts.slice(0, 4).join(":")
        return `${kept}::/64`
    }
    return ip.replace(/\.\d+$/, ".***")
}

export async function POST(req: Request) {
    try {
        const { email }: Body = await req.json()

        if (!email || !isEmail(email)) {
            return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const now = new Date().toISOString()
        const _id = idForEmail(normalizedEmail)

        const ipRaw = getClientIp(req)
        const maskedIp = maskIp(ipRaw)
        const userAgent = (req.headers.get("user-agent") || "").slice(0, 500)

        const baseDoc = {
            _id,
            _type: "subscriber",
            email: normalizedEmail,
            createdAt: now,
            source: "newsletter",
            ip: maskedIp,
            userAgent,
            welcomeSentAt: null,
        }

        // Create if not exists (idempotent)
        const existingOrCreated = await serverClient.createIfNotExists(baseDoc)

        // Patch missing telemetry if needed
        const needsPatch =
            (!existingOrCreated.ip && maskedIp) ||
            (!existingOrCreated.userAgent && userAgent)

        if (needsPatch) {
            await serverClient
                .patch(_id)
                .set({
                    ip: existingOrCreated.ip || maskedIp,
                    userAgent: existingOrCreated.userAgent || userAgent,
                })
                .commit()
        }

        // ✅ Send welcome email ONLY ONCE
        if (!existingOrCreated.welcomeSentAt) {
            await sendWelcomeEmail(normalizedEmail)

            await serverClient
                .patch(_id)
                .set({ welcomeSentAt: now })
                .commit()
        }

        return NextResponse.json({ ok: true, id: _id })
    } catch (e: any) {
        console.error("Subscribe error", e)
        return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
    }
}

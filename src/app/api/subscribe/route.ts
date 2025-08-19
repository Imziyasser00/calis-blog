import { NextResponse } from "next/server"
import { serverClient } from "@calis/lib/sanity.server"
import crypto from "crypto"

export const dynamic = "force-dynamic" // avoid any caching

type Body = { email?: string }

function isEmail(v: string) {
    return /^\S+@\S+\.\S+$/.test(v)
}

function idForEmail(email: string) {
    const norm = email.trim().toLowerCase()
    // deterministic id so we can upsert/patch cleanly
    const hash = crypto.createHash("sha256").update(norm).digest("hex").slice(0, 24)
    return `subscriber.${hash}`
}

function getClientIp(req: Request) {
    const xf = req.headers.get("x-forwarded-for") || ""
    // x-forwarded-for can be "ip, ip, ip"
    const first = xf.split(",")[0]?.trim()
    const xri = req.headers.get("x-real-ip") || ""
    return first || xri || ""
}

function maskIp(ip: string) {
    if (!ip) return ""
    // IPv6?
    if (ip.includes(":")) {
        // Keep first few hextets; mask the rest
        const parts = ip.split(":")
        const kept = parts.slice(0, 4).join(":")
        return `${kept}::/64`
    }
    // IPv4
    return ip.replace(/\.\d+$/, ".***")
}

export async function POST(req: Request) {
    try {
        const { email }: Body = await req.json()
        if (!email || !isEmail(email)) {
            return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 })
        }

        const now = new Date().toISOString()
        const _id = idForEmail(email)
        const ipRaw = getClientIp(req)
        const maskedIp = maskIp(ipRaw)
        const userAgent = (req.headers.get("user-agent") || "").slice(0, 500)

        // Try to create the doc if it doesn't exist
        const baseDoc = {
            _id,
            _type: "subscriber",
            email: email.trim().toLowerCase(),
            createdAt: now,
            source: "newsletter",
            ip: maskedIp,
            userAgent,
        }

        // First attempt: create if not exists (idempotent)
        const created = await serverClient.createIfNotExists(baseDoc)

        // If it already existed, created === existing doc.
        // Ensure ip / userAgent are set (in case early versions didn’t include them)
        const needsPatch =
            (!created.ip && maskedIp) || (!created.userAgent && userAgent)

        if (needsPatch) {
            await serverClient
                .patch(_id)
                .set({
                    ip: created.ip || maskedIp,
                    userAgent: created.userAgent || userAgent,
                })
                .commit()
        }

        return NextResponse.json({ ok: true, id: _id })
    } catch (e: any) {
        console.error("Subscribe error", e)
        return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
    }
}

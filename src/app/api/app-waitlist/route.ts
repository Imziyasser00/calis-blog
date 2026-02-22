import { NextResponse } from "next/server"
import crypto from "crypto"
import { serverClient } from "@calis/lib/sanity.server"

export const dynamic = "force-dynamic"

type Body = {
    email?: string
    source?: string // e.g. "app_waitlist_screen" | "landing_page" | ...
    platform?: "ios" | "android" | "web" | "unknown"
    appVersion?: string
    locale?: string
    utm?: {
        source?: string
        medium?: string
        campaign?: string
        content?: string
        term?: string
    }
}

function isEmail(v: string) {
    return /^\S+@\S+\.\S+$/.test(v)
}

function idForEmail(email: string) {
    const norm = email.trim().toLowerCase()
    const hash = crypto.createHash("sha256").update(norm).digest("hex").slice(0, 24)
    return `appWaitlistSubscriber.${hash}`
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

function clamp(s: unknown, max: number) {
    if (typeof s !== "string") return ""
    return s.slice(0, max)
}

export async function POST(req: Request) {
    try {
        const body: Body = await req.json().catch(() => ({}))

        const email = (body.email || "").trim().toLowerCase()
        if (!email || !isEmail(email)) {
            return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 })
        }

        const now = new Date().toISOString()
        const _id = idForEmail(email)

        const ipRaw = getClientIp(req)
        const ipMasked = maskIp(ipRaw)
        const userAgent = clamp(req.headers.get("user-agent") || "", 500)

        const source = clamp(body.source || "app_waitlist", 80)
        const platform = body.platform ?? "unknown"
        const appVersion = clamp(body.appVersion || "", 40)
        const locale = clamp(body.locale || "", 20)

        const utm =
            body.utm && typeof body.utm === "object"
                ? {
                    source: clamp(body.utm.source || "", 80),
                    medium: clamp(body.utm.medium || "", 80),
                    campaign: clamp(body.utm.campaign || "", 120),
                    content: clamp(body.utm.content || "", 120),
                    term: clamp(body.utm.term || "", 120),
                }
                : undefined

        const hasUtm = utm ? Object.values(utm).some(Boolean) : false

        const baseDoc = {
            _id,
            _type: "appWaitlistSubscriber",
            email,

            status: "pending",
            createdAt: now,
            confirmedAt: null,
            unsubscribedAt: null,

            source,
            platform,
            appVersion: appVersion || undefined,
            locale: locale || undefined,
            utm: hasUtm ? utm : undefined,

            ipMasked: ipMasked || undefined,
            userAgent: userAgent || undefined,

            tags: [],
            notes: "",
            welcomeSentAt: null, // keep if your schema has it; otherwise remove it
        }

        // ✅ Create once (idempotent)
        const existingOrCreated = await serverClient.createIfNotExists(baseDoc)

        // 🧩 Patch missing telemetry (fill blanks only)
        const patch: Record<string, any> = {}

        if (!existingOrCreated.source && source) patch.source = source
        if (!existingOrCreated.platform && platform) patch.platform = platform
        if (!existingOrCreated.appVersion && appVersion) patch.appVersion = appVersion
        if (!existingOrCreated.locale && locale) patch.locale = locale
        if (!existingOrCreated.ipMasked && ipMasked) patch.ipMasked = ipMasked
        if (!existingOrCreated.userAgent && userAgent) patch.userAgent = userAgent
        if (!existingOrCreated.utm && hasUtm) patch.utm = utm

        if (Object.keys(patch).length > 0) {
            await serverClient.patch(_id).set(patch).commit()
        }

        return NextResponse.json({
            ok: true,
            id: _id,
            created: existingOrCreated._createdAt ? existingOrCreated._createdAt === now : undefined,
        })
    } catch (e: any) {
        console.error("Waitlist subscribe error", e)
        return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
    }
}

import { NextResponse } from "next/server"
import { serverClient } from "@calis/lib/sanity.server"
import crypto from "crypto"

export const dynamic = "force-dynamic"

type Body = {
    question?: string
    email?: string
    topic?: string
    source?: string // optional: "answers-form" | "homepage" ...
}

function isEmail(v: string) {
    return /^\S+@\S+\.\S+$/.test(v)
}

function normalizeText(v: string) {
    return v.trim().replace(/\s+/g, " ")
}

function isValidQuestion(q: string) {
    const len = q.length
    return len >= 10 && len <= 220
}

function idForQuestion(question: string, email?: string) {
    // Stable id to avoid duplicates if user submits same question again
    const base = normalizeText(question).toLowerCase()
    const normEmail = (email || "").trim().toLowerCase()
    const hash = crypto.createHash("sha256").update(`${base}|${normEmail}`).digest("hex").slice(0, 24)
    return `answerRequest.${hash}`
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
        const body: Body = await req.json()

        const questionRaw = body.question ? String(body.question) : ""
        const question = normalizeText(questionRaw)

        const emailRaw = body.email ? String(body.email) : ""
        const email = emailRaw.trim().toLowerCase()

        const topicRaw = body.topic ? String(body.topic) : ""
        const topic = topicRaw ? normalizeText(topicRaw) : ""

        const source = body.source ? String(body.source).slice(0, 60) : "answers-form"

        if (!question || !isValidQuestion(question)) {
            return NextResponse.json(
                { ok: false, error: "Invalid question (10–220 chars)" },
                { status: 400 }
            )
        }

        if (email && !isEmail(email)) {
            return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 })
        }

        const now = new Date().toISOString()
        const _id = idForQuestion(question, email || undefined)

        const ipRaw = getClientIp(req)
        const maskedIp = maskIp(ipRaw)
        const userAgent = (req.headers.get("user-agent") || "").slice(0, 500)

        const baseDoc = {
            _id,
            _type: "answerRequest",
            question,
            email: email || null,
            topic: topic || null,
            status: "new",
            createdAt: now,
            source,
            ip: maskedIp,
            userAgent,
            // optional fields for later workflow
            answeredAt: null,
            answerPageRef: null,
        }

        // Create if not exists (idempotent)
        const existingOrCreated = await serverClient.createIfNotExists(baseDoc)

        // Patch missing telemetry if needed
        const needsPatch =
            (!existingOrCreated.ip && maskedIp) ||
            (!existingOrCreated.userAgent && userAgent) ||
            (!existingOrCreated.source && source)

        if (needsPatch) {
            await serverClient
                .patch(_id)
                .set({
                    ip: existingOrCreated.ip || maskedIp,
                    userAgent: existingOrCreated.userAgent || userAgent,
                    source: existingOrCreated.source || source,
                })
                .commit()
        }

        return NextResponse.json({ ok: true, id: _id })
    } catch (e: any) {
        console.error("Answer request error", e)
        return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
    }
}

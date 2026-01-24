import { NextResponse } from "next/server";
import { supabaseServer } from "@calis/lib/supabase/server";

type TrackPayload = {
    sessionId?: string;
    session_id?: string;

    eventType?: string;
    event_type?: string;

    path?: string;
    referrer?: string;
    source?: string;

    utm?: Partial<Record<"source" | "medium" | "campaign" | "content" | "term", string>>;
    metadata?: Record<string, any>;
};

function isValidEventType(v: string) {
    return /^[a-z0-9_]{3,48}$/.test(v);
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as TrackPayload;

        const sessionId = body.sessionId ?? body.session_id;
        const eventType = body.eventType ?? body.event_type;

        // 🔎 debug (shows in your terminal)
        console.log("[/api/track] incoming:", { sessionId, eventType, body });

        if (!sessionId || !eventType || !isValidEventType(eventType)) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Invalid payload",
                    details: {
                        sessionIdPresent: Boolean(sessionId),
                        eventType,
                        eventTypeValid: Boolean(eventType && isValidEventType(eventType)),
                    },
                },
                { status: 400 }
            );
        }

        const sb = supabaseServer();

        const { error: evErr } = await sb.from("events").insert({
            session_id: sessionId,
            event_type: eventType,
            source: body.source ?? "web",
            path: body.path ?? null,
            referrer: body.referrer ?? null,
            utm_source: body.utm?.source ?? null,
            utm_medium: body.utm?.medium ?? null,
            utm_campaign: body.utm?.campaign ?? null,
            utm_content: body.utm?.content ?? null,
            utm_term: body.utm?.term ?? null,
            metadata: body.metadata ?? {},
        });

        if (evErr) {
            return NextResponse.json({ ok: false, error: evErr.message }, { status: 500 });
        }

        // optional sessions upsert
        await sb.from("sessions").upsert(
            {
                session_id: sessionId,
                last_seen: new Date().toISOString(),
                landing_path: body.path ?? null,
                utm_source: body.utm?.source ?? null,
                utm_medium: body.utm?.medium ?? null,
                utm_campaign: body.utm?.campaign ?? null,
                utm_content: body.utm?.content ?? null,
                utm_term: body.utm?.term ?? null,
            },
            { onConflict: "session_id" }
        );

        return NextResponse.json({ ok: true });
     } catch (e: any) {
    console.error("[/api/track] error:", e?.message ?? e)
    return NextResponse.json(
        { ok: false, error: e?.message ?? "Unknown error" },
        { status: 500 }
    )
}

}

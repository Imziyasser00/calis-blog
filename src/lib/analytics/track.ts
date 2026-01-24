function getOrCreateSessionId() {
    if (typeof window === "undefined") return "server";
    const key = "ch_session_id";
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
    }
    return id;
}

function getUtm() {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);

    // store once per session (so UTM stays even after navigation)
    const key = "ch_utm";
    const existing = localStorage.getItem(key);
    if (existing) return JSON.parse(existing);

    const utm = {
        source: params.get("utm_source") ?? undefined,
        medium: params.get("utm_medium") ?? undefined,
        campaign: params.get("utm_campaign") ?? undefined,
        content: params.get("utm_content") ?? undefined,
        term: params.get("utm_term") ?? undefined,
    };

    localStorage.setItem(key, JSON.stringify(utm));
    return utm;
}

export async function trackEvent(
    eventType: string,
    metadata: Record<string, any> = {},
    opts: { path?: string } = {}
) {
    if (typeof window === "undefined") return;

    // don’t block UX if tracking fails
    try {
        const sessionId = getOrCreateSessionId();
        const utm = getUtm();

        await fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionId,
                eventType,
                source: "web",
                path: opts.path ?? window.location.pathname,
                referrer: document.referrer || undefined,
                utm,
                metadata,
            }),
            keepalive: true,
        });
    } catch {
        // silent fail
    }
}

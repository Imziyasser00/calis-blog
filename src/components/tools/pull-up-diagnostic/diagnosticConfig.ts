import type { BlockerKey, DiagnosticResult, TrainDays } from "./types";

export const BLOCKER_ORDER: BlockerKey[] = [
    "grip",
    "eccentric",
    "scap",
    "strength",
    "topRange",
    "bodyweight",
];

export const blockerLabels: Record<BlockerKey, string> = {
    grip: "Grip & Hang Strength",
    eccentric: "Eccentric Strength (Negatives)",
    scap: "Scapular Control / Lat Activation",
    strength: "Raw Pulling Strength (Mid-range)",
    topRange: "Top Range Weakness",
    bodyweight: "Bodyweight / Leverage",
};

export const blockerCopy: Record<
    BlockerKey,
    { title: string; explanation: string; focus: string[] }
> = {
    grip: {
        title: "Your grip is the limiter.",
        explanation:
            "Your pulling muscles might be ready, but your hands and hang endurance are tapping out first.",
        focus: ["Dead hangs", "Active hangs", "Frequent low-fatigue practice"],
    },
    eccentric: {
        title: "You’re missing controlled strength on the way down.",
        explanation:
            "If you can’t resist the descent, full reps won’t stick yet. Negatives build the base fast.",
        focus: ["Slow negatives", "Isometrics", "Quality reps (no rushing)"],
    },
    scap: {
        title: "You’re pulling with arms instead of lats.",
        explanation:
            "Without scapular control, you can’t “lock in” your back muscles. That makes pull-ups feel impossible.",
        focus: ["Active hang", "Scapular pulls", "Clean form cues"],
    },
    strength: {
        title: "You need more raw pulling strength.",
        explanation:
            "Getting stuck mid-range usually means a strength gap. We’ll bridge it with focused volume.",
        focus: ["Negatives", "Isometrics", "Progressive volume"],
    },
    topRange: {
        title: "You’re missing the last 20% (top range).",
        explanation:
            "You can pull, but finishing requires specific strength near the bar.",
        focus: ["Top holds", "Partials near the top", "Slow eccentrics"],
    },
    bodyweight: {
        title: "Bodyweight is making the reps harder right now.",
        explanation:
            "Pull-ups are sensitive to bodyweight. A bit more strength and consistency can change everything.",
        focus: ["Strength consistency", "Smart volume", "Optional bodyweight management"],
    },
};

type RoadmapItem = { label: string; sets: string };
type RoadmapWeek = { title: string; items: RoadmapItem[] };

type Roadmaps = {
    low: RoadmapWeek[]; // 1–2 days/week
    high: RoadmapWeek[]; // 3–4+ days/week
};

export const roadmaps: Record<BlockerKey, Roadmaps> = {
    grip: {
        low: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Dead hang", sets: "5×10–25s" },
                    { label: "Active hang", sets: "4×10–20s" },
                    { label: "Negatives", sets: "3×2 (3–5s down)" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Dead hang", sets: "5×20–40s" },
                    { label: "Active hang", sets: "4×15–30s" },
                    { label: "Negatives", sets: "4×2 (5–7s down)" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                ],
            },
        ],
        high: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Dead hang", sets: "6×10–25s (daily-ish)" },
                    { label: "Active hang", sets: "5×10–20s" },
                    { label: "Negatives", sets: "4×2 (3–5s down)" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Dead hang", sets: "6×20–45s" },
                    { label: "Active hang", sets: "5×15–30s" },
                    { label: "Negatives", sets: "5×2 (5–8s down)" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                ],
            },
        ],
    },

    eccentric: {
        low: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Negatives", sets: "5×2 (3–5s down)" },
                    { label: "Top hold (optional)", sets: "4×5–10s" },
                    { label: "Active hang", sets: "4×10–20s" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Negatives", sets: "6×2 (5–8s down)" },
                    { label: "Mid-range isometric", sets: "4×6–10s" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                ],
            },
        ],
        high: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Negatives", sets: "6×2 (3–5s down)" },
                    { label: "Active hang", sets: "5×10–25s" },
                    { label: "Grease-the-groove", sets: "2–3 mini sets/day (easy)" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Negatives", sets: "7×2 (5–8s down)" },
                    { label: "Isometric holds", sets: "5×6–12s" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                ],
            },
        ],
    },

    scap: {
        low: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Active hang", sets: "4×15–25s" },
                    { label: "Scapular pulls", sets: "5×5 (slow)" },
                    { label: "Negatives", sets: "4×2 (3–5s down)" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Active hang", sets: "4×25–40s" },
                    { label: "Scapular pulls", sets: "5×6–8" },
                    { label: "Negatives", sets: "5×2 (5–7s down)" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                ],
            },
        ],
        high: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Active hang", sets: "5×15–30s" },
                    { label: "Scapular pulls", sets: "6×5 (slow)" },
                    { label: "Negatives", sets: "5×2 (3–5s down)" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Active hang", sets: "5×25–45s" },
                    { label: "Scapular pulls", sets: "6×6–10" },
                    { label: "Negatives", sets: "6×2 (5–8s down)" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                ],
            },
        ],
    },

    strength: {
        low: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Negatives", sets: "5×2 (3–6s down)" },
                    { label: "Mid-range hold", sets: "4×6–10s" },
                    { label: "Active hang", sets: "4×15–25s" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Negatives", sets: "6×2 (5–8s down)" },
                    { label: "Mid-range hold", sets: "5×8–12s" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                ],
            },
        ],
        high: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Negatives", sets: "6×2 (3–6s down)" },
                    { label: "Mid-range hold", sets: "5×6–10s" },
                    { label: "Easy practice", sets: "2 mini sets/day (easy)" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Negatives", sets: "7×2 (5–8s down)" },
                    { label: "Mid-range hold", sets: "6×8–12s" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                ],
            },
        ],
    },

    topRange: {
        low: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Top holds", sets: "6×5–10s" },
                    { label: "Top partials", sets: "5×3–5 reps (small range)" },
                    { label: "Negatives", sets: "4×2 (3–6s down)" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Top holds", sets: "7×8–12s" },
                    { label: "Top partials", sets: "6×4–6 reps" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                ],
            },
        ],
        high: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Top holds", sets: "7×5–10s" },
                    { label: "Top partials", sets: "6×3–6 reps" },
                    { label: "Negatives", sets: "5×2 (3–6s down)" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Top holds", sets: "8×8–12s" },
                    { label: "Top partials", sets: "7×4–8 reps" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                ],
            },
        ],
    },

    bodyweight: {
        low: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Negatives", sets: "5×2 (3–6s down)" },
                    { label: "Active hang", sets: "4×15–25s" },
                    { label: "Weekly habit", sets: "2 sessions/week, consistent" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Negatives", sets: "6×2 (5–8s down)" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                    { label: "Optional", sets: "Small calorie deficit if fat-loss goal" },
                ],
            },
        ],
        high: [
            {
                title: "Weeks 1–2",
                items: [
                    { label: "Negatives", sets: "6×2 (3–6s down)" },
                    { label: "Active hang", sets: "5×15–30s" },
                    { label: "Easy practice", sets: "2 mini sets/day (easy)" },
                ],
            },
            {
                title: "Weeks 3–4",
                items: [
                    { label: "Negatives", sets: "7×2 (5–8s down)" },
                    { label: "Test", sets: "1 max attempt end of week 4" },
                    { label: "Optional", sets: "Bodyweight trend downward slowly" },
                ],
            },
        ],
    },
};

export function roadmapTier(trainDays: TrainDays) {
    return trainDays <= 2 ? "low" : "high";
}

export function painNote(result: DiagnosticResult): string | null {
    if (result.pain === "none") return null;

    const map = {
        elbow:
            "Pain note: If elbows hurt, reduce volume, avoid aggressive negatives, and prioritize clean form + recovery.",
        shoulder:
            "Pain note: If shoulders hurt, stop any sharp pain, keep range comfortable, and focus on scap control and technique.",
        wrist:
            "Pain note: If wrists/hands hurt, reduce hanging volume and build tolerance gradually (shorter hangs, more rest).",
    } as const;

    return map[result.pain];
}

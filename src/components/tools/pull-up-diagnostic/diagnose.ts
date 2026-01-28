import type {
    Answers,
    BlockerKey,
    DiagnosticResult,
} from "./types";

function initScores(): Record<BlockerKey, number> {
    return {
        grip: 0,
        eccentric: 0,
        scap: 0,
        strength: 0,
        topRange: 0,
        bodyweight: 0,
    };
}

export function diagnose(answers: Answers): DiagnosticResult {
    const scores = initScores();
    const notes: string[] = [];

    // A) Grip & hang
    if (answers.hangTime === "<10") scores.grip += 4;
    if (answers.hangTime === "10-30") scores.grip += 2;
    if (answers.hangTime === "30-60") scores.grip += 1;

    if (answers.failPoint === "grip") scores.grip += 3;

    // B) Eccentric
    if (answers.negative === "no") scores.eccentric += 4;
    if (answers.negative === "kinda") scores.eccentric += 2;

    // C) Scap / activation
    if (answers.latFeel === "no") scores.scap += 4;
    if (answers.latFeel === "sometimes") scores.scap += 2;
    if (answers.failPoint === "start") scores.scap += 2;

    // D) Strength deficit
    const m = answers.maxPullups;
    if (m === 0) scores.strength += 3;
    else if (m >= 1 && m <= 3) scores.strength += 2;
    else if (m >= 4 && m <= 6) scores.strength += 1;

    if (answers.failPoint === "middle") scores.strength += 2;

    // E) Top range
    if (answers.failPoint === "top") scores.topRange += 4;

    // F) Bodyweight (gentle)
    if (typeof answers.weightKg === "number" && answers.maxPullups <= 2) {
        if (answers.weightKg >= 95) scores.bodyweight += 2;
        else if (answers.weightKg >= 80) scores.bodyweight += 1;
    }

    // Notes (pain)
    if (answers.pain !== "none") {
        notes.push("Prioritize pain-free range, clean technique, and recovery first.");
    }

    // Choose primary & secondary with tie-breakers
    const ranked = (Object.entries(scores) as Array<[BlockerKey, number]>)
        .sort((a, b) => b[1] - a[1]);

    let primary = ranked[0][0];
    let secondary = ranked[1][1] >= 3 ? ranked[1][0] : undefined;

    // Tie-breaker if top two equal
    if (ranked.length >= 2 && ranked[0][1] === ranked[1][1]) {
        // Priority based on fail point
        if (answers.failPoint === "start") primary = "scap";
        if (answers.failPoint === "grip") primary = "grip";
        if (answers.failPoint === "top") primary = "topRange";
        // Secondary recompute (best remaining >=3)
        secondary = (ranked.find(([k, v]) => k !== primary && v >= 3)?.[0]) as
            | BlockerKey
            | undefined;
    }

    // Add small helpful notes
    if (answers.trainDays === 1) notes.push("With 1 day/week, progress is slower. If possible, aim for 2 days/week.");
    if (answers.maxPullups >= 8) notes.push("You already have a base. Small tweaks can unlock more reps quickly.");

    return { primary, secondary, scores, pain: answers.pain, notes };
}

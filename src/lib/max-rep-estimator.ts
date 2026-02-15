// @calis/lib/max-rep-estimator.ts
export type EstimatorGoal = "strength" | "hypertrophy" | "endurance";
export type EstimatorExercise =
    | "pullup"
    | "chinup"
    | "dip"
    | "pushup"
    | "squat"
    | "pistol"
    | "row";

export type KnownType = "reps" | "hold"; // hold for isometrics (optional future)

export interface EstimatorForm {
    exercise: EstimatorExercise | "";
    knownType: KnownType;
    reps: number; // for reps
    addedLoadKg: number; // weighted belt, vest, etc.
    bodyweightKg: number;

    // advanced modifiers
    rir: number; // reps in reserve (0 = max)
    tempo: "normal" | "slow" | "explosive";
    restQuality: "good" | "ok" | "poor";

    goal: EstimatorGoal;
}

export interface RepPoint {
    reps: number;
    estLoadKg: number; // estimated load for that rep max (BW+load basis)
}

export interface EstimatorResult {
    title: string;
    exercise: EstimatorExercise;
    input: EstimatorForm;

    estimated1RMKg: number; // "1RM-equivalent total load" (BW + added load)
    estimatedBWPlusLoadKg: number; // current working total load from input (BW+added)
    strengthRatio: number; // 1RM / BW

    repTable: RepPoint[]; // 3/5/8/10/12
    suggestedWork: {
        range: string;
        intensityHint: string;
        setsHint: string;
    };
    notes: string[];
}

/**
 * Epley formula: 1RM = w * (1 + reps/30)
 * Brzycki: 1RM = w * 36 / (37 - reps)
 * We'll blend them lightly for stability and clamp reps.
 */
function estimate1RMBase(totalLoadKg: number, reps: number) {
    const r = Math.max(1, Math.min(20, reps));
    const epley = totalLoadKg * (1 + r / 30);
    const brzycki = totalLoadKg * (36 / (37 - r));
    return (epley * 0.55 + brzycki * 0.45);
}

/**
 * Apply "advanced" modifiers as small multipliers.
 * - RIR: if user had reps in reserve, true max is higher
 * - tempo slow: usually lowers reps at same intensity -> max may be a bit higher than it looks
 * - rest poor: lowers performance -> true max may be higher
 */
function applyModifiers(oneRM: number, form: EstimatorForm) {
    // RIR adjustment: each RIR ~ +2.5% (gentle)
    const rirBoost = 1 + Math.max(0, Math.min(5, form.rir)) * 0.025;

    const tempoBoost =
        form.tempo === "slow" ? 1.03 : form.tempo === "explosive" ? 1.01 : 1.0;

    const restBoost =
        form.restQuality === "poor" ? 1.03 : form.restQuality === "ok" ? 1.015 : 1.0;

    return oneRM * rirBoost * tempoBoost * restBoost;
}

function round(n: number) {
    return Math.round(n * 10) / 10;
}

function estimateLoadForReps(oneRM: number, reps: number) {
    // Invert Epley-ish: w = 1RM / (1 + reps/30)
    const r = Math.max(1, Math.min(20, reps));
    return oneRM / (1 + r / 30);
}

function prettyExercise(ex: EstimatorExercise) {
    switch (ex) {
        case "pullup": return "Pull-Up";
        case "chinup": return "Chin-Up";
        case "dip": return "Dip";
        case "pushup": return "Push-Up";
        case "squat": return "Bodyweight Squat";
        case "pistol": return "Pistol Squat";
        case "row": return "Inverted Row";
    }
}

function suggestWork(goal: EstimatorGoal, strengthRatio: number) {
    // slight personalization by strength ratio
    const advanced = strengthRatio >= 1.5;
    if (goal === "strength") {
        return {
            range: advanced ? "3–6 reps" : "4–8 reps",
            intensityHint: "RPE 7–9 (leave 1–3 reps in reserve most sets)",
            setsHint: advanced ? "4–7 sets • longer rests" : "3–6 sets • solid rests",
        };
    }
    if (goal === "hypertrophy") {
        return {
            range: "6–12 reps",
            intensityHint: "RPE 7–9 (close-ish to failure, controlled tempo)",
            setsHint: "3–5 sets • 60–120s rests",
        };
    }
    return {
        range: "12–20+ reps",
        intensityHint: "RPE 6–8 (volume focus, crisp technique)",
        setsHint: "2–4 sets • shorter rests",
    };
}

export function createMaxRepEstimate(form: EstimatorForm): EstimatorResult {
    const reps = Math.max(1, Math.min(30, Math.floor(form.reps || 1)));

    const totalLoad = Math.max(1, (form.bodyweightKg || 0) + (form.addedLoadKg || 0));
    const base = estimate1RMBase(totalLoad, reps);
    const adjusted = applyModifiers(base, form);

    const strengthRatio = adjusted / Math.max(1, form.bodyweightKg || 1);

    const repTargets = [3, 5, 8, 10, 12];
    const repTable = repTargets.map((r) => ({
        reps: r,
        estLoadKg: round(estimateLoadForReps(adjusted, r)),
    }));

    const notes: string[] = [];
    if ((form.bodyweightKg || 0) <= 0) notes.push("Bodyweight is required for accurate calisthenics estimates.");
    if (form.rir > 0) notes.push(`RIR adjustment applied (+${Math.round(form.rir * 2.5)}% approx).`);
    if (form.tempo === "slow") notes.push("Slow tempo selected, slightly boosting estimated max.");
    if (form.restQuality !== "good") notes.push("Rest quality considered (performance may be suppressed when rest is limited).");

    return {
        title: `${prettyExercise(form.exercise as EstimatorExercise)} Max-Rep Estimate`,
        exercise: form.exercise as EstimatorExercise,
        input: form,
        estimated1RMKg: round(adjusted),
        estimatedBWPlusLoadKg: round(totalLoad),
        strengthRatio: round(strengthRatio),
        repTable,
        suggestedWork: suggestWork(form.goal, strengthRatio),
        notes,
    };
}

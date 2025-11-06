import type { FormData, Plan } from "./types";

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// simple helpers
const S = (n: number, lvl: "beginner" | "intermediate" | "advanced") =>
    Math.max(2, lvl === "beginner" ? n - 1 : lvl === "advanced" ? n + 1 : n);

function reps(goal: string, base: string) {
    // base like "8-12" or "6-10" or "20-30"
    if (goal === "strength") {
        // skew lower
        if (base === "8-12") return "5-8";
        if (base === "6-10") return "4-6";
        if (base.includes("20-")) return "12-20";
        return base;
    }
    if (goal === "endurance") {
        if (base === "8-12") return "12-20";
        if (base === "6-10") return "8-12";
        if (base.includes("20-")) return "25-35";
        return base;
    }
    return base; // balanced/skills default
}

// choose weekly split labels given number of days
function splitForDays(days: number): string[] {
    if (days <= 2) return ["Full Body A", "Full Body B"].slice(0, days);
    if (days === 3) return ["Push", "Pull", "Legs & Core"];
    if (days === 4) return ["Upper", "Lower", "Upper", "Lower"];
    // 5 or 6: cycle PPL
    const cycle = ["Push", "Pull", "Legs & Core"];
    return Array.from({ length: days }, (_, i) => cycle[i % 3]);
}

export function createWorkoutPlan(data: FormData): Plan {
    const level = (data.level || "beginner") as "beginner" | "intermediate" | "advanced";
    const goal = data.goal || "balanced";
    const days = Math.max(2, Math.min(6, data.days || 3));
    const hasBar = data.equipment.includes("pull-up-bar");
    const hasRings = data.equipment.includes("rings");
    const hasPBars = data.equipment.includes("parallel-bars");
    const noEq = data.equipment.includes("none");

    // building blocks ***********************************************************

    // Pull block options by level/equipment
    const pullBlock = (): { name: string; sets: number; reps: string }[] => {
        if (!hasBar && !hasRings) {
            // no vertical pulling available
            return [
                { name: "Bodyweight Rows (table)", sets: S(4, level), reps: reps(goal, "10-15") },
                { name: "Towel Rows / Door Rows", sets: 3, reps: reps(goal, "8-12") },
                { name: "Reverse Snow Angels (floor)", sets: 3, reps: "12-20" },
                { name: "Dead Hang—Chair Support (if doorframe)", sets: 3, reps: "20-40s" },
            ];
        }

        // bar or rings available
        if (level === "beginner") {
            const base = [
                { name: hasRings ? "Ring Rows" : "Australian Rows", sets: S(4, level), reps: reps(goal, "10-15") },
                { name: (hasRings ? "Ring" : "Bar") + " Scapular Pulls", sets: 3, reps: "8-12" },
            ];
            // gentle vertical pull exposure
            base.push(
                { name: "Assisted Pull-up (band/chair)", sets: 3, reps: reps(goal, "3-6") },
                { name: "Negative Pull-ups (3–5s down)", sets: 2, reps: "3-5" },
            );
            return base;
        }

        if (level === "intermediate") {
            const arr = [
                { name: hasRings ? "Ring Rows (feet forward)" : "Chest-to-Bar Rows (bar hip height)", sets: S(3, level), reps: reps(goal, "8-12") },
                { name: "Pull-ups / Chin-ups", sets: S(3, level), reps: reps(goal, "5-8") },
                { name: "Isometric Top Hold (chin over bar)", sets: 2, reps: "10-20s" },
            ];
            if (goal === "skills") arr.push({ name: "Muscle-up Transition Drills (low rings)", sets: 3, reps: "3-6" });
            return ensureAtLeastFour(arr, { name: "Face Pulls (band/rings)", sets: 2, reps: "12-20" });
        }

        // advanced
        const arr = [
            { name: "Weighted Pull-ups", sets: S(4, level), reps: reps(goal, "4-6") },
            { name: hasRings ? "Ring Rows (feet elevated)" : "Chest-to-Bar Pull-ups", sets: 3, reps: reps(goal, "6-10") },
            { name: "High Pull / Chest-to-Bar Focus", sets: 2, reps: reps(goal, "3-5") },
        ];
        if (goal === "skills") arr.push({ name: "Muscle-up (clean reps or transitions)", sets: 3, reps: "2-5" });
        return ensureAtLeastFour(arr, { name: "Archer Rows (rings/bar)", sets: 2, reps: "6-8 each" });
    };

    // Push block options by level/equipment (guarantee ≥4)
    const pushBlock = (): { name: string; sets: number; reps: string }[] => {
        const dipsOK = hasPBars || hasRings;
        if (level === "beginner") {
            const list = [
                { name: "Incline Push-ups (bench/table)", sets: S(4, level), reps: reps(goal, "10-15") },
                { name: "Knee Push-ups (strict body line)", sets: 3, reps: reps(goal, "8-12") },
                { name: "Pike Push-ups (elevate hips)", sets: 3, reps: reps(goal, "6-10") },
                { name: "Shoulder Taps (hands elevated if needed)", sets: 2, reps: "10-20" },
            ];
            if (dipsOK) list.push({ name: "Assisted Dips (band/feet)", sets: 2, reps: reps(goal, "3-6") });
            return list;
        }

        if (level === "intermediate") {
            const list = [
                { name: "Standard Push-ups", sets: S(4, level), reps: reps(goal, "8-12") },
                { name: "Pike Push-ups (or HSPU wall prep)", sets: 3, reps: reps(goal, "6-10") },
                { name: "Diamond / Close-Grip Push-ups", sets: 3, reps: reps(goal, "8-12") },
                dipsOK ? { name: "Parallel Bar Dips", sets: 3, reps: reps(goal, "6-10") } : { name: "Deficit Push-ups (books/blocks)", sets: 3, reps: reps(goal, "6-10") },
            ];
            if (goal === "skills") list.push({ name: "Pseudo Planche Lean (30–45s total)", sets: 3, reps: "10-20s" });
            return list;
        }

        // advanced
        const list = [
            { name: "Feet-Elevated Push-ups / Weighted Vest", sets: S(4, level), reps: reps(goal, "6-10") },
            dipsOK ? { name: "Ring Dips (RTO if strong)", sets: 4, reps: reps(goal, "5-8") } : { name: "Deficit Push-ups Deep", sets: 4, reps: reps(goal, "6-10") },
            { name: "Pike HSPU / Wall HSPU", sets: 4, reps: reps(goal, "4-8") },
            { name: "Archer / Typewriter Push-ups", sets: 3, reps: reps(goal, "4-8 each") },
        ];
        if (goal === "skills") list.push({ name: "Planche Lean / HSPU Negatives", sets: 3, reps: "3-5" });
        return list;
    };

    // Legs & Core block by level/goal
    const legsCoreBlock = (): { name: string; sets: number; reps: string }[] => {
        if (level === "beginner") {
            return [
                { name: "Bodyweight Squats", sets: S(4, level), reps: reps(goal, "12-20") },
                { name: "Reverse Lunges", sets: 3, reps: "10-12 each" },
                { name: "Glute Bridge", sets: 3, reps: "12-20" },
                { name: "Plank", sets: 3, reps: "30-60s" },
                { name: "Hollow Hold", sets: 3, reps: "15-30s" },
            ];
        }
        if (level === "intermediate") {
            const list = [
                { name: "Jump Squats (controlled)", sets: 3, reps: "10-15" },
                { name: "Bulgarian Split Squats", sets: 3, reps: "8-12 each" },
                { name: "Nordic Curl (assisted)", sets: 3, reps: "5-8" },
                { name: "Hanging Knee Raises (or lying)", sets: 3, reps: "10-15" },
                { name: "Hollow Body Rock", sets: 2, reps: "20-40s" },
            ];
            if (goal === "skills") list.push({ name: "Pistol Squat Progression (box/assisted)", sets: 3, reps: "3-6 each" });
            return list;
        }
        // advanced
        const list = [
            { name: "Pistol Squats", sets: 4, reps: "4-8 each" },
            { name: "Shrimp Squats (Cossack optional)", sets: 3, reps: "4-8 each" },
            { name: "Nordic Curl (eccentric if needed)", sets: 3, reps: "4-6" },
            { name: "Hanging Leg Raises (strict)", sets: 3, reps: "8-12" },
            { name: "Hollow to L-sit Compression", sets: 3, reps: "10-20s" },
        ];
        return list;
    };

    // Full Body templates (for 2-day plans)
    const fullBodyA = (): { name: string; sets: number; reps: string }[] => {
        const push = pushBlock()[0]; // primary push
        const pull = pullBlock()[0]; // primary pull
        const legs = legsCoreBlock()[0]; // primary leg
        const aux = [
            // pick supportive assistance based on level
            level === "beginner" ? { name: "Incline Push-ups", sets: 2, reps: reps(goal, "10-15") } : { name: "Diamond Push-ups", sets: 2, reps: reps(goal, "8-12") },
            hasBar || hasRings ? { name: "Scapular Pulls", sets: 2, reps: "10-15" } : { name: "Reverse Snow Angels", sets: 2, reps: "12-20" },
            { name: "Plank", sets: 2, reps: "30-60s" },
        ];
        return [push, pull, legs, ...aux].slice(0, 6);
    };

    const fullBodyB = (): { name: string; sets: number; reps: string }[] => {
        const pushAlt = pushBlock()[1] ?? { name: "Standard Push-ups", sets: S(3, level), reps: reps(goal, "8-12") };
        const pullAlt = pullBlock()[1] ?? { name: "Rows Variation", sets: S(3, level), reps: reps(goal, "8-12") };
        const legsAlt = legsCoreBlock()[1] ?? { name: "Lunges", sets: 3, reps: "10-12 each" };
        const core = legsCoreBlock().find((e) => e.name.toLowerCase().includes("hollow")) ?? { name: "Hollow Hold", sets: 3, reps: "20-30s" };
        return [pushAlt, pullAlt, legsAlt, core, { name: "Shoulder Taps", sets: 2, reps: "12-20" }];
    };

    // ensure ≥4 on push days
    function ensureAtLeastFour<T>(arr: T[], filler: T): T[] {
        while (arr.length < 4) arr.push(filler);
        return arr;
    }

    // assemble plan *************************************************************
    const labels = splitForDays(days);
    const workouts = labels.map((label, i) => {
        let exercises: { name: string; sets: number; reps: string }[] = [];

        if (label.startsWith("Full Body")) {
            exercises = label.endsWith("A") ? fullBodyA() : fullBodyB();
        } else if (label === "Push" || label === "Upper") {
            exercises = pushBlock();
        } else if (label === "Pull") {
            exercises = pullBlock();
        } else {
            exercises = legsCoreBlock();
        }

        // optional finisher based on goal/level (not for full-body if already long)
        const wantFinisher =
            goal !== "strength" && (label === "Push" || label === "Pull" || label === "Legs & Core") && exercises.length <= 6;

        if (wantFinisher) {
            if (goal === "endurance") {
                exercises.push({ name: "EMOM 6' — 5 Push-ups + 5 Squats", sets: 1, reps: "As prescribed" });
            } else if (goal === "skills") {
                exercises.push({ name: "Technique Primer (5 min): slow negatives / holds", sets: 1, reps: "5 min" });
            } else {
                exercises.push({ name: "Core Density — Hollow/Plank Alternating", sets: 1, reps: "6-8 min" });
            }
        }

        return {
            day: i + 1,
            name: `Day ${i + 1}: ${label}`,
            type: label,
            duration: "45-60 min",
            exercises,
        };
    });

    const title =
        `${days}-Day ${cap(goal)} Plan • ${cap(level)} • ` +
        (hasBar || hasRings || hasPBars ? "With Equipment" : "No-Equipment");

    return { title, level: cap(level), goal: cap(goal), workouts };
}


// tiny deterministic RNG so same inputs => similar variety but not identical
function mulberry32(seed: number) {
    return () => {
        let t = (seed += 0x6d2b79f5)
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}
const seededPick = <T,>(rng: () => number, arr: T[], n = 1) => {
    const a = [...arr]
    const out: T[] = []
    for (let i = 0; i < Math.min(n, a.length); i++) {
        const idx = Math.floor(rng() * a.length)
        out.push(a.splice(idx, 1)[0])
    }
    return out
}

// --- Exercise Library with metadata -----------------------------------------
// Tags: 'push','pull','legs','core','full','overhead','jump','wrist','knee','skill','ring','bar','dip','band','bench','parallettes'
type Ex = {
    name: string
    focus: ("Push" | "Pull" | "Legs" | "Core" | "Full Body")[]
    level: "Beginner" | "Intermediate" | "Advanced"
    needs?: ("Rings" | "Pull-up bar" | "Dip bars" | "Parallettes" | "Bench/box" | "Resistance band")[]
    tags?: string[]
}
const EXERCISES: Ex[] = [
    // PUSH
    { name: "Push-ups", focus: ["Push", "Full Body"], level: "Beginner", tags: ["wrist"] },
    { name: "Incline Push-ups (bench)", focus: ["Push"], level: "Beginner", needs: ["Bench/box"], tags: ["wrist"] },
    { name: "Decline Push-ups", focus: ["Push"], level: "Intermediate", tags: ["wrist"] },
    { name: "Diamond Push-ups", focus: ["Push"], level: "Intermediate", tags: ["wrist"] },
    { name: "Ring Push-ups", focus: ["Push"], level: "Intermediate", needs: ["Rings"], tags: ["ring", "wrist"] },
    { name: "Dips", focus: ["Push"], level: "Intermediate", needs: ["Dip bars"] },
    { name: "Ring Dips", focus: ["Push"], level: "Advanced", needs: ["Rings"], tags: ["ring"] },
    { name: "Pike Push-ups", focus: ["Push"], level: "Intermediate", tags: ["overhead", "wrist"] },
    {
        name: "Elevated Pike Push-ups (box)",
        focus: ["Push"],
        level: "Intermediate",
        needs: ["Bench/box"],
        tags: ["overhead", "wrist"],
    },
    // PULL
    { name: "Ring Rows", focus: ["Pull"], level: "Beginner", needs: ["Rings"] },
    { name: "Australian Pull-ups (bar)", focus: ["Pull"], level: "Beginner", needs: ["Pull-up bar"] },
    { name: "Pull-ups", focus: ["Pull"], level: "Intermediate", needs: ["Pull-up bar"] },
    { name: "Chin-ups", focus: ["Pull"], level: "Intermediate", needs: ["Pull-up bar"] },
    { name: "Scapular Pulls", focus: ["Pull"], level: "Beginner", needs: ["Pull-up bar"] },
    { name: "Band-assisted Pull-ups", focus: ["Pull"], level: "Beginner", needs: ["Pull-up bar", "Resistance band"] },
    // LEGS
    { name: "Bodyweight Squats", focus: ["Legs", "Full Body"], level: "Beginner", tags: ["knee"] },
    { name: "Reverse Lunges", focus: ["Legs"], level: "Beginner", tags: ["knee"] },
    { name: "Step-ups (bench)", focus: ["Legs"], level: "Beginner", needs: ["Bench/box"], tags: ["knee"] },
    { name: "Bulgarian Split Squats", focus: ["Legs"], level: "Intermediate", needs: ["Bench/box"], tags: ["knee"] },
    { name: "Single-leg RDL (bodyweight)", focus: ["Legs"], level: "Intermediate" },
    { name: "Calf Raises", focus: ["Legs"], level: "Beginner" },
    { name: "Wall Sit", focus: ["Legs"], level: "Beginner" },
    // CORE
    { name: "Plank", focus: ["Core"], level: "Beginner", tags: ["wrist"] },
    { name: "Side Plank", focus: ["Core"], level: "Beginner", tags: ["wrist"] },
    { name: "Dead Bug", focus: ["Core"], level: "Beginner" },
    { name: "Hollow Hold", focus: ["Core"], level: "Intermediate" },
    { name: "Hanging Knee Raises", focus: ["Core"], level: "Intermediate", needs: ["Pull-up bar"] },
    { name: "Ring L-sit Tuck Hold", focus: ["Core"], level: "Advanced", needs: ["Rings"], tags: ["ring"] },
    // FULL
    { name: "Bear Crawl", focus: ["Full Body"], level: "Beginner", tags: ["wrist"] },
    { name: "Mountain Climbers", focus: ["Full Body", "Core"], level: "Beginner", tags: ["wrist"] },
    { name: "Burpees", focus: ["Full Body"], level: "Intermediate", tags: ["jump"] },
    { name: "Band Rows", focus: ["Pull"], level: "Beginner", needs: ["Resistance band"] },
    { name: "Band Press-outs", focus: ["Core", "Full Body"], level: "Beginner", needs: ["Resistance band"] },
    // SKILL-ish
    {
        name: "Wall Handstand Hold (belly-to-wall)",
        focus: ["Push", "Core"],
        level: "Intermediate",
        tags: ["overhead", "wrist"],
    },
    { name: "Wall Shoulder Taps", focus: ["Push", "Core"], level: "Advanced", tags: ["overhead", "wrist"] },
]

// --- Constraints & filtering --------------------------------------------------
type Constraint = "No jumping" | "No overhead pressing" | "No wrist load" | "No knee flexion" | "Shoulder sensitive"

function filterByEquipment(list: Ex[], eq: string[]) {
    return list.filter((ex) => !ex.needs || ex.needs.some((n) => eq.includes(n)))
}
function filterByLevel(list: Ex[], level: "Beginner" | "Intermediate" | "Advanced") {
    const order = ["Beginner", "Intermediate", "Advanced"]
    return list.filter((ex) => order.indexOf(ex.level) <= order.indexOf(level))
}
function applyConstraints(list: Ex[], constraints: Constraint[]) {
    return list.filter((ex) => {
        if (constraints.includes("No jumping") && ex.tags?.includes("jump")) return false
        if (constraints.includes("No overhead pressing") && ex.tags?.includes("overhead")) return false
        if (constraints.includes("No wrist load") && ex.tags?.includes("wrist")) return false
        if (constraints.includes("No knee flexion") && ex.tags?.includes("knee")) return false
        if (constraints.includes("Shoulder sensitive") && (ex.focus.includes("Push") || ex.tags?.includes("overhead"))) {
            // allow gentle push/core but avoid heavy dip/overhead
            if (/Dip|Handstand|Ring Push|Pike/.test(ex.name)) return false
        }
        return true
    })
}

// --- Schemes & intensity ------------------------------------------------------
type Goal = "General fitness" | "Strength" | "Hypertrophy" | "Endurance" | "Fat-loss"
type Scheme = { sets: number; reps: string; rest: string; rir: string; tempo?: string; notes?: string }

function schemeFor(goal: Goal, level: string, timeMin: number): Scheme {
    const base: Record<Goal, Scheme> = {
        Strength: { sets: 4, reps: "4–6", rest: "120–180s", rir: "RIR 2", tempo: "31X0" },
        Hypertrophy: { sets: 3, reps: "8–12", rest: "60–90s", rir: "RIR 1–2", tempo: "21X1" },
        Endurance: { sets: 3, reps: "15–25", rest: "30–60s", rir: "RIR 2–3", tempo: "smooth" },
        "Fat-loss": { sets: 3, reps: "12–20", rest: "30–45s", rir: "RIR 2–3", tempo: "crisp" },
        "General fitness": { sets: 3, reps: "8–15", rest: "60–90s", rir: "RIR 2", tempo: "2-1-1" },
    }
    const s = { ...base[goal] }
    if (level === "Beginner") s.sets = Math.max(2, s.sets - 1)
    if (level === "Advanced") s.sets += 1
    if (timeMin <= 20) s.sets = Math.max(2, s.sets - 1)
    if (timeMin >= 40 && goal !== "Strength") s.sets += 1
    return s
}

function structureFor(goal: Goal, timeMin: number) {
    if (goal === "Strength") return { type: "Straight Sets", rounds: 1, pair: false }
    if (goal === "Hypertrophy") return { type: "Supersets (A/B)", rounds: 2, pair: true }
    if (goal === "Fat-loss" || goal === "Endurance") return { type: "Circuit x3", rounds: 3, pair: false }
    return timeMin <= 20
        ? { type: "Giant Set x2", rounds: 2, pair: false }
        : { type: "Supersets (A/B)", rounds: 2, pair: true }
}

// --- Selection by workout focus ----------------------------------------------
type Focus = "Full Body" | "Push" | "Pull" | "Legs" | "Core" | "Skills (handstand, muscle-up, L-sit)"

const isPush = (e: Ex) => e.focus.includes("Push")
const isPull = (e: Ex) => e.focus.includes("Pull")
const isLegs = (e: Ex) => e.focus.includes("Legs")
const isCore = (e: Ex) => e.focus.includes("Core")

function mandatorySubForPull(eq: string[]): Ex {
    // Safe pull options by gear availability
    if (eq.includes("Pull-up bar") && eq.includes("Resistance band"))
        return {
            name: "Band-assisted Pull-ups",
            focus: ["Pull"],
            level: "Beginner",
            needs: ["Pull-up bar", "Resistance band"],
        }
    if (eq.includes("Rings")) return { name: "Ring Rows", focus: ["Pull"], level: "Beginner", needs: ["Rings"] }
    if (eq.includes("Pull-up bar"))
        return { name: "Australian Pull-ups (bar)", focus: ["Pull"], level: "Beginner", needs: ["Pull-up bar"] }
    if (eq.includes("Resistance band"))
        return { name: "Band Rows", focus: ["Pull"], level: "Beginner", needs: ["Resistance band"] }
    return { name: "Reverse Plank", focus: ["Full Body", "Core"], level: "Beginner" } // last resort (posterior chain isometric)
}

function mandatorySubForPush(eq: string[], constraints: Constraint[]): Ex {
    if (!constraints.includes("No wrist load")) {
        if (eq.includes("Bench/box"))
            return {
                name: "Incline Push-ups (bench)",
                focus: ["Push"],
                level: "Beginner",
                needs: ["Bench/box"],
                tags: ["wrist"],
            }
        return { name: "Push-ups", focus: ["Push", "Full Body"], level: "Beginner", tags: ["wrist"] }
    }
    // No-wrist backup: keep it minimal shoulder load
    return { name: "Band Press-outs", focus: ["Core", "Full Body"], level: "Beginner", needs: ["Resistance band"] }
}

function pickExercises(
    focus: Focus,
    level: "Beginner" | "Intermediate" | "Advanced",
    eq: string[],
    constraints: Constraint[],
    rng: () => number,
) {
    // pool after filters
    let pool = applyConstraints(filterByEquipment(filterByLevel(EXERCISES, level), eq), constraints)

    // helpers to draw with fallback
    const draw = (filterFn: (e: Ex) => boolean, n: number): Ex[] => {
        const match = pool.filter(filterFn)
        const picks = seededPick(rng, match, n)
        // remove picks from pool to avoid dupes
        pool = pool.filter((e) => !picks.includes(e))
        return picks
    }

    // strict templates per focus (hard caps to avoid category bleed)
    let primary: Ex[] = []
    let accessory: Ex[] = []
    let core: Ex[] = []

    switch (focus) {
        case "Push": {
            // 2–3 push primaries, 1 pull accessory (horizontal), 1 core
            primary = draw((e) => isPush(e) && !/Handstand|Shoulder Taps/.test(e.name), 3)
            if (primary.length < 2) primary.push(mandatorySubForPush(eq, constraints))
            accessory = draw((e) => isPull(e), 1)
            if (accessory.length === 0) accessory.push(mandatorySubForPull(eq))
            core = draw(isCore, 1)
            break
        }
        case "Pull": {
            // 2–3 pull primaries, 1 push accessory (easy), 1 core
            primary = draw(isPull, 3)
            if (primary.length < 2) primary.push(mandatorySubForPull(eq))
            accessory = draw((e) => isPush(e) && !/Dip|Ring Dip|Handstand|Pike/.test(e.name), 1)
            if (accessory.length === 0) accessory.push(mandatorySubForPush(eq, constraints))
            core = draw(isCore, 1)
            break
        }
        case "Legs": {
            // 3–4 legs, 1 core
            primary = draw(isLegs, 4)
            if (primary.length < 3) primary.push({ name: "Wall Sit", focus: ["Legs"], level: "Beginner" })
            core = draw(isCore, 1)
            break
        }
        case "Core": {
            // 2–3 core, 1 push OR pull accessory (light)
            primary = draw(isCore, 3)
            if (primary.length < 2) primary.push({ name: "Hollow Hold", focus: ["Core"], level: "Intermediate" })
            accessory = draw((e) => isPull(e) || (isPush(e) && !/Dip|Ring/.test(e.name)), 1)
            break
        }
        case "Skills (handstand, muscle-up, L-sit)": {
            // 1 skill-ish, 1 push support, 1 pull support, 1 core
            const skill = draw((e) => /Handstand|Shoulder Taps|Ring L-sit/.test(e.name), 1)
            const pushS = draw((e) => isPush(e) && !/Dip/.test(e.name), 1)
            const pullS = draw(isPull, 1)
            const c = draw(isCore, 1)
            primary = [...skill, ...pushS, ...pullS]
            core = c
            break
        }
        default: {
            // Full Body
            // 1 push, 1 pull, 2 legs, 1 core, + 1 accessory (any)
            const p = draw(isPush, 1)
            if (p.length === 0) p.push(mandatorySubForPush(eq, constraints))
            const pu = draw(isPull, 1)
            if (pu.length === 0) pu.push(mandatorySubForPull(eq))
            const l = draw(isLegs, 2)
            if (l.length < 2) l.push({ name: "Calf Raises", focus: ["Legs"], level: "Beginner" })
            const c = draw(isCore, 1)
            const extra = seededPick(rng, pool, 1)
            primary = [...p, ...pu, ...l]
            accessory = extra
            core = c
        }
    }

    // Assemble & cap 6–7 items max (no legs on Push/Pull):
    let list = [...primary, ...accessory, ...core].filter((e, i, arr) => arr.findIndex((x) => x.name === e.name) === i)

    const maxItems = focus === "Legs" ? 7 : 6
    list = list.slice(0, maxItems)

    // HARD SANITY: if focus is Push or Pull, purge any stray Legs
    if (focus === "Push" || focus === "Pull") {
        list = list.filter((e) => !isLegs(e))
    }

    // Ensure at least one from the main focus exists
    const hasMain =
        (focus === "Push" && list.some(isPush)) ||
        (focus === "Pull" && list.some(isPull)) ||
        (focus === "Legs" && list.some(isLegs)) ||
        (focus === "Core" && list.some(isCore)) ||
        (focus.startsWith("Full Body") && list.some(isPush) && list.some(isPull) && list.some(isLegs)) ||
        (focus.startsWith("Skills") && list.length >= 3)

    if (!hasMain) {
        // inject mandatory substitution depending on focus
        if (focus === "Pull") list.unshift(mandatorySubForPull(eq))
        else if (focus === "Push") list.unshift(mandatorySubForPush(eq, constraints))
    }

    return list
}

// --- Per-exercise prescription -----------------------------------------------
type Rx = { name: string; sets: number; reps: string; rest: string; rir: string; tempo?: string; notes?: string }

function rxFor(ex: Ex, scheme: Scheme, goal: Goal): Rx {
    const rx: Rx = {
        name: ex.name,
        sets: scheme.sets,
        reps: scheme.reps,
        rest: scheme.rest,
        rir: scheme.rir,
        tempo: scheme.tempo,
    }
    // tweak by pattern
    if (ex.focus.includes("Core")) {
        rx.reps = goal === "Strength" ? "20–30s hold" : goal === "Endurance" ? "30–45s hold" : "20–40s hold"
        rx.rest = "30–45s"
        rx.tempo = "braced"
    }
    if (/Wall Sit/.test(ex.name)) {
        rx.reps = goal === "Strength" ? "30–45s" : "40–60s"
        rx.rest = "45–60s"
    }
    if (/Calf Raises/.test(ex.name)) {
        rx.reps = goal === "Hypertrophy" ? "12–20" : rx.reps
        rx.tempo = "2-1-2"
    }
    if (/Pull-ups|Chin-ups|Dips|Ring/.test(ex.name) && goal === "Strength") {
        rx.reps = "3–5"
        rx.sets = Math.max(3, scheme.sets)
        rx.rest = "120–180s"
        rx.tempo = "31X0"
    }
    if (/Burpees/.test(ex.name)) {
        rx.reps = goal === "Fat-loss" ? "30–40s AMRAP" : "8–12"
        rx.rest = goal === "Fat-loss" ? "20–30s" : "45–60s"
    }
    return rx
}

// --- Finisher & warmup/cooldown ----------------------------------------------
function finisher(goal: Goal, timeMin: number, eq: string[], rng: () => number) {
    if (timeMin < 25) return null
    const picks = {
        Strength: ["EMOM 6 min — Even: 5–7 Push-ups, Odd: 5–7 Rows", "EMOM 8 min — 2–3 Pull-ups @ RIR2"],
        Hypertrophy: ["8-min Ladder — Push 4 + Row 4 (add +1 each round)", "Drop-set Push-ups 3 x AMRAP with 20s rest"],
        Endurance: ["AMRAP 6 min — 6 Squats / 6 Rows / 6 Push-ups", "Tabata 4 min — 20s Mountain Climbers / 10s rest × 8"],
        "Fat-loss": [
            "MetCon 8 min — 10 Squats / 8 Rows / 6 Push-ups / 20s Plank",
            "EMOM 10 — 8 Burpees (scale to 5 if needed)",
        ],
        "General fitness": [
            "EMOM 8 — 6 Push-ups / 8 Squats (alt minutes)",
            "Chipper — 40 Squats / 30 Rows / 20 Push-ups / 10 Hollow Rocks",
        ],
    }[goal]
    return picks[Math.floor(rng() * picks.length)]
}

function warmup(focus: Focus, constraints: Constraint[]) {
    const base = [
        `60–90s easy movement${constraints.includes("No jumping") ? "" : " (march/jog or light jumps)"}`,
        "Arm circles × 10 each",
        "Leg swings × 8 each",
    ]
    if (!constraints.includes("No wrist load")) base.push("Wrist circles × 8 each")
    if (/Skills/.test(focus)) base.push("Wall shoulder taps × 6 each", "Hollow rocks × 10")
    return base
}
function cooldown() {
    return ["Deep breathing 1 min (long exhales)", "Chest stretch 30s/side", "Hip flexor stretch 30s/side"]
}

// --- Intent/tempo notes -------------------------------------------------------
function intent(goal: Goal, level: string) {
    const m: Record<Goal, string> = {
        Strength: "Heavy-ish bodyweight, crisp form, longer rest, RIR 1–2",
        Hypertrophy: "Moderate reps, steady tempo, chase the pump at RIR 1–2",
        Endurance: "Higher reps/time under tension, minimal rest, smooth pace",
        "Fat-loss": "Circuit density, keep heart rate up, clean technique",
        "General fitness": "Balanced: push/pull/legs + core; quality movement",
    }
    return `${m[goal]} — ${level}`
}

// --- Public: generate a *real* plan ------------------------------------------
export function generateAdvancedPlan(
    level: "Beginner" | "Intermediate" | "Advanced",
    timeMin: number,
    equipment: string[],
    focus: Focus,
    goal: Goal,
    constraints: Constraint[],
) {
    const seed = (
        level +
        "|" +
        timeMin +
        "|" +
        equipment.sort().join(",") +
        "|" +
        focus +
        "|" +
        goal +
        "|" +
        constraints.sort().join(",")
    )
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0)
    const rng = mulberry32(seed)

    const struct = structureFor(goal, timeMin)
    const scheme = schemeFor(goal, level, timeMin)
    const exs = pickExercises(focus, level, equipment.length ? (equipment as any) : (["None"] as any), constraints, rng)

    // Build RX list
    const rxList = exs.map((e) => rxFor(e, scheme, goal))

    // Grouping for UI: A/B if supersets, else linear or circuit
    let blocks: { title: string; items: Rx[] }[] = []
    if (struct.type.startsWith("Supersets")) {
        const A: Rx[] = [],
            B: Rx[] = []
        rxList.forEach((rx, i) => (i % 2 === 0 ? A : B).push(rx))
        blocks = [
            { title: "A — Superset", items: A },
            { title: "B — Superset", items: B },
        ]
    } else if (struct.type.includes("Circuit") || struct.type.includes("Giant")) {
        blocks = [{ title: struct.type, items: rxList }]
    } else {
        blocks = [{ title: "Main — Straight Sets", items: rxList }]
    }

    return {
        header: {
            title: `${level} • ${timeMin} min • ${focus} • ${equipment.length ? equipment.join(" + ") : "Bodyweight"}`,
            intent: intent(goal, level),
            structure: struct.type,
        },
        warmup: warmup(focus, constraints),
        main: {
            rounds: struct.rounds,
            blocks,
            scheme,
        },
        finisher: finisher(goal, timeMin, equipment, rng),
        cooldown: cooldown(),
        notes: [
            "Track your best set for each exercise",
            "Progress next time if RIR ≥ 3 on last set",
            "Tempo guide applies to main lifts; move smoothly on accessories",
        ],
    }
}

"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@calis/components/ui/card"
import { Input } from "@calis/components/ui/input"
import { Label } from "@calis/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@calis/components/ui/select"
import { Badge } from "@calis/components/ui/badge"
import { ArrowLeft, Award, Target, TrendingUp, Zap, Star, Trophy, Info, Calculator } from "lucide-react"
import { toast } from "sonner"
import * as RSlider from "@radix-ui/react-slider"
import { motion } from "framer-motion"
import Header from "@calis/components/site/Header"
import { trackEvent } from "@calis/lib/analytics/track"

// ---------- UI: Purple slider ----------
function PurpleSlider({
                          value,
                          onValueChange,
                          max = 50,
                          min = 1,
                          step = 1,
                      }: {
    value: number[]
    onValueChange: (v: number[]) => void
    max?: number
    min?: number
    step?: number
}) {
    return (
        <RSlider.Root
            value={value}
            onValueChange={onValueChange}
            max={max}
            min={min}
            step={step}
            className="relative flex w-full touch-none select-none items-center h-5"
        >
            <RSlider.Track className="relative h-2 grow rounded-full bg-black">
                <RSlider.Range className="absolute h-full rounded-full bg-purple-500" />
            </RSlider.Track>
            <RSlider.Thumb className="block h-5 w-5 rounded-full border-2 border-purple-500 bg-black ring-offset-black focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2" />
        </RSlider.Root>
    )
}

// ---------- Math ----------
const calculateOneRM = (weight: number, reps: number) => weight * (1 + reps / 30)

// ---------- Types ----------
type Exercise = {
    name: string
    bodyweightPercent: number
    icon: string
    progressions: string[]
    repsMax?: number
}

type StrengthLevel = {
    name: "Novice" | "Intermediate" | "Advanced" | "Elite" | "Legendary"
    min: number
    max: number
    color: string
    badge: string
    description: string
}

type Result = {
    strengthRatio: string
    level: StrengthLevel
    currentProgression: string
    nextProgression?: string
    unlockedSkills: string[]
    nextSkillThreshold?: number
    progressionTree: string[]
    currentIndex: number
    oneRMkg: number
}

// ---------- Exercises ----------
const exercises: Record<string, Exercise> = {
    // PUSH
    "push-ups": {
        name: "Push-ups",
        bodyweightPercent: 0.65,
        icon: "💪",
        progressions: ["Incline Push-ups", "Standard Push-ups", "Archer Push-ups", "Pseudo Planche Push-ups", "One-Arm Push-ups"],
        repsMax: 200,
    },
    "ring-push-ups": {
        name: "Ring Push-ups",
        bodyweightPercent: 0.7,
        icon: "🫱",
        progressions: ["High Rings", "Standard", "Feet Elevated", "RTO Push-ups", "Archer Rings"],
        repsMax: 120,
    },
    "pike-push-ups": {
        name: "Pike Push-ups",
        bodyweightPercent: 0.75,
        icon: "🧗",
        progressions: ["Elevated Pike", "Deep Pike", "Wall HSPU", "Freestanding HSPU", "Deficit HSPU"],
        repsMax: 100,
    },

    // PULL
    "pull-ups": {
        name: "Pull-ups",
        bodyweightPercent: 1.0,
        icon: "🏋️",
        progressions: ["Assisted Pull-ups", "Standard Pull-ups", "Weighted Pull-ups", "Muscle-up Progression", "Front Lever Pulls"],
    },
    "chin-ups": {
        name: "Chin-ups",
        bodyweightPercent: 1.0,
        icon: "🧲",
        progressions: ["Assisted", "Standard", "Weighted", "Explosive", "Close Grip"],
    },
    "australian-rows": {
        name: "Body Rows (Aussie)",
        bodyweightPercent: 0.6,
        icon: "🪢",
        progressions: ["High Bar", "Mid Bar", "Feet Elevated", "Ring Rows", "Front Lever Rows"],
        repsMax: 150,
    },

    // DIPS / RINGS
    dips: {
        name: "Dips",
        bodyweightPercent: 1.0,
        icon: "💥",
        progressions: ["Assisted Dips", "Standard Dips", "Weighted Dips", "RTO Dips", "Ring Maltese"],
    },
    "ring-dips": {
        name: "Ring Dips",
        bodyweightPercent: 1.05,
        icon: "💠",
        progressions: ["Support Hold", "Band Assisted", "Ring Dips", "RTO Dips", "Korean Dips"],
    },

    // LEGS
    squats: {
        name: "Squats",
        bodyweightPercent: 0.85,
        icon: "🦵",
        progressions: ["Assisted Squats", "Bodyweight Squats", "Jump Squats", "Pistol Prep", "Pistol Squats"],
        repsMax: 250,
    },
    "shrimp-squats": {
        name: "Shrimp Squats",
        bodyweightPercent: 0.95,
        icon: "🦐",
        progressions: ["Assisted", "Level 1", "Level 2", "Weighted", "Plyo"],
        repsMax: 120,
    },
    "nordic-curl": {
        name: "Nordic Curl",
        bodyweightPercent: 0.6,
        icon: "🧵",
        progressions: ["High Assist", "Band Assist", "Eccentric", "Partial Concentric", "Full Nordic"],
        repsMax: 40,
    },

    // CORE / STATIC
    "l-sit": {
        name: "L-sit Hold",
        bodyweightPercent: 0.8,
        icon: "🔥",
        progressions: ["Tucked L-sit", "Advanced Tuck", "L-sit", "V-sit", "Manna"],
        repsMax: 120, // treat as seconds
    },
    "toes-to-bar": {
        name: "Toes-to-Bar",
        bodyweightPercent: 0.8,
        icon: "🦶",
        progressions: ["Knee Raises", "Leg Raises", "Strict TTB", "Weighted Raises", "Compression Raises"],
        repsMax: 60,
    },
    "back-lever-raises": {
        name: "Back Lever Raises",
        bodyweightPercent: 0.9,
        icon: "🕸️",
        progressions: ["Tuck", "Adv. Tuck", "Straddle", "Half Lay", "Full"],
        repsMax: 30,
    },
}

type ExerciseKey = keyof typeof exercises

// ---------- Levels & Unlocks ----------
const strengthLevels: StrengthLevel[] = [
    { name: "Novice", min: 0, max: 0.8, color: "bg-gray-500", badge: "🥉", description: "Building foundation" },
    { name: "Intermediate", min: 0.8, max: 1.2, color: "bg-cyan-500", badge: "🥈", description: "Solid basics" },
    { name: "Advanced", min: 1.2, max: 1.8, color: "bg-lime-500", badge: "🥇", description: "Strong athlete" },
    { name: "Elite", min: 1.8, max: 2.5, color: "bg-yellow-500", badge: "⭐", description: "Beast mode" },
    { name: "Legendary", min: 2.5, max: Number.POSITIVE_INFINITY, color: "bg-gradient-to-r from-purple-500 to-pink-500", badge: "🔥", description: "Superhuman" },
]

const skillUnlocks: Record<number, string[]> = {
    0.8: ["Basic calisthenics movements", "Proper form training"],
    1.0: ["Weighted variations", "Advanced holds"],
    1.2: ["Muscle-up progressions", "Lever training"],
    1.5: ["Advanced skills", "Competition movements"],
    1.8: ["Elite progressions", "One-arm variations"],
    2.0: ["Legendary skills", "Freestyle combinations"],
}

function formatNumber(n: number, unit: "kg" | "lbs") {
    const val = unit === "kg" ? n : n / 0.45359237
    return `${val.toFixed(1)} ${unit}`
}

// ---------- Parsing & validation helpers ----------
function toNumber(raw: string): number | undefined {
    const trimmed = raw.trim()
    if (trimmed === "") return undefined
    const num = Number(trimmed.replace(",", "."))
    return Number.isFinite(num) ? num : undefined
}
function isValidPositive(raw: string): boolean {
    const n = toNumber(raw)
    return n !== undefined && n > 0
}
function isValidNonNegative(raw: string): boolean {
    const n = toNumber(raw)
    return n !== undefined && n >= 0
}
function parsePositiveOrUndefined(raw: string): number | undefined {
    const n = toNumber(raw)
    if (n === undefined) return undefined
    return n > 0 ? n : undefined
}
function parseNonNegativeOrUndefined(raw: string): number | undefined {
    const n = toNumber(raw)
    if (n === undefined) return undefined
    return n >= 0 ? n : undefined
}

// ---------- Main Tool ----------
function CalisthenicsStrengthTool() {
    const [selectedExercise, setSelectedExercise] = useState<ExerciseKey>("pull-ups")

    // keep as strings so user can clear inputs (especially on mobile)
    const [bodyweightStr, setBodyweightStr] = useState<string>("70")
    const [extraWeightStr, setExtraWeightStr] = useState<string>("0")

    const [reps, setReps] = useState<number>(10)
    const [unit, setUnit] = useState<"kg" | "lbs">("kg")
    const [result, setResult] = useState<Result | null>(null)

    const repMaxForExercise = useMemo(() => exercises[selectedExercise].repsMax ?? 50, [selectedExercise])

    // derived validation flags
    const bwEmpty = bodyweightStr.trim() === ""
    const bwError = !bwEmpty && !isValidPositive(bodyweightStr)

    const extraEmpty = extraWeightStr.trim() === ""
    const extraError = !extraEmpty && !isValidNonNegative(extraWeightStr)

    // ---- analytics refs (typing protection) ----
    const lastResultKeyRef = useRef<string>("")
    const lastSentAtRef = useRef<number>(0)

    // ---- analytics: tool_view (once per tab session) ----
    useEffect(() => {
        const key = "ch_viewed_tool_max_rep_estimator"
        if (typeof window === "undefined") return
        if (sessionStorage.getItem(key)) return
        sessionStorage.setItem(key, "1")

        trackEvent("tool_view", {
            tool: "max_rep_estimator",
        })
    }, [])

    useEffect(() => {
        setReps((r) => Math.min(r, repMaxForExercise))
    }, [repMaxForExercise])

    const calculateStrength = () => {
        const exercise = exercises[selectedExercise]
        const toKg = unit === "kg" ? 1 : 0.45359237

        // If any validation error or BW empty, stop and hide results
        if (bwEmpty || bwError || extraError) {
            setResult(null)
            return
        }

        const bodyweight = parsePositiveOrUndefined(bodyweightStr)! // safe (we checked valid)
        const extraParsed = parseNonNegativeOrUndefined(extraWeightStr)
        const extraWeight = extraParsed ?? 0

        const bwKg = bodyweight * toKg
        const extraKg = extraWeight * toKg

        const effectiveWeight = bwKg * exercise.bodyweightPercent + extraKg
        const oneRM = calculateOneRM(effectiveWeight, Math.max(1, reps))
        const strengthRatio = oneRM / bwKg

        const level = strengthLevels.find((l) => strengthRatio >= l.min && strengthRatio < l.max) ?? strengthLevels[0]
        const lastIndex = exercise.progressions.length - 1
        const currentProgressionIndex = Math.min(Math.floor(strengthRatio * 2), lastIndex)

        const nextProgression = currentProgressionIndex < lastIndex ? exercise.progressions[currentProgressionIndex + 1] : undefined

        const unlockedSkills = Object.entries(skillUnlocks)
            .filter(([threshold]) => strengthRatio >= Number.parseFloat(threshold))
            .flatMap(([, skills]) => skills)

        const nextSkillThreshold = Object.keys(skillUnlocks)
            .map(Number)
            .find((threshold) => strengthRatio < threshold)

        setResult({
            strengthRatio: strengthRatio.toFixed(2),
            level,
            currentProgression: exercise.progressions[currentProgressionIndex],
            nextProgression,
            unlockedSkills,
            nextSkillThreshold,
            progressionTree: exercise.progressions,
            currentIndex: currentProgressionIndex,
            oneRMkg: oneRM,
        })

        // ---- analytics: tool_result (throttled) ----
        const now = Date.now()
        const resultKey = `${selectedExercise}|${unit}|${bodyweightStr}|${extraWeightStr}|${reps}`

        if (resultKey !== lastResultKeyRef.current && now - lastSentAtRef.current > 800) {
            lastResultKeyRef.current = resultKey
            lastSentAtRef.current = now

            trackEvent("tool_result", {
                tool: "max_rep_estimator",
                exercise: selectedExercise,
                unit,
                reps,
                bodyweight: bodyweightStr,
                extraWeight: extraWeightStr,
                strengthRatio: Number(strengthRatio.toFixed(2)),
                level: level.name,
                oneRMkg: Number(oneRM.toFixed(1)), // kg baseline
            })
        }

        if (level.name === "Elite" || level.name === "Legendary") {
            toast(`${level.badge} ${level.name} Calisthenics Athlete!`, {
                description: `${strengthRatio.toFixed(1)}x bodyweight strength achieved!`,
            })
        }
    }

    useEffect(() => {
        if (reps > 0) calculateStrength()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedExercise, bodyweightStr, extraWeightStr, reps, unit, bwError, extraError])

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                    Calisthenics <span className="text-cyan-400">Strength</span> &{" "}
                    <span className="text-lime-400">Progression</span>
                </h1>
                <p className="text-gray-400 text-lg">Discover your bodyweight strength and unlock new skills</p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Info className="h-4 w-4" />
                    <span>Uses the Epley 1RM estimate · BW coefficients per movement</span>
                </div>
            </div>

            {/* Inputs + Results */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <Card className="bg-gray-900 border-gray-800 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Target className="h-5 w-5 text-cyan-400" />
                                Exercise Parameters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label>Exercise</Label>
                                <Select value={selectedExercise} onValueChange={(v) => setSelectedExercise(v as ExerciseKey)}>
                                    <SelectTrigger className="bg-black border-gray-700">
                                        <SelectValue placeholder="Choose exercise" />
                                    </SelectTrigger>
                                    <SelectContent className="text-white bg-gray-900 border-gray-700 max-h-72">
                                        {Object.entries(exercises).map(([key, ex]) => (
                                            <SelectItem key={key} value={key}>
                                                {ex.icon} {ex.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2 space-y-2">
                                    <Label>Bodyweight ({unit})</Label>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        pattern="[0-9]*[.,]?[0-9]*"
                                        value={bodyweightStr}
                                        onChange={(e) => setBodyweightStr(e.target.value)}
                                        placeholder="e.g. 70"
                                        aria-invalid={bwError}
                                        className={`bg-black ${bwError ? "border-red-500 focus-visible:ring-red-500" : "border-gray-700"}`}
                                    />
                                    {bwError && <p className="text-xs text-red-400">Type a valid number please (must be &gt; 0).</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Unit</Label>
                                    <Select value={unit} onValueChange={(v) => setUnit(v as "kg" | "lbs")}>
                                        <SelectTrigger className="bg-black border-gray-700">
                                            <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                        <SelectContent className="text-white bg-gray-900 border-gray-700">
                                            <SelectItem value="kg">kg</SelectItem>
                                            <SelectItem value="lbs">lbs</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Reps */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Reps Performed</Label>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                                            {reps}
                                        </Badge>
                                        <Input
                                            type="number"
                                            value={reps}
                                            onChange={(e) => {
                                                const n = Number(e.target.value)
                                                if (!Number.isFinite(n)) return
                                                setReps(Math.max(1, Math.min(n, repMaxForExercise)))
                                            }}
                                            className="h-8 w-20 bg-black border-gray-700"
                                        />
                                    </div>
                                </div>
                                <PurpleSlider value={[reps]} onValueChange={(v) => setReps(v[0])} max={repMaxForExercise} min={1} step={1} />
                                <p className="text-xs text-gray-500">Max for this exercise: {repMaxForExercise}</p>
                            </div>

                            {/* Extra weight */}
                            <div className="space-y-2">
                                <Label>Extra Weight ({unit})</Label>
                                <Input
                                    type="text"
                                    inputMode="decimal"
                                    pattern="[0-9]*[.,]?[0-9]*"
                                    value={extraWeightStr}
                                    onChange={(e) => setExtraWeightStr(e.target.value)}
                                    placeholder="0"
                                    aria-invalid={extraError}
                                    className={`bg-black ${extraError ? "border-red-500 focus-visible:ring-red-500" : "border-gray-700"}`}
                                />
                                {extraError && <p className="text-xs text-red-400">Type a valid number please (must be ≥ 0).</p>}
                                {!extraError && <p className="text-xs text-gray-500">Leave empty for none.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Results */}
                {result && (
                    <motion.div
                        key={`${selectedExercise}-${reps}-${unit}-${bodyweightStr}-${extraWeightStr}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                    >
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Award className="h-5 w-5 text-cyan-400" />
                                    Strength Level
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center space-y-4">
                                    <div className="text-6xl">{result.level.badge}</div>
                                    <Badge className={`${result.level.color} text-white text-lg px-4 py-2`}>{result.level.name}</Badge>
                                    <div className="text-3xl font-bold text-cyan-400">{result.strengthRatio}x</div>
                                    <p className="text-gray-400">Bodyweight Strength Ratio</p>
                                    <p className="text-sm text-gray-500">{result.level.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Calculator className="h-5 w-5 text-purple-400" />
                                    Estimated 1RM Equivalent
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-3 rounded border border-purple-500/20 bg-purple-500/10">
                                    <div className="text-gray-400">1RM (approx)</div>
                                    <div className="text-lg font-semibold text-white">{formatNumber(result.oneRMkg, unit)}</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <TrendingUp className="h-5 w-5 text-lime-400" />
                                    Progression Path
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white">
                                <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                    <p className="text-sm">
                                        <strong>Current Level:</strong> {result.currentProgression}
                                    </p>
                                </div>

                                {result.nextProgression ? (
                                    <div className="p-4 bg-lime-500/10 rounded-lg border border-lime-500/20">
                                        <p className="text-sm">
                                            <strong>Next Progression:</strong> {result.nextProgression}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                        <p className="text-sm">
                                            <strong>Final Progression Reached:</strong> You’re at the top of this path—time for harder variations or added
                                            weight.
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <h4 className="font-medium flex items-center gap-2 text-white">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        Skill Tree
                                    </h4>
                                    <div className="space-y-2">
                                        {result.progressionTree.map((progression: string, index: number) => (
                                            <div
                                                key={index}
                                                className={`flex items-center gap-3 p-2 rounded ${
                                                    index <= result.currentIndex
                                                        ? "bg-lime-500/20 border border-lime-500/30"
                                                        : index === result.currentIndex + 1
                                                            ? "bg-cyan-500/20 border border-cyan-500/30"
                                                            : "bg-gray-800 border border-gray-700"
                                                }`}
                                            >
                                                <div
                                                    className={`w-3 h-3 rounded-full ${
                                                        index <= result.currentIndex ? "bg-lime-400" : index === result.currentIndex + 1 ? "bg-cyan-400" : "bg-gray-600"
                                                    }`}
                                                />
                                                <span
                                                    className={`text-sm ${
                                                        index <= result.currentIndex ? "text-lime-400" : index === result.currentIndex + 1 ? "text-cyan-400" : "text-gray-400"
                                                    }`}
                                                >
                          {progression}
                        </span>
                                                {index <= result.currentIndex && (
                                                    <Badge variant="outline" className="ml-auto text-xs border-lime-500 text-lime-400">
                                                        Unlocked
                                                    </Badge>
                                                )}
                                                {index === result.currentIndex + 1 && (
                                                    <Badge variant="outline" className="ml-auto text-xs border-cyan-500 text-cyan-400">
                                                        Next
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Zap className="h-5 w-5 text-yellow-400" />
                                    Skill Unlocks
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-lime-400">Available Skills:</h4>
                                    <div className="grid gap-2">
                                        {result.unlockedSkills.map((skill: string, index: number) => (
                                            <div key={index} className="flex items-center gap-2 p-2 bg-lime-500/10 rounded border border-lime-500/20">
                                                <Trophy className="h-4 w-4 text-lime-400" />
                                                <span className="text-sm text-lime-400">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {result.nextSkillThreshold !== undefined && (
                                    <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-white">
                                        <p className="text-sm">
                                            <strong>Next Unlock:</strong> Reach {result.nextSkillThreshold}x bodyweight strength to unlock more advanced skills!
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

// ---------- Page ----------
export default function ToolPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link href="/tools" className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tools
                    </Link>
                </div>
                <CalisthenicsStrengthTool />
            </main>
        </div>
    )
}

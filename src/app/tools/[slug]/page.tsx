"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@calis/components/ui/button"
import { Input } from "@calis/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@calis/components/ui/card"
import { Label } from "@calis/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@calis/components/ui/select"
import { Checkbox } from "@calis/components/ui/checkbox"
import { Calculator, Dumbbell, Activity, ArrowLeft, Clock, Target, Zap } from "lucide-react"
import { generateAdvancedPlan } from "@calis/lib/workout-engine"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"

interface ToolPageProps {
    params: { slug: string }
}

// ---- design tokens (class helpers) ----
const pageBg =
    "min-h-screen bg-black text-white"
const container = "container mx-auto px-4 py-12"
const cardBase =
    "bg-neutral-850/90 border border-neutral-700/80 shadow-sm hover:shadow-purple-500/10 transition-shadow"
const titleCls = "text-2xl text-white"
const descCls = "text-neutral-200" // brighter than -400
const subtlePanel =
    "p-4 bg-purple-950/40 border border-purple-500/40 rounded-lg"
const fieldInput =
    "bg-neutral-900/80 border-neutral-700 text-white placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-purple-400/80"
const fieldSelectTrigger =
    "bg-neutral-900/80 border-neutral-700 focus:ring-2 bg-white focus:ring-purple-400/80"
const fieldSelectContent = "bg-neutral-900 border border-neutral-700 bg-white"
const smallNote = "text-xs text-neutral-400"

export default function ToolPage({ params }: ToolPageProps) {
    const renderTool = () => {
        switch (params.slug) {
            case "max-rep-calculator":
                return <MaxRepCalculator />
            case "workout-generator":
                return <WorkoutGenerator />
            case "bmi-calculator":
                return <BMICalculator />
            default:
                return <div>Tool not found</div>
        }
    }

    return (
        <div className={pageBg}>
<Header />
            <main className={container}>
                <div>
                    <Link href="/tools" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Tools
                    </Link>
                </div>
                <div className="max-w-2xl mx-auto">{renderTool()}</div>
            </main>
            <Footer />
        </div>
    )
}

function MaxRepCalculator() {
    const [pushups, setPushups] = useState("")
    const [pullups, setPullups] = useState("")
    const [result, setResult] = useState<{
        level: "Start" | "Beginner" | "Intermediate" | "Advanced"
        score: number
        tips: string[]
        targets: { pushups: number; pullups: number }
    } | null>(null)

    const classify = (p: number, pu: number) => {
        // 0–100 composite score with heavier weight on pull-ups
        const puScore = Math.min(100, (p / 50) * 60)   // push-ups capped at 50 => 60 pts
        const plScore = Math.min(100, (pu / 15) * 40)  // pull-ups capped at 15 => 40 pts
        const score = Math.round(puScore + plScore)

        let level: "Start" | "Beginner" | "Intermediate" | "Advanced" = "Start"
        if (score >= 75) level = "Advanced"
        else if (score >= 45) level = "Intermediate"
        else if (score >= 15) level = "Beginner"

        const tips: string[] = []
        if (pu < 3) tips.push("Use band-assisted pull-ups or inverted rows 3×/week.")
        if (p < 15) tips.push("Grease-the-groove: 3 easy sets of push-ups during the day.")
        if (level !== "Advanced") tips.push("Keep 2–3 reps in reserve; focus on clean tempo.")

        // next realistic targets (one block above current)
        const targets = {
            pushups: p >= 35 ? 50 : p >= 20 ? 35 : 20,
            pullups: pu >= 10 ? 15 : pu >= 5 ? 10 : 5,
        }

        return { level, score: Math.min(score, 100), tips, targets }
    }

    const calculateLevel = () => {
        const p = Number.parseInt(pushups) || 0
        const pu = Number.parseInt(pullups) || 0
        setResult(classify(p, pu))
    }

    // tiny visual chip
    const LevelPill = ({ level }: { level: string }) => {
        const map: Record<string, string> = {
            Start: "bg-neutral-800 text-neutral-200 border border-neutral-700",
            Beginner: "bg-blue-950/40 text-blue-200 border border-blue-500/30",
            Intermediate: "bg-amber-950/40 text-amber-200 border border-amber-500/30",
            Advanced: "bg-emerald-950/40 text-emerald-200 border border-emerald-500/30",
        }
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[level]}`}>{level}</span>
    }

    return (
        <Card className="bg-neutral-850/90 border border-neutral-700 shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-purple-400" />
                    <CardTitle className="text-2xl text-white">Max Rep → Training Level</CardTitle>
                </div>
                <CardDescription className="text-neutral-200">
                    Get a calibrated level, score out of 100, and next targets.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pushups" className="text-neutral-100">Max Push-ups</Label>
                        <Input
                            id="pushups"
                            type="number"
                            placeholder="e.g., 25"
                            value={pushups}
                            onChange={(e) => setPushups(e.target.value)}
                            className="bg-neutral-900/80 border-neutral-700 text-white placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-purple-400/80"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pullups" className="text-neutral-100">Max Pull-ups</Label>
                        <Input
                            id="pullups"
                            type="number"
                            placeholder="e.g., 8"
                            value={pullups}
                            onChange={(e) => setPullups(e.target.value)}
                            className="bg-neutral-900/80 border-neutral-700 text-white placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-purple-400/80"
                        />
                    </div>
                </div>

                <Button onClick={calculateLevel} className="w-full bg-purple-600 hover:bg-purple-700">
                    Calculate Level
                </Button>

                {result && (
                    <div className="space-y-4 p-5 rounded-lg bg-black/40 border border-purple-500/30">
                        <div className="flex items-center justify-between">
                            <p className="text-neutral-200">Training Level</p>
                            <LevelPill level={result.level} />
                        </div>

                        {/* Score bar */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-neutral-200">Strength Index</span>
                                <span className="text-neutral-100 font-semibold">{result.score}/100</span>
                            </div>
                            <div className="h-2.5 w-full rounded bg-neutral-800 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-emerald-500"
                                    style={{ width: `${result.score}%` }}
                                />
                            </div>
                        </div>

                        {/* Next targets */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg border border-neutral-700/60 bg-neutral-900/40 p-3">
                                <p className="text-xs text-neutral-300">Next target (push-ups)</p>
                                <p className="text-lg font-semibold text-white">{result.targets.pushups} reps</p>
                            </div>
                            <div className="rounded-lg border border-neutral-700/60 bg-neutral-900/40 p-3">
                                <p className="text-xs text-neutral-300">Next target (pull-ups)</p>
                                <p className="text-lg font-semibold text-white">{result.targets.pullups} reps</p>
                            </div>
                        </div>

                        {/* Coaching tips */}
                        <div>
                            <p className="font-medium text-purple-200 mb-2">Quick Coaching</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-200">
                                {result.tips.map((t, i) => (
                                    <li key={i}>{t}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function WorkoutGenerator() {
    const [level, setLevel] = useState("")
    const [time, setTime] = useState("")
    const [equipment, setEquipment] = useState<string[]>([])
    const [focus, setFocus] = useState("")
    const [goal, setGoal] = useState("")
    const [constraints, setConstraints] = useState<string[]>([])
    const [workout, setWorkout] = useState<any>(null)

    const equipmentOptions = ["Pull-up bar", "Dip bars", "Rings", "Parallettes", "Bench/box", "Resistance band"]
    const focusOptions = ["Full Body", "Push", "Pull", "Legs", "Core", "Skills (handstand, muscle-up, L-sit)"]
    const goalOptions = ["General fitness", "Strength", "Hypertrophy", "Endurance", "Fat-loss"]
    const constraintOptions = ["No jumping", "No overhead pressing", "No wrist load", "No knee flexion", "Shoulder sensitive"]

    const handleEquipmentChange = (item: string, checked: boolean) =>
        setEquipment((prev) => (checked ? [...prev, item] : prev.filter((e) => e !== item)))

    const handleConstraintChange = (item: string, checked: boolean) =>
        setConstraints((prev) => (checked ? [...prev, item] : prev.filter((c) => c !== item)))

    const generateWorkout = () => {
        if (!level || !time || !focus || !goal) return
        const workoutData = generateAdvancedPlan(
            level as "Beginner" | "Intermediate" | "Advanced",
            Number.parseInt(time),
            equipment,
            focus as any,
            goal as any,
            constraints as any
        )
        setWorkout(workoutData)
    }

    return (
        <Card className={cardBase}>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Dumbbell className="h-6 w-6 text-purple-400" />
                    <CardTitle className={titleCls}>Quick Workout Generator — PRO</CardTitle>
                </div>
                <CardDescription className={descCls}>
                    Generate personalized workouts with professional coaching cues
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Level */}
                <div className="space-y-2">
                    <Label className="text-neutral-100">Training Level</Label>
                    <Select value={level} onValueChange={setLevel} >
                        <SelectTrigger className={fieldSelectTrigger}>
                            <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent className={fieldSelectContent} >
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Time */}
                <div className="space-y-2">
                    <Label className="text-neutral-100">Workout Duration</Label>
                    <Select value={time} onValueChange={setTime}>
                        <SelectTrigger className={fieldSelectTrigger}>
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent className={fieldSelectContent}>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="25">25 minutes</SelectItem>
                            <SelectItem value="40">40 minutes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Equipment */}
                <div className="space-y-3">
                    <Label className="text-neutral-100">Available Equipment (select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {equipmentOptions.map((item) => (
                            <div key={item} className="flex items-center space-x-2">
                                <Checkbox
                                    id={item}
                                    checked={equipment.includes(item)}
                                    onCheckedChange={(checked) => handleEquipmentChange(item, checked as boolean)}
                                    className="border-neutral-600 data-[state=checked]:bg-purple-600"
                                />
                                <Label htmlFor={item} className="text-sm text-neutral-100">
                                    {item}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Focus */}
                <div className="space-y-2">
                    <Label className="text-neutral-100">Workout Focus</Label>
                    <Select value={focus} onValueChange={setFocus}>
                        <SelectTrigger className={fieldSelectTrigger}>
                            <SelectValue placeholder="Select focus area" />
                        </SelectTrigger>
                        <SelectContent className={fieldSelectContent}>
                            {focusOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Goal */}
                <div className="space-y-2">
                    <Label className="text-neutral-100">Primary Goal</Label>
                    <Select value={goal} onValueChange={setGoal}>
                        <SelectTrigger className={fieldSelectTrigger}>
                            <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent className={fieldSelectContent}>
                            {goalOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Constraints */}
                <div className="space-y-3">
                    <Label className="text-neutral-100">Constraints (optional)</Label>
                    <div className="grid grid-cols-1 gap-2">
                        {constraintOptions.map((item) => (
                            <div key={item} className="flex items-center space-x-2">
                                <Checkbox
                                    id={item}
                                    checked={constraints.includes(item)}
                                    onCheckedChange={(checked) => handleConstraintChange(item, checked as boolean)}
                                    className="border-neutral-600 data-[state=checked]:bg-purple-600"
                                />
                                <Label htmlFor={item} className="text-sm text-neutral-100">
                                    {item}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={generateWorkout}
                    disabled={!level || !time || !focus || !goal}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60"
                >
                    Generate PRO Workout
                </Button>

                {/* Workout Results */}
                {workout && (
                    <div className="space-y-4 p-6 bg-black/40 border border-purple-500/30 rounded-lg">
                        <div className="text-center border-b border-purple-500/30 pb-4">
                            <h3 className="text-xl font-bold text-purple-200">{workout.header.title}</h3>
                            <p className="text-neutral-200 mt-1">{workout.header.intent}</p>
                            <p className="text-sm text-purple-200/90 mt-1">Structure: {workout.header.structure}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-purple-200 mb-2 flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Warm-up (3-4 min)
                            </h4>
                            <ul className="space-y-1 text-sm text-neutral-200">
                                {workout.warmup.map((item: string, i: number) => (
                                    <li key={i}>• {item}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-purple-200 mb-2 flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Main Block — {workout.main.blocks.length > 1 ? "Supersets" : workout.main.blocks[0]?.title}
                            </h4>
                            <div className="space-y-4">
                                {workout.main.blocks.map((block: any, blockIndex: number) => (
                                    <div key={blockIndex} className="bg-neutral-950/60 p-4 rounded">
                                        <h5 className="text-purple-200 font-medium mb-2">{block.title}</h5>
                                        <div className="space-y-2">
                                            {block.items.map((exercise: any, index: number) => (
                                                <div key={index} className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium">{exercise.name}</p>
                                                        <p className="text-sm text-neutral-300">
                                                            {exercise.sets} sets × {exercise.reps} • Rest {exercise.rest} • {exercise.rir}
                                                        </p>
                                                        {exercise.tempo && (
                                                            <p className="text-xs text-purple-200/90">Tempo: {exercise.tempo}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className={smallNote}>Complete {workout.main.rounds} rounds</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {workout.finisher && (
                            <div>
                                <h4 className="font-semibold text-purple-200 mb-2 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Finisher
                                </h4>
                                <div className="bg-neutral-950/60 p-3 rounded">
                                    <p className="text-sm text-neutral-200">{workout.finisher}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="font-semibold text-purple-200 mb-2">Cooldown (2-3 min)</h4>
                            <ul className="space-y-1 text-sm text-neutral-200">
                                {workout.cooldown.map((item: string, i: number) => (
                                    <li key={i}>• {item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t border-purple-500/30 pt-4">
                            <h4 className="font-semibold text-purple-200 mb-2">Coaching Notes</h4>
                            <ul className="space-y-1 text-xs text-neutral-300">
                                {workout.notes.map((note: string, i: number) => (
                                    <li key={i}>• {note}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function BMICalculator() {
    const [height, setHeight] = useState("")
    const [weight, setWeight] = useState("")
    const [waist, setWaist] = useState("") // optional, for WHtR
    const [unit, setUnit] = useState<"metric" | "imperial">("metric")
    const [result, setResult] = useState<{
        bmi: number
        category: string
        healthyMin: number
        healthyMax: number
        whtr?: number
        whtrFlag?: "OK" | "Caution" | "High"
    } | null>(null)

    const calc = () => {
        const w = Number.parseFloat(weight)
        const h = Number.parseFloat(height)
        if (!w || !h) return

        let bmi: number
        let hMeters: number
        if (unit === "metric") {
            hMeters = h / 100
            bmi = w / (hMeters * hMeters)
        } else {
            // inches + lbs
            hMeters = h * 0.0254
            const kg = w * 0.453592
            bmi = kg / (hMeters * hMeters)
        }

        // healthy weight range for given height (BMI 18.5–24.9)
        const healthyMin = 18.5 * hMeters * hMeters
        const healthyMax = 24.9 * hMeters * hMeters
        const category =
            bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese"

        // Waist-to-height ratio (optional, more informative for central adiposity)
        let whtr: number | undefined
        let whtrFlag: "OK" | "Caution" | "High" | undefined
        if (waist) {
            const wNum = Number.parseFloat(waist)
            const waistMeters =
                unit === "metric" ? wNum / 100 : (wNum * 2.54) / 100
            whtr = Math.round((waistMeters / hMeters) * 100) / 100
            whtrFlag = whtr < 0.5 ? "OK" : whtr < 0.6 ? "Caution" : "High"
        }

        setResult({
            bmi: Math.round(bmi * 10) / 10,
            category,
            healthyMin: Math.round(healthyMin * (unit === "metric" ? 1 : 2.20462)),
            healthyMax: Math.round(healthyMax * (unit === "metric" ? 1 : 2.20462)),
            whtr,
            whtrFlag,
        })
    }

    const unitLabel = (m: string, i: string) => (unit === "metric" ? m : i)

    const CatPill = ({ cat }: { cat: string }) => {
        const map: Record<string, string> = {
            "Underweight": "bg-sky-950/40 text-sky-200 border-sky-500/30",
            "Normal weight": "bg-emerald-950/40 text-emerald-200 border-emerald-500/30",
            "Overweight": "bg-amber-950/40 text-amber-200 border-amber-500/30",
            "Obese": "bg-rose-950/40 text-rose-200 border-rose-500/30",
        }
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${map[cat]}`}>{cat}</span>
    }

    const rangeColor = (bmi: number) =>
        bmi < 18.5 ? "from-sky-500 to-sky-400"
            : bmi < 25 ? "from-emerald-500 to-emerald-400"
                : bmi < 30 ? "from-amber-500 to-amber-400"
                    : "from-rose-500 to-rose-400"

    return (
        <Card className="bg-neutral-850/90 border border-neutral-700 shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Calculator className="h-6 w-6 text-purple-400" />
                    <CardTitle className="text-2xl text-white">BMI Calculator</CardTitle>
                </div>
                <CardDescription className="text-neutral-200">
                    Get BMI + healthy weight range for your height. Optionally add waist to see WHtR.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Unit */}
                <div className="space-y-2">
                    <Label className="text-neutral-100">Unit System</Label>
                    <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
                        <SelectTrigger className="bg-neutral-900/80 text-white border-neutral-700 focus:ring-2 focus:ring-purple-400/80">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border text-white border-neutral-700">
                            <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                            <SelectItem value="imperial">Imperial (in, lbs)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="height" className="text-neutral-100">Height ({unitLabel("cm", "in")})</Label>
                        <Input
                            id="height"
                            type="number"
                            placeholder={unit === "metric" ? "e.g., 175" : "e.g., 69"}
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="bg-neutral-900/80 border-neutral-700 text-white placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-purple-400/80"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="weight" className="text-neutral-100">Weight ({unitLabel("kg", "lbs")})</Label>
                        <Input
                            id="weight"
                            type="number"
                            placeholder={unit === "metric" ? "e.g., 70" : "e.g., 154"}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="bg-neutral-900/80 border-neutral-700 text-white placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-purple-400/80"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="waist" className="text-neutral-100">
                            Waist ({unitLabel("cm", "in")}) <span className="text-xs text-neutral-400">(optional)</span>
                        </Label>
                        <Input
                            id="waist"
                            type="number"
                            placeholder={unit === "metric" ? "e.g., 80" : "e.g., 32"}
                            value={waist}
                            onChange={(e) => setWaist(e.target.value)}
                            className="bg-neutral-900/80 border-neutral-700 text-white placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-purple-400/80"
                        />
                    </div>
                </div>

                <Button onClick={calc} className="w-full bg-purple-600 hover:bg-purple-700">
                    Calculate
                </Button>

                {result && (
                    <div className="space-y-5 p-5 rounded-lg bg-black/40 border border-purple-500/30">
                        {/* BMI + bar */}
                        <div className="flex items-center justify-between">
                            <div className="text-neutral-200">BMI</div>
                            <CatPill cat={result.category} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-semibold text-white">{result.bmi}</div>
                            <div className="w-2/3">
                                <div className="h-2.5 w-full rounded bg-neutral-800 overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${rangeColor(result.bmi)}`}
                                        style={{ width: `${Math.min(100, (result.bmi / 40) * 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                                    <span>18.5</span><span>25</span><span>30</span><span>40</span>
                                </div>
                            </div>
                        </div>

                        {/* Healthy range */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg border border-neutral-700/60 bg-neutral-900/40 p-3">
                                <p className="text-xs text-neutral-300">Healthy weight min</p>
                                <p className="text-lg font-semibold text-white">
                                    {result.healthyMin} {unitLabel("kg", "lbs")}
                                </p>
                            </div>
                            <div className="rounded-lg border border-neutral-700/60 bg-neutral-900/40 p-3">
                                <p className="text-xs text-neutral-300">Healthy weight max</p>
                                <p className="text-lg font-semibold text-white">
                                    {result.healthyMax} {unitLabel("kg", "lbs")}
                                </p>
                            </div>
                        </div>

                        {/* WHtR */}
                        {"whtr" in result && result.whtr !== undefined && (
                            <div className="rounded-lg border border-neutral-700/60 bg-neutral-900/40 p-3">
                                <p className="text-xs text-neutral-300 mb-1">Waist-to-Height Ratio</p>
                                <p className="text-white font-semibold">
                                    {result.whtr}{" "}
                                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${
                                        result.whtrFlag === "OK"
                                            ? "bg-emerald-950/40 text-emerald-200 border-emerald-500/30"
                                            : result.whtrFlag === "Caution"
                                                ? "bg-amber-950/40 text-amber-200 border-amber-500/30"
                                                : "bg-rose-950/40 text-rose-200 border-rose-500/30"
                                    }`}>
                    {result.whtrFlag}
                  </span>
                                </p>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Aim for &lt; 0.5 (general guideline).
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

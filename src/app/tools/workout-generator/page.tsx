"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@calis/components/ui/card";
import { Dumbbell, Route, Sparkles, Timer, ListChecks } from "lucide-react";

const Button = (props: any) => (
    <button
        {...props}
        className={
            "inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-gray-900 px-4 py-2 text-sm text-purple-200 hover:border-purple-500/70 hover:text-white transition " +
            (props.className || "")
        }
    />
);

const Input = (props: any) => (
    <input
        {...props}
        className={
            "w-full rounded-lg bg-gray-900/60 border border-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600/40 " +
            (props.className || "")
        }
    />
);

const Select = (props: any) => (
    <select
        {...props}
        className={
            "w-full rounded-lg bg-gray-900/60 border border-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600/40 " +
            (props.className || "")
        }
    />
);

const Label = ({ children, htmlFor }: { children: any; htmlFor?: string }) => (
    <label htmlFor={htmlFor} className="text-xs uppercase tracking-wider text-gray-400">
        {children}
    </label>
);

// -----------------------------
// Types
// -----------------------------

type Intake = {
    age: number;
    sex: "M" | "F" | "";
    experience: "beginner" | "intermediate" | "advanced";
    goal: "build_muscle" | "fat_loss" | "endurance" | "first_pullup" | "skills";
    days_per_week: number;
    session_length: number; // minutes
    equipment: { bar: boolean; dip: boolean; rings: boolean; bands: boolean };
    pushups_max: number;
    pullups_max: number;
    squats_max: number;
    plank_max_sec: number;
    split_type: "full_body" | "upper_lower" | "push_pull_legs";
    focus: "strength" | "hypertrophy" | "mixed";
    exclusions: string[];
};

type Block = {
    title: string;
    detail?: string;
    prescription?: string;
};

type Session = {
    name: string;
    blocks: Block[];
};

// -----------------------------
// Helpers (scores + logic)
// -----------------------------

function clamp01(n: number) {
    return Math.max(0, Math.min(1, n));
}

function mean(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
}

function strengthScores(i: Intake) {
    const push = clamp01(i.pushups_max / 30);
    const pull = clamp01(i.pullups_max / 15);
    const legs = clamp01(i.squats_max / 50);
    const core = clamp01(i.plank_max_sec / 120);
    const overall = mean([push, pull, legs, core]);
    const bandLevel = i.pullups_max <= 2 ? "assist" : i.pullups_max <= 5 ? "light" : "none";
    let bucket: "B" | "I" | "A" = "B";
    if (overall >= 0.75) bucket = "A"; else if (overall >= 0.45) bucket = "I";
    return { push, pull, legs, core, overall, bucket, bandLevel };
}

function repTarget(max: number, focus: Intake["focus"]) {
    // choose a multiplier range based on goal/focus
    const r =
        focus === "strength"
            ? [0.55, 0.65]
            : focus === "hypertrophy"
                ? [0.6, 0.75]
                : [0.55, 0.65]; // mixed
    const val = Math.round(max * ((r[0] + r[1]) / 2));
    return Math.max(3, val);
}

function buildSessionA(i: Intake) : Session {
    const scores = strengthScores(i);
    const pushReps = repTarget(i.pushups_max, i.focus);
    const pullMain = scores.bandLevel !== "none" ?
        {
            title: scores.bandLevel === "assist" ? "Band-Assisted Pull-ups" : "Light-Band Pull-ups",
            prescription: scores.bandLevel === "assist" ? "5×5 (2s up / 3s down)" : "5×6 (controlled)"
        } :
        { title: "Pull-ups", prescription: "5×5 (RPE 7–8)" };

    const blocks: Block[] = [
        { title: "Warm-up", detail: "Scap circles • wrist rocks • band face pulls 2×12" },
        { title: "Push-ups", prescription: `4×${pushReps} (target 12–15) — rest 90–120s` },
        { title: pullMain.title, prescription: pullMain.prescription },
        { title: "Bulgarian Split Squat", prescription: "3×8/side (tempo 2–0–2)" },
        { title: "Bench/Box Dips (assisted as needed)", prescription: "3×10–12" },
        { title: "RKC Plank", prescription: "3×25–35s" },
        { title: "Finisher (optional)", detail: "EMOM 6’ → 6 push-ups / 4 ring rows" },
    ];
    return { name: "Day A — Push Emphasis", blocks };
}

function buildSessionB(i: Intake) : Session {
    const scores = strengthScores(i);
    const inclineReps = Math.max(12, repTarget(i.pushups_max, "hypertrophy"));
    const pullMain: Block =
        i.pullups_max >= 3
            ? { title: "Negative Pull-ups", prescription: "5×3 (jump to top, 5s down)" }
            : { title: "Ring/Band Rows", prescription: "4×10–12 (strict)" };

    const blocks: Block[] = [
        { title: "Warm-up", detail: "Dead hang 2×30s • band lat pulldown 2×12 • hip openers" },
        pullMain,
        { title: "Incline Push-ups", prescription: `4×${inclineReps}` },
        { title: "Tempo Squats", prescription: "3×12 (3s down, 1s pause)" },
        { title: "Ring Rows", prescription: "3×10–12" },
        { title: "Hollow Body Hold", prescription: "4×20–25s" },
        { title: "Suitcase Carry", prescription: "3×20m/side" },
    ];
    return { name: "Day B — Pull Emphasis", blocks };
}

function buildSessionC(i: Intake) : Session {
    const pullBlock: Block = i.pullups_max >= 3
        ? { title: "Band-Assisted Pull-ups", prescription: "4×6" }
        : { title: "Ring/Band Rows", prescription: "4×12" };
    const pushReps = Math.max(10, Math.round(i.pushups_max * 0.55));
    const blocks: Block[] = [
        { title: "Warm-up", detail: "Ankle rocks • cossack prep • band pull-aparts 2×15" },
        { title: "Reverse Lunges", prescription: "4×10/side" },
        pullBlock,
        { title: "Push-ups", prescription: `3×${pushReps}` },
        { title: "Hip Hinge (BW Good-morning)", prescription: "3×15" },
        { title: "Hanging Knee Raises", prescription: "4×6–8 (slow)" },
        { title: "Finisher", detail: "5’ AMRAP → 6 squats + 6 incline push-ups + 20s plank" },
    ];
    return { name: "Day C — Legs/Core Emphasis", blocks };
}

function buildPlan(i: Intake) {
    const sessions: Session[] = [buildSessionA(i), buildSessionB(i), buildSessionC(i)];
    return {
        meta: {
            bucket: strengthScores(i).bucket,
            notes: [
                "If you hit top of the rep range on all sets, add +1 rep next week",
                "If pull-ups are too hard, increase assistance; if easy, reduce assistance",
                "Deload every 5th week by reducing total sets by ~30%",
            ],
        },
        sessions,
    };
}

// -----------------------------
// Page Component
// -----------------------------

export default function WorkoutGeneratorPage() {
    const [form, setForm] = useState<Intake>({
        age: 21,
        sex: "M",
        experience: "beginner",
        goal: "build_muscle",
        days_per_week: 3,
        session_length: 45,
        equipment: { bar: true, dip: true, rings: false, bands: true },
        pushups_max: 22,
        pullups_max: 3,
        squats_max: 45,
        plank_max_sec: 60,
        split_type: "full_body",
        focus: "mixed",
        exclusions: [],
    });

    const plan = useMemo(() => buildPlan(form), [form]);

    function handleChange<K extends keyof Intake>(key: K, value: Intake[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <main className="container mx-auto px-4 py-10">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold">
                            Workout <span className="text-purple-500">Generator</span>
                        </h1>
                        <p className="text-gray-400 mt-2 max-w-2xl">
                            Instantly create personalized calisthenics workouts tailored to your level and goals. Balanced, progressive, and practical.
                        </p>
                    </div>
                    <Link href="/tools" className="text-sm text-gray-400 hover:text-purple-300">← Back to Tools</Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Intake Form */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="text-purple-500"><Route className="h-6 w-6" /></div>
                                <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">Programming</span>
                            </div>
                            <CardTitle className="text-xl">Your Details</CardTitle>
                            <CardDescription className="text-gray-400">Fill what you know — defaults are okay.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Age</Label>
                                    <Input type="number" value={form.age} onChange={(e:any)=>handleChange("age", Number(e.target.value))} />
                                </div>
                                <div>
                                    <Label>Sex</Label>
                                    <Select value={form.sex} onChange={(e:any)=>handleChange("sex", e.target.value)}>
                                        <option value="">Prefer not to say</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Experience</Label>
                                    <Select value={form.experience} onChange={(e:any)=>handleChange("experience", e.target.value)}>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Goal</Label>
                                    <Select value={form.goal} onChange={(e:any)=>handleChange("goal", e.target.value)}>
                                        <option value="build_muscle">Build Muscle</option>
                                        <option value="fat_loss">Fat Loss</option>
                                        <option value="endurance">Endurance</option>
                                        <option value="first_pullup">First Pull-up</option>
                                        <option value="skills">Skills</option>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Days / Week</Label>
                                    <Input type="number" min={2} max={6} value={form.days_per_week} onChange={(e:any)=>handleChange("days_per_week", Number(e.target.value))} />
                                </div>
                                <div>
                                    <Label>Session Length (min)</Label>
                                    <Input type="number" min={30} max={90} value={form.session_length} onChange={(e:any)=>handleChange("session_length", Number(e.target.value))} />
                                </div>

                                <div className="md:col-span-2">
                                    <Label>Equipment</Label>
                                    <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                                        {[
                                            {k:"bar", label:"Bar"},
                                            {k:"dip", label:"Dip Station"},
                                            {k:"rings", label:"Rings"},
                                            {k:"bands", label:"Bands"},
                                        ].map((item:any)=> (
                                            <button
                                                key={item.k}
                                                onClick={() => handleChange("equipment", { ...form.equipment, [item.k]: !form.equipment[item.k as keyof typeof form.equipment] })}
                                                className={(form.equipment as any)[item.k] ?
                                                    "rounded-lg border border-purple-500/50 bg-purple-500/10 px-3 py-2" :
                                                    "rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-gray-300"}
                                            >{item.label}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-2">
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <div>
                                            <Label>Push-ups Max</Label>
                                            <Input type="number" min={0} value={form.pushups_max} onChange={(e:any)=>handleChange("pushups_max", Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <Label>Pull-ups Max</Label>
                                            <Input type="number" min={0} value={form.pullups_max} onChange={(e:any)=>handleChange("pullups_max", Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <Label>Squats Max</Label>
                                            <Input type="number" min={0} value={form.squats_max} onChange={(e:any)=>handleChange("squats_max", Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <Label>Plank Max (sec)</Label>
                                            <Input type="number" min={0} value={form.plank_max_sec} onChange={(e:any)=>handleChange("plank_max_sec", Number(e.target.value))} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label>Split Type</Label>
                                    <Select value={form.split_type} onChange={(e:any)=>handleChange("split_type", e.target.value)}>
                                        <option value="full_body">Full Body</option>
                                        <option value="upper_lower">Upper / Lower</option>
                                        <option value="push_pull_legs">Push / Pull / Legs</option>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Focus</Label>
                                    <Select value={form.focus} onChange={(e:any)=>handleChange("focus", e.target.value)}>
                                        <option value="strength">Strength</option>
                                        <option value="hypertrophy">Hypertrophy</option>
                                        <option value="mixed">Mixed</option>
                                    </Select>
                                </div>

                                <div className="md:col-span-2 flex items-center justify-between pt-2">
                                    <p className="text-xs text-gray-400">We’ll auto-balance push / pull / legs / core and scale volume to your level.</p>
                                    <Button onClick={() => {
                                        // no-op: plan recomputes automatically; button is for UX
                                    }}>
                                        <Sparkles className="h-4 w-4" /> Generate Plan
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: Output */}
                    <div className="space-y-6">
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="text-purple-500"><Dumbbell className="h-6 w-6" /></div>
                                    <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">Plan</span>
                                </div>
                                <CardTitle className="text-xl">Weekly Structure</CardTitle>
                                <CardDescription className="text-gray-400">Auto-scaled from your max tests. Bucket: <span className="text-purple-400 font-medium">{strengthScores(form).bucket === "B" ? "Beginner" : strengthScores(form).bucket === "I" ? "Intermediate" : "Advanced"}</span></CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                                    {plan.meta.notes.map((n, idx) => (
                                        <li key={idx}>{n}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {plan.sessions.map((s, idx) => (
                            <Card key={idx} className="bg-gray-900 border-gray-800">
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-purple-400">
                                        <Timer className="h-4 w-4" />
                                        <span className="text-xs uppercase tracking-wider">Session {idx + 1}</span>
                                    </div>
                                    <CardTitle className="text-lg">{s.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {s.blocks.map((b, i2) => (
                                            <div key={i2} className="rounded-xl border border-gray-800 bg-black/40 p-3">
                                                <div className="font-medium text-white">{b.title}</div>
                                                {b.prescription && (
                                                    <div className="text-sm text-purple-300 mt-1">{b.prescription}</div>
                                                )}
                                                {b.detail && (
                                                    <div className="text-sm text-gray-400 mt-1">{b.detail}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

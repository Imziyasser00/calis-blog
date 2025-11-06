export type Level = "beginner" | "intermediate" | "advanced" | "";
export type Goal = "strength" | "endurance" | "skills" | "balanced" | "";

export type FormData = { level: Level; goal: Goal; days: number; equipment: string[] };

export type Plan = {
    title: string;
    level: string;
    goal: string;
    workouts: Array<{
        day: number;
        name: string;
        type: string;
        duration: string;
        exercises: Array<{ name: string; sets: number; reps: string }>;
    }>;
};

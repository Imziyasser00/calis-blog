export type ExerciseCard = {
    _id: string;
    name: string;
    slug: string;
    shortDescription?: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    primaryMuscles?: string[];
    coverImage?: { url: string; alt?: string };
};

export type ProgrammingLevel = {
    sets?: number;
    reps?: string;
    rir?: number | string;
    tempo?: string;
    rest?: string;
    notes?: string;
};

export type ExerciseDetail = {
    _id: string;
    name: string;
    slug: string;
    shortDescription?: string;
    body?: any;
    difficulty: string;
    type: string;
    primaryMuscles?: { name: string; slug: string }[];
    secondaryMuscles?: { name: string; slug: string }[];
    equipment?: { name: string; slug: string }[];
    tags?: { label: string; slug: string }[];
    coverImage?: { url: string; alt?: string };
    gallery?: { url: string; alt?: string }[];
    demoVideoUrl?: string;
    gif?: { url: string; alt?: string };
    setup?: string[];
    execution?: { title: string; text: string; image?: { url: string; alt?: string } }[];
    cues?: string[];
    commonMistakes?: { title: string; fix: string; image?: { url: string; alt?: string } }[];
    safetyNotes?: string;
    contraindications?: string[];
    programming?: {
        beginner?: ProgrammingLevel;
        intermediate?: ProgrammingLevel;
        advanced?: ProgrammingLevel;
    };
    tempo?: string;
    rest?: string;
    regressions?: { name: string; slug: string; coverImage?: { url: string; alt?: string } }[];
    progressions?: { name: string; slug: string; coverImage?: { url: string; alt?: string } }[];
    variations?: { name: string; slug: string; coverImage?: { url: string; alt?: string } }[];
    seo?: { metaTitle?: string; metaDescription?: string; canonicalUrl?: string; ogImage?: { url: string; alt?: string } };
    publishedAt?: string;
};

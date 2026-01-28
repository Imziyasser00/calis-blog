export type YesKindaNo = "yes" | "kinda" | "no";

export type HangTimeBucket = "<10" | "10-30" | "30-60" | "60+";

export type TrainDays = 1 | 2 | 3 | 4;

export type FailurePoint =
    | "start"
    | "middle"
    | "top"
    | "grip";

export type LatFeel = "yes" | "sometimes" | "no";

export type Pain = "none" | "elbow" | "shoulder" | "wrist";

export type Answers = {
    maxPullups: number; // 0..30
    negative: YesKindaNo;
    hangTime: HangTimeBucket;
    weightKg?: number; // optional
    trainDays: TrainDays;
    failPoint: FailurePoint;
    latFeel: LatFeel;
    pain: Pain;
};

export type BlockerKey =
    | "grip"
    | "eccentric"
    | "scap"
    | "strength"
    | "topRange"
    | "bodyweight";

export type DiagnosticResult = {
    primary: BlockerKey;
    secondary?: BlockerKey;
    scores: Record<BlockerKey, number>;
    pain: Pain;
    notes: string[];
};

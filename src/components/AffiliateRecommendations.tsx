"use client";

import React from "react";
import {
    Sparkles,
    ArrowUpRight,
    Shield,
    Dumbbell,
    Link as LinkIcon,
    Zap,
} from "lucide-react";

interface Product {
    name: string;
    description: string;
    link: string;
    tag?: string; // small badge text
    icon?: "bands" | "bar" | "belt" | "vest" | "sleeves" | "plates" | "rings";
}

function getProducts(level: string): Product[] {
    if (level === "beginner") {
        return [
            {
                name: "Resistance Bands Set",
                description: "Perfect for assisted pull-ups and progressive overload.",
                link: "https://amzn.to/4cw8Kd5",
                tag: "Best for first reps",
                icon: "bands",
            },
            {
                name: "Door Pull-Up Bar",
                description: "Start training at home instantly.",
                link: "https://amzn.to/4rjf1gK",
                tag: "Home setup",
                icon: "bar",
            },
        ];
    }

    if (level === "intermediate") {
        return [
            {
                name: "Dip Belt",
                description: "Add weight to pull-ups and dips safely.",
                link: "https://amzn.to/4tALSPE",
                tag: "Progress faster",
                icon: "belt",
            },
            {
                name: "Weighted Vest",
                description: "Progress beyond bodyweight easily.",
                link: "https://amzn.to/4tCfjkx",
                tag: "Versatile",
                icon: "vest",
            },
        ];
    }

    if (level === "advanced") {
        return [
            {
                name: "Heavy Duty Dip Belt",
                description: "Handle serious added weight.",
                link: "https://amzn.to/4rjf4ZY",
                tag: "Heavy loads",
                icon: "belt",
            },
            {
                name: "Elbow Sleeves",
                description: "Protect your joints under heavy load.",
                link: "https://amzn.to/3Oefi6d",
                tag: "Joint support",
                icon: "sleeves",
            },
        ];
    }

    return [
        {
            name: "Fractional Plates",
            description: "Micro-progress for elite strength gains.",
            link: "https://amzn.to/4axJMY5",
            tag: "Micro loading",
            icon: "plates",
        },
        {
            name: "Premium Gym Rings",
            description: "Upgrade your setup.",
            link: "https://amzn.to/3ZXKM3b",
            tag: "Skill + strength",
            icon: "rings",
        },
    ];
}

function getLevel(strengthRatio: number) {
    return strengthRatio < 1
        ? "beginner"
        : strengthRatio < 1.3
            ? "intermediate"
            : strengthRatio < 1.7
                ? "advanced"
                : "elite";
}

function getLevelLabel(level: string) {
    switch (level) {
        case "beginner":
            return "Beginner";
        case "intermediate":
            return "Intermediate";
        case "advanced":
            return "Advanced";
        default:
            return "Elite";
    }
}

function iconFor(kind?: Product["icon"]) {
    const cls = "h-5 w-5";
    switch (kind) {
        case "bands":
            return <Zap className={`${cls} text-cyan-300`} />;
        case "bar":
            return <LinkIcon className={`${cls} text-purple-300`} />;
        case "belt":
            return <Dumbbell className={`${cls} text-pink-300`} />;
        case "vest":
            return <Dumbbell className={`${cls} text-cyan-300`} />;
        case "sleeves":
            return <Shield className={`${cls} text-purple-300`} />;
        case "plates":
            return <Dumbbell className={`${cls} text-orange-300`} />;
        case "rings":
            return <Sparkles className={`${cls} text-pink-300`} />;
        default:
            return <Sparkles className={`${cls} text-purple-300`} />;
    }
}

export default function AffiliateRecommendations({
                                                     strengthRatio,
                                                 }: {
    strengthRatio: number;
}) {
    const level = getLevel(strengthRatio);
    const products = getProducts(level);

    return (
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 space-y-5">
            {/* soft glow background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(168,85,247,0.14),transparent_45%),radial-gradient(circle_at_50%_120%,rgba(244,114,182,0.10),transparent_40%)]" />

            <div className="relative flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-300" />
                        Recommended Gear
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        Based on your current strength level.
                    </p>
                </div>

                <span className="shrink-0 text-xs px-3 py-1 rounded-full border border-white/10 bg-black/30 text-gray-200">
          {getLevelLabel(level)}
        </span>
            </div>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p) => (
                    <a
                        key={p.name}
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:bg-white/5 hover:-translate-y-[1px]"
                    >
                        {/* hover glow */}
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.18),transparent_55%)]" />

                        <div className="relative flex items-start gap-3">
                            <div className="h-11 w-11 rounded-2xl border border-white/10 bg-black/35 flex items-center justify-center">
                                {iconFor(p.icon)}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="font-semibold text-gray-100 truncate">
                                        {p.name}
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-200 transition" />
                                </div>

                                <div className="text-sm text-gray-400 mt-1 leading-relaxed">
                                    {p.description}
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                    {p.tag ? (
                                        <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-gray-200">
                      {p.tag}
                    </span>
                                    ) : null}

                                    <span className="text-xs text-gray-500">
                    Amazon link
                  </span>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            <div className="relative text-xs text-gray-500">
                As an Amazon Associate, we may earn from qualifying purchases.
            </div>
        </section>
    );
}

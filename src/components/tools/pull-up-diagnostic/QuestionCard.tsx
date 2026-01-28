"use client";

import React from "react";

export default function QuestionCard({
                                         title,
                                         subtitle,
                                         children,
                                     }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                {subtitle ? (
                    <p className="mt-1 text-sm text-white/60">{subtitle}</p>
                ) : null}
            </div>
            {children}
        </div>
    );
}

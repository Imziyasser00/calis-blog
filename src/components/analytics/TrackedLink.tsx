"use client";

import Link from "next/link";
import { trackEvent } from "@calis/lib/analytics/track";

export default function TrackedLink({
                                        href,
                                        eventType,
                                        metadata,
                                        className,
                                        children,
                                    }: {
    href: string;
    eventType: string;
    metadata?: Record<string, any>;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={className}
            onClick={() => trackEvent(eventType, metadata ?? {})}
        >
            {children}
        </Link>
    );
}

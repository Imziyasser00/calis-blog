"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    ArrowRight,
    Sparkles,
    Mail,
    BookOpen,
    Hash,
    Wrench,
    Info,
    FolderOpen,
} from "lucide-react";

type IconKey = "sparkles" | "book" | "hash" | "wrench" | "folder" | "info" | "mail";

const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
    sparkles: Sparkles,
    book: BookOpen,
    hash: Hash,
    wrench: Wrench,
    folder: FolderOpen,
    info: Info,
    mail: Mail,
};

type NavItem = {
    href: string;
    label: string;
    icon: IconKey;
    subtle?: boolean;
};

export default function MobileMenuClient({ items }: { items: NavItem[] }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => setOpen(false), [pathname]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    return (
        <>
            <button
                className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
            >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {open && (
                <div id="mobile-menu" className="md:hidden fixed inset-0 z-[60] bg-black" role="dialog" aria-modal="true">
                    <div className="h-14 px-3 flex items-center justify-between border-b border-white/10">
                        <span className="text-sm text-white/70">Menu</span>
                        <button
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition"
                            onClick={() => setOpen(false)}
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav aria-label="Mobile navigation" className="px-3 py-4 space-y-2">
                        {items.map((item) => {
                            const Icon = ICONS[item.icon];
                            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={[
                                        "flex items-center justify-between rounded-xl px-3 py-3 transition",
                                        active
                                            ? "border border-purple-500/30 bg-purple-500/10 text-white"
                                            : "border border-white/10 bg-white/5 text-white/85 hover:bg-white/10",
                                    ].join(" ")}
                                    onClick={() => setOpen(false)}
                                    aria-current={active ? "page" : undefined}
                                >
                                    <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black border border-white/10">
                      <Icon className="h-4 w-4 text-purple-300" />
                    </span>
                                        <span className="font-medium">{item.label}</span>
                                    </div>

                                    <ArrowRight className="h-4 w-4 text-white/40" />
                                </Link>
                            );
                        })}

                        <div className="pt-3">
                            <Link
                                href="/#newsletter"
                                onClick={() => setOpen(false)}
                                className="w-full h-11 text-base inline-flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 transition font-medium"
                            >
                                Subscribe
                            </Link>
                            <p className="mt-2 text-xs text-white/50 px-1">No spam. One-click unsubscribe.</p>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}

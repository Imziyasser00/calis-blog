"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@calis/components/ui/button";
import {
    Menu,
    X,
    Sparkles,
    Mail,
    ArrowRight,
    BookOpen,
    Hash,
    Wrench,
    Info,
} from "lucide-react";

type NavItem = {
    href: string;
    label: string;
    icon?: any;
    subtle?: boolean;
};

export default function Header() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close on route change
    useEffect(() => setOpen(false), [pathname]);

    // Lock scroll when open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const navItems: NavItem[] = useMemo(
        () => [
            { href: "/", label: "Home" },
            { href: "/beginner-calisthenics", label: "Start Here", icon: Sparkles },
            { href: "/blog", label: "Blog", icon: BookOpen },
            { href: "/topics", label: "Topics", icon: Hash },
            { href: "/tools", label: "Tools", icon: Wrench },
            { href: "/about", label: "About", icon: Info },
            { href: "/contact", label: "Contact", icon: Mail, subtle: true },
        ],
        []
    );

    const isActive = (href: string) =>
        pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
        <header className="sticky top-0 z-50 w-full p-2 border-b border-white/10 bg-black">
            <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-14 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="group inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-lg font-bold tracking-tight text-white/90 hover:bg-white/10 transition"
                    aria-label="CalisHub home"
                >
                    <span className="text-white">Calis</span>
                    <span className="ml-1 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
            Hub
          </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1 text-sm">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition",
                                    item.subtle ? "text-white/55 hover:text-white/80" : "text-white/70 hover:text-white",
                                    active
                                        ? "text-white border border-purple-500/30 bg-purple-500/10"
                                        : "border border-transparent hover:border-white/10 hover:bg-white/5",
                                ].join(" ")}
                            >
                                {Icon ? <Icon className="h-4 w-4 text-purple-300/90" /> : null}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden sm:flex items-center gap-2">
                    <Link href="/#newsletter">
                        <Button
                            variant="outline"
                            className="h-9 px-3 border-purple-500/60 text-purple-300 bg-black hover:bg-purple-950/50 hover:text-white"
                        >
                            Subscribe
                        </Button>
                    </Link>
                </div>

                {/* Mobile button */}
                <button
                    className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                    aria-expanded={open}
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile FULLSCREEN menu */}
            {open && (
                <div className="md:hidden fixed inset-0 z-[60] bg-black">
                    {/* top bar */}
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

                    {/* content */}
                    <div className="px-3 py-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

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
                                >
                                    <div className="flex items-center gap-3">
                                        {Icon ? (
                                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black border border-white/10">
                        <Icon className="h-4 w-4 text-purple-300" />
                      </span>
                                        ) : (
                                            <span className="inline-flex h-9 w-9" />
                                        )}
                                        <span className="font-medium">{item.label}</span>
                                    </div>

                                    <ArrowRight className="h-4 w-4 text-white/40" />
                                </Link>
                            );
                        })}

                        <div className="pt-3">
                            <Link href="/#newsletter" onClick={() => setOpen(false)}>
                                <Button className="w-full h-11 text-base bg-purple-600 hover:bg-purple-700">
                                    Subscribe
                                </Button>
                            </Link>
                            <p className="mt-2 text-xs text-white/50 px-1">
                                No spam. One-click unsubscribe.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

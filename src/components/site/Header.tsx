"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@calis/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

export default function Header() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // close mobile menu on route change
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const navItems = [
        { href: "/", label: "Home" },
        { href: "/beginner-calisthenics", label: "Start Here", icon: Sparkles },
        { href: "/blog", label: "Blog" },
        { href: "/topics", label: "Topics" },
        { href: "/tools", label: "Tools" },
        { href: "/about", label: "About" },
        // removed Exercises
    ];

    const isActive = (href: string) =>
        pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
        <header className="w-full bg-black border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-3xl font-bold tracking-tighter px-3 py-2 border border-gray-800 rounded-lg hover:border-purple-500 transition-colors"
                >
                    Calis<span className="text-purple-500">Hub</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center space-x-6 text-sm">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "transition-colors px-2 py-1 inline-flex items-center gap-2",
                                    isActive(item.href)
                                        ? "text-purple-500 font-semibold border-b-2 border-purple-500"
                                        : "text-gray-400 hover:text-white",
                                ].join(" ")}
                            >
                                {Icon ? <Icon className="h-4 w-4" /> : null}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Subscribe (desktop) */}
                <div className="hidden sm:block">
                    <Link href="/#newsletter">
                        <Button
                            variant="outline"
                            className="text-lg border-purple-500 cursor-pointer text-purple-500 hover:bg-purple-950 bg-black hover:text-white"
                        >
                            Subscribe
                        </Button>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-3 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-purple-500 transition"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                    aria-expanded={open}
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile nav dropdown */}
            {open && (
                <div className="md:hidden px-4 pb-4 space-y-5 border-t border-gray-800 bg-black">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={[
                                "block px-3 py-6 rounded-md transition-colors",
                                isActive(item.href)
                                    ? "text-purple-500 font-semibold bg-gray-900"
                                    : "text-gray-400 hover:text-white hover:bg-gray-900",
                            ].join(" ")}
                        >
                            {item.label}
                        </Link>
                    ))}

                    <Link href="/#newsletter">
                        <Button className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700">
                            Subscribe
                        </Button>
                    </Link>
                </div>
            )}
        </header>
    );
}

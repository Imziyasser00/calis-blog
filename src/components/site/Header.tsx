"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@calis/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home" },
        { href: "/blog", label: "Blog" },
        { href: "/topics", label: "Topics" },
        { href: "/about", label: "About" },
    ];

    const isActive = (href: string) =>
        pathname === href ||
        (href !== "/" && pathname.startsWith(href));

    return (
        <header className="w-full bg-black border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-3xl font-bold tracking-tighter px-3 py-2 border border-gray-800 rounded-lg hover:border-purple-500 transition-colors"
                >
                    Cali<span className="text-purple-500">Hub</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center space-x-6 text-lg">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={[
                                "transition-colors px-2 py-1",
                                isActive(item.href)
                                    ? "text-purple-500 font-semibold border-b-2 border-purple-500"
                                    : "text-gray-400 hover:text-white",
                            ].join(" ")}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Subscribe (always visible on desktop) */}
                <div className="hidden md:block">
                    <Link href="#newsletter">
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
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
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
                            onClick={() => setOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link href="#newsletter" onClick={() => setOpen(false)}>
                        <Button className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700">
                            Subscribe
                        </Button>
                    </Link>
                </div>
            )}
        </header>
    );
}

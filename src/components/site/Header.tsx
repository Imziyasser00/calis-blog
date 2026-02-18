import Link from "next/link";
import MobileMenuClient from "./MobileMenuClient";

type NavItem = {
    href: string;
    label: string;
    icon: "sparkles" | "book" | "hash" | "wrench" | "folder" | "info" | "mail";
    subtle?: boolean;
};

const NAV_ITEMS: NavItem[] = [
    { href: "/beginner-calisthenics", label: "Start Here", icon: "sparkles" },
    { href: "/blog", label: "Blog", icon: "book" },
    { href: "/topics", label: "Topics", icon: "hash" },
    { href: "/tools", label: "Tools", icon: "wrench" },
    { href: "/library", label: "Library", icon: "folder" },
    { href: "/about", label: "About", icon: "info" },
    { href: "/contact", label: "Contact", icon: "mail", subtle: true },
];

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full p-2 border-b border-white/10 bg-black">
            <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-14 flex items-center justify-between">
                <Link
                    href="/"
                    className="group inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-lg font-bold tracking-tight text-white/90 hover:bg-white/10 transition"
                    aria-label="Go to Calisthenics Hub homepage"
                >
                    <span className="text-white">Calis</span>
                    <span className="ml-1 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
            Hub
          </span>
                </Link>

                {/* Desktop nav stays server, simple (no icons here to keep it tiny) */}
                <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1 text-sm">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={[
                                "inline-flex items-center rounded-lg px-2.5 py-1.5 transition border",
                                item.subtle ? "text-white/55 hover:text-white/80" : "text-white/70 hover:text-white",
                                "border-transparent hover:border-white/10 hover:bg-white/5",
                            ].join(" ")}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden sm:flex items-center gap-2">
                    <Link
                        href="/#newsletter"
                        className="h-9 px-3 inline-flex items-center justify-center rounded-lg border border-purple-500/60 text-purple-300 bg-black hover:bg-purple-950/50 hover:text-white transition text-sm font-medium"
                    >
                        Subscribe
                    </Link>
                </div>

                {/* ✅ Now safe: plain JSON only */}
                <MobileMenuClient items={NAV_ITEMS} />
            </div>
        </header>
    );
}

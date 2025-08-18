"use client";
import Link from "next/link";
import { Button } from "@calis/components/ui/button";

export default function Header() {
    return (
        <header className="container mx-auto py-6">
            <div className="flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tighter">
                    Cali<span className="text-purple-500">Hub</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-6 text-sm">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                    <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
                    <Link href="/topics" className="text-gray-400 hover:text-white transition-colors">Topics</Link>
                    <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
                </nav>
                <Link href="#newsletter">
                    <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-950 hover:text-white">
                        Subscribe
                    </Button>
                </Link>
            </div>
        </header>
    );
}

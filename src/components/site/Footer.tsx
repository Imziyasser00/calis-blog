import Link from "next/link";
import { Mail } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="border-t border-gray-800 py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="text-5xl font-bold tracking-tighter">
                            Calis<span className="text-purple-500">Hub</span>
                        </Link>
                        <p className="text-gray-400 text-lg">
                            Calisthenics workouts, skills, and progress — clean content, no fluff.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="https://www.tiktok.com/@calishub.com" className="text-gray-400 hover:text-white" aria-label="Twitter">
                                <FaTiktok />
                            </Link>
                                                    </div>
                    </div>

                </div>
                <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} Calisthenics Hub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

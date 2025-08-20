import Link from "next/link";
import { Mail } from "lucide-react";

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
                            <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.8-3.4 3.6-5.4 5.5-3 .9-.2 2-.7 2.5-1.1Z"/></svg></a>
                            <a href="#" className="text-gray-400 hover:text-white" aria-label="GitHub"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.8s-1.1-.3-3.6 1.4a12.3 12.3 0 0 0-6.6 0C4.7 1 3.6 1.3 3.6 1.3a5 5 0 0 0-.1 3.8A5.4 5.4 0 0 0 2 9c0 3.5 3 5.5 6 5.5-.4.5-.7 1.2-.8 2V22"/></svg></a>
                            <a href="#" className="text-gray-400 hover:text-white" aria-label="LinkedIn"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
                            <a href="#" className="text-gray-400 hover:text-white" aria-label="RSS"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium mb-4">Topics</h3>
                        <div className="space-y-2 text-sm text-gray-400">
                            {/* Keep links dynamic on the page itself */}
                            <p>See the Topics section above.</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/blog" className="hover:text-white">Tutorials</Link></li>
                            <li><Link href="/blog" className="hover:text-white">Programs</Link></li>
                            <li><Link href="/blog" className="hover:text-white">Gear</Link></li>
                            <li><Link href="/blog" className="hover:text-white">Nutrition</Link></li>
                            <li><Link href="/blog" className="hover:text-white">Tools</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>hello@calihub.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} Calisthenics Hub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

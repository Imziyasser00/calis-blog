import { Dumbbell } from "lucide-react"

export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white">
            <header className="container mx-auto py-6">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold tracking-tighter">
                        Neural<span className="text-purple-500">Pulse</span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                {/* Header Skeleton */}
                <div className="mb-12 text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Dumbbell className="h-10 w-10 text-purple-500 animate-pulse" />
                        <div className="h-12 w-96 bg-gray-800 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-6 w-[600px] bg-gray-800 rounded-lg animate-pulse mx-auto" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                            {/* Image Skeleton */}
                            <div className="h-48 bg-gray-800 animate-pulse" />

                            {/* Content Skeleton */}
                            <div className="p-4 space-y-3">
                                <div className="h-6 bg-gray-800 rounded animate-pulse" />
                                <div className="flex gap-1.5">
                                    <div className="h-5 w-16 bg-gray-800 rounded animate-pulse" />
                                    <div className="h-5 w-16 bg-gray-800 rounded animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-800 rounded animate-pulse" />
                                    <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

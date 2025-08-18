export function PostsGridSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-800" />
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-800 w-1/3" />
                        <div className="h-6 bg-gray-800 w-3/4" />
                        <div className="h-4 bg-gray-800 w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <div className="grid lg:grid-cols-2 gap-12 items-center animate-pulse">
            <div className="space-y-6">
                <div className="h-10 bg-gray-800 w-3/4 rounded" />
                <div className="h-6 bg-gray-800 w-2/3 rounded" />
                <div className="flex gap-4">
                    <div className="h-10 bg-gray-800 w-40 rounded" />
                    <div className="h-10 bg-gray-800 w-40 rounded" />
                </div>
            </div>
            <div className="h-[400px] rounded-xl bg-gray-800 border border-gray-800" />
        </div>
    );
}


import { Card } from "@calis/components/ui/card"
import { Skeleton } from "@calis/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
            <div className="container max-w-6xl mx-auto px-4 py-8">
                {/* Breadcrumbs skeleton */}
                <div className="flex items-center gap-2 mb-6">
                    <Skeleton className="h-4 w-12 bg-zinc-800" />
                    <Skeleton className="h-4 w-4 bg-zinc-800" />
                    <Skeleton className="h-4 w-20 bg-zinc-800" />
                    <Skeleton className="h-4 w-4 bg-zinc-800" />
                    <Skeleton className="h-4 w-32 bg-zinc-800" />
                </div>

                {/* Header skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-12 w-64 mb-4 bg-zinc-800" />
                    <div className="flex gap-2 mb-4">
                        <Skeleton className="h-6 w-24 bg-zinc-800" />
                        <Skeleton className="h-6 w-24 bg-zinc-800" />
                    </div>
                    <Skeleton className="h-6 w-full max-w-2xl bg-zinc-800" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main content skeleton */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                            <Skeleton className="aspect-video w-full bg-zinc-800" />
                        </Card>
                        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                            <Skeleton className="h-8 w-48 mb-6 bg-zinc-800" />
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full bg-zinc-800" />
                                <Skeleton className="h-4 w-full bg-zinc-800" />
                                <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar skeleton */}
                    <div className="lg:col-span-1">
                        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                            <Skeleton className="h-6 w-32 mb-6 bg-zinc-800" />
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full bg-zinc-800" />
                                <Skeleton className="h-12 w-full bg-zinc-800" />
                                <Skeleton className="h-12 w-full bg-zinc-800" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

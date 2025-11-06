import Link from "next/link"
import { Button } from "@calis/components/ui/button"
import { Card } from "@calis/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
            <Card className="bg-zinc-900/50 border-zinc-800 p-8 max-w-md text-center">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2">Exercise Not Found</h1>
                <p className="text-zinc-400 mb-6">
                    Sorry, we couldn't find the exercise you're looking for. It may have been removed or the URL might be
                    incorrect.
                </p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                    <Link href="/exercises">Browse All Exercises</Link>
                </Button>
            </Card>
        </div>
    )
}

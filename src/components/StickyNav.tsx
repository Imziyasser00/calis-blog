"use client";

export default function StickyNav() {
    return (
        <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-gray-400 px-2">Progress auto-saves</div>
            <button
                type="button"
                className="h-11 flex-1 rounded-xl bg-purple-500 text-white font-semibold shadow-[0_6px_24px_rgba(168,85,247,.35)]"

                onClick={() => document.getElementById("generator-continue")?.dispatchEvent(new Event("click", { bubbles: true }))}
            >
                Continue
            </button>
        </div>
    );
}

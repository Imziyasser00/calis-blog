export default function Chip({ children, tone }: { children: React.ReactNode; tone: "cyan" | "purple" | "pink" }) {
    const map = {
        cyan: "bg-[#22d3ee]/15 text-[#9beef7] border-[#22d3ee]/30",
        purple: "bg-[#a855f7]/15 text-[#e2c6fb] border-[#a855f7]/30",
        pink: "bg-[#f472b6]/15 text-[#ffd1e6] border-[#f472b6]/30",
    } as const;
    return <span className={`px-3 py-1.5 text-xs rounded-lg border ${map[tone]}`}>{children}</span>;
}

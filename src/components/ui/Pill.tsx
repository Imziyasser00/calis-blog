export default function Pill({ children, tone }: { children: React.ReactNode; tone: "purple" | "cyan" }) {
    const map = {
        purple: "border-[#a855f7]/40 text-[#e2c6fb] bg-[#a855f7]/10",
        cyan: "border-[#22d3ee]/40 text-[#b4f1fa] bg-[#22d3ee]/10",
    } as const;
    return <span className={`px-2.5 py-1 rounded-lg border text-[11px] ${map[tone]}`}>{children}</span>;
}

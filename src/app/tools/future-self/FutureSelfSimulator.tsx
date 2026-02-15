"use client";

import QRCode from "qrcode";
import { toPng } from "html-to-image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Download,
    Sparkles,
    TrendingUp,
    Zap,
    X,
    Mail,
    CheckCircle2,
} from "lucide-react";

/** ---------- helpers ---------- */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function formatNumber(n: number) {
    return Number.isFinite(n) ? String(Math.round(n)) : "0";
}

function isEmail(v: string) {
    return /^\S+@\S+\.\S+$/.test(v);
}

function formatInt(n: number) {
    return Number.isFinite(n) ? String(Math.round(n)) : "0";
}

/** Build your canonical tool URL for QR */
function getToolUrl(path = "/tools/future-self") {
    // Prefer configured env if you have it
    const base =
        (typeof window !== "undefined" && (window as any).__CALISHUB_SITE_URL__) ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://www.calishub.com";
    return `${base}${path}`;
}

/**
 * Placeholder projection model (replace later with your real model):
 * - More days/week = more growth
 * - Slight BW influence (heavier -> slightly slower for push-ups)
 * - Diminishing returns curve
 */
function projectPushups({
                            current,
                            daysPerWeek,
                            bodyweight,
                            months,
                        }: {
    current: number;
    daysPerWeek: number;
    bodyweight?: number;
    months: number;
}) {
    const d = clamp(daysPerWeek, 1, 7);

    const bwPenalty = bodyweight ? clamp((bodyweight - 75) * 0.0025, -0.08, 0.12) : 0.02;
    const baseRate = 0.26 + d * 0.06;
    const rate = clamp(baseRate - bwPenalty, 0.18, 0.7);

    const cap = current + 65;
    const t = months / 12;
    const projected = cap - (cap - current) * Math.exp(-rate * (t * 4.2));

    return clamp(projected, current, current + 120);
}

function buildMonthlyPoints({
                                current,
                                daysPerWeek,
                                bodyweight,
                                months,
                            }: {
    current: number;
    daysPerWeek: number;
    bodyweight?: number;
    months: number;
}) {
    const pts = Array.from({ length: months + 1 }, (_, m) => {
        const y = projectPushups({ current, daysPerWeek, bodyweight, months: m });
        return { m, y };
    });
    return pts;
}

function niceTicks(min: number, max: number, count: number) {
    const span = max - min || 1;
    const rawStep = span / (count - 1);
    const pow = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const step = Math.ceil(rawStep / pow) * pow;

    const start = Math.floor(min / step) * step;
    const end = Math.ceil(max / step) * step;

    const ticks: number[] = [];
    for (let v = start; v <= end + 1e-9; v += step) ticks.push(v);
    return ticks;
}

/** ---------- Click-first number input (click + type toggle) ---------- */
function ClickToAdjustNumber({
                                 label,
                                 hint,
                                 value,
                                 onChange,
                                 min,
                                 max,
                                 step = 1,
                                 unit,
                                 placeholder,
                                 defaultMode = "click",
                             }: {
    label: string;
    hint?: string;
    value: number | undefined;
    onChange: (v: number | undefined) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    placeholder?: string;
    defaultMode?: "click" | "type";
}) {
    const [mode, setMode] = useState<"click" | "type">(defaultMode);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const clampN = (n: number) => Math.max(min, Math.min(max, n));
    const display = value === undefined ? "" : String(value);

    const bump = (dir: -1 | 1) => {
        const cur = value ?? min;
        const next = clampN(Math.round((cur + dir * step) * 10) / 10);
        onChange(next);
    };

    const parse = (raw: string) => {
        const v = raw.replace(",", ".").trim();
        if (v === "") return undefined;
        const num = Number(v);
        if (!Number.isFinite(num)) return value;
        return clampN(num);
    };

    const toggleMode = () => {
        setMode((m) => {
            const next = m === "click" ? "type" : "click";
            if (next === "type") {
                setTimeout(() => {
                    inputRef.current?.focus();
                    inputRef.current?.select();
                }, 0);
            }
            return next;
        });
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-white">{label}</div>
                    {hint ? <div className="mt-1 text-xs text-white/55">{hint}</div> : null}
                </div>

                <button
                    type="button"
                    onClick={toggleMode}
                    className="shrink-0 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs text-white/70 transition"
                >
                    {mode === "click" ? "Type" : "Click"}
                </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => bump(-1)}
                    className="h-12 w-12 rounded-xl border border-white/10 bg-black/35 hover:bg-white/5 transition text-lg text-white/90"
                    aria-label={`Decrease ${label}`}
                >
                    −
                </button>

                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode="decimal"
                        value={display}
                        readOnly={mode === "click"}
                        onChange={(e) => onChange(parse(e.target.value))}
                        onFocus={() => {
                            if (mode === "click") setMode("type");
                        }}
                        placeholder={placeholder}
                        className={[
                            "w-full h-12 rounded-xl border bg-black/40 px-4 pr-14 text-white outline-none text-center",
                            "border-white/10 focus:border-white/20 focus:ring-2 focus:ring-purple-500/20",
                            mode === "click" ? "cursor-not-allowed opacity-90" : "",
                        ].join(" ")}
                    />
                    {unit ? (
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60">
              {unit}
            </span>
                    ) : null}

                    {mode === "click" ? (
                        <div className="mt-2 text-[11px] text-white/50 text-center">
                            Use +/−. Tap <span className="text-white/70 font-semibold">Type</span> to enter fast.
                        </div>
                    ) : null}
                </div>

                <button
                    type="button"
                    onClick={() => bump(1)}
                    className="h-12 w-12 rounded-xl border border-white/10 bg-black/35 hover:bg-white/5 transition text-lg text-white/90"
                    aria-label={`Increase ${label}`}
                >
                    +
                </button>
            </div>
        </div>
    );
}

/** ---------- UI bits ---------- */
function Pill({
                  active,
                  children,
                  onClick,
              }: {
    active?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "px-3 py-2 rounded-2xl border text-sm transition",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/25",
                active
                    ? "border-purple-500/50 bg-purple-500/15 text-white shadow-[0_14px_50px_rgba(168,85,247,.22)]"
                    : "border-white/10 bg-black/25 text-white/80 hover:bg-white/5 hover:border-white/15",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function StatChip({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-center gap-2 text-xs text-white/60">
                {icon}
                <span>{label}</span>
            </div>
            <div className="mt-1 text-2xl font-extrabold text-white">{value}</div>
        </div>
    );
}

/** ---------- Advanced SVG chart (ticks + labels + tooltip + milestones) ---------- */
function ProjectionChartAdvanced({
                                     id,
                                     points,
                                     months,
                                     animateKey,
                                 }: {
    id: string;
    points: Array<{ m: number; y: number }>;
    months: number;
    animateKey: string;
}) {
    const W = 780;
    const H = 300;
    const padL = 54;
    const padR = 26;
    const padT = 22;
    const padB = 44;

    const ys = points.map((p) => p.y);
    const minY0 = Math.min(...ys);
    const maxY0 = Math.max(...ys);

    const minY = Math.floor(minY0 - 3);
    const maxY = Math.ceil(maxY0 + 6);

    const yTicks = niceTicks(minY, maxY, 5);

    const x = (m: number) => {
        const t = months === 0 ? 0 : m / months;
        return padL + t * (W - padL - padR);
    };
    const y = (v: number) => {
        const t = (v - yTicks[0]) / ((yTicks[yTicks.length - 1] - yTicks[0]) || 1);
        return H - padB - t * (H - padT - padB);
    };

    const d = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.m).toFixed(2)} ${y(p.y).toFixed(2)}`)
        .join(" ");

    const [hoverM, setHoverM] = useState<number | null>(null);

    const nearest = useMemo(() => {
        if (hoverM === null) return null;
        const idx = Math.round(clamp(hoverM, 0, months));
        return points[idx] ?? null;
    }, [hoverM, months, points]);

    const milestones = useMemo(() => {
        const ms = [0, 1, 3, 6, 12].filter((m) => m <= months);
        return ms.map((m) => {
            const p = points[m];
            return { m, reps: p ? Math.round(p.y) : 0 };
        });
    }, [months, points]);

    const last = points[points.length - 1];
    const lastX = x(last.m);
    const lastY = y(last.y);

    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 overflow-hidden">
            <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-white/70" />
                    Projection chart
                </div>
                <div className="text-xs text-white/55">Hover/tap to inspect points</div>
            </div>

            <div className="mt-4 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(138,92,246,0.20),rgba(255,255,255,0))]" />

                <div id={id} className="relative">
                    <svg
                        viewBox={`0 0 ${W} ${H}`}
                        className="relative w-full h-[260px]"
                        onMouseLeave={() => setHoverM(null)}
                        onTouchEnd={() => setHoverM(null)}
                    >
                        <g>
                            {yTicks.map((tv, i) => {
                                const yy = y(tv);
                                return (
                                    <g key={i}>
                                        <line
                                            x1={padL}
                                            x2={W - padR}
                                            y1={yy}
                                            y2={yy}
                                            stroke="white"
                                            strokeWidth="1"
                                            opacity="0.10"
                                        />
                                        <text
                                            x={padL - 10}
                                            y={yy + 4}
                                            textAnchor="end"
                                            fontSize="12"
                                            fill="rgba(255,255,255,0.45)"
                                        >
                                            {Math.round(tv)}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>

                        <g>
                            {Array.from({ length: months + 1 }, (_, i) => i)
                                .filter((m) => (months <= 6 ? true : m % 2 === 0))
                                .map((m) => {
                                    const xx = x(m);
                                    return (
                                        <g key={m}>
                                            <line
                                                x1={xx}
                                                x2={xx}
                                                y1={H - padB}
                                                y2={H - padB + 6}
                                                stroke="white"
                                                strokeWidth="1"
                                                opacity="0.12"
                                            />
                                            <text
                                                x={xx}
                                                y={H - 18}
                                                textAnchor="middle"
                                                fontSize="12"
                                                fill="rgba(255,255,255,0.40)"
                                            >
                                                {m}m
                                            </text>
                                        </g>
                                    );
                                })}
                        </g>

                        <motion.path
                            key={animateKey}
                            d={d}
                            fill="none"
                            stroke="url(#grad)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0.35 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.05, ease: "easeInOut" }}
                        />

                        <g>
                            {milestones.map((m, i) => {
                                const p = points[m.m];
                                if (!p) return null;
                                const cx = x(p.m);
                                const cy = y(p.y);
                                return (
                                    <circle
                                        key={i}
                                        cx={cx}
                                        cy={cy}
                                        r="4.5"
                                        fill="rgba(255,255,255,0.95)"
                                        opacity="0.9"
                                    />
                                );
                            })}
                        </g>

                        <rect
                            x={padL}
                            y={padT}
                            width={W - padL - padR}
                            height={H - padT - padB}
                            fill="transparent"
                            onMouseMove={(e) => {
                                const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement) || null;
                                if (!svg) return;
                                const pt = svg.createSVGPoint();
                                pt.x = e.clientX;
                                pt.y = e.clientY;
                                const ctm = svg.getScreenCTM();
                                if (!ctm) return;
                                const loc = pt.matrixTransform(ctm.inverse());
                                const t = clamp((loc.x - padL) / (W - padL - padR), 0, 1);
                                setHoverM(t * months);
                            }}
                            onTouchMove={(e) => {
                                const touch = e.touches[0];
                                if (!touch) return;
                                const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement) || null;
                                if (!svg) return;
                                const pt = svg.createSVGPoint();
                                pt.x = touch.clientX;
                                pt.y = touch.clientY;
                                const ctm = svg.getScreenCTM();
                                if (!ctm) return;
                                const loc = pt.matrixTransform(ctm.inverse());
                                const t = clamp((loc.x - padL) / (W - padL - padR), 0, 1);
                                setHoverM(t * months);
                            }}
                        />

                        {nearest ? (
                            <g>
                                <line
                                    x1={x(nearest.m)}
                                    x2={x(nearest.m)}
                                    y1={padT}
                                    y2={H - padB}
                                    stroke="white"
                                    strokeWidth="1"
                                    opacity="0.12"
                                />
                                <circle cx={x(nearest.m)} cy={y(nearest.y)} r="6.5" fill="rgba(168,85,247,0.95)" />
                                <circle cx={x(nearest.m)} cy={y(nearest.y)} r="14" fill="rgba(168,85,247,0.18)" />

                                <g transform={`translate(${x(nearest.m) + 14},${y(nearest.y) - 36})`}>
                                    <rect
                                        width="150"
                                        height="44"
                                        rx="12"
                                        fill="rgba(0,0,0,0.65)"
                                        stroke="rgba(255,255,255,0.12)"
                                    />
                                    <text x="12" y="18" fontSize="12" fill="rgba(255,255,255,0.75)">
                                        Month {nearest.m}
                                    </text>
                                    <text x="12" y="34" fontSize="14" fill="rgba(255,255,255,0.95)">
                                        {Math.round(nearest.y)} reps
                                    </text>
                                </g>
                            </g>
                        ) : null}

                        <motion.circle
                            key={`dot-${animateKey}`}
                            cx={lastX}
                            cy={lastY}
                            r="7"
                            fill="rgba(255,255,255,0.95)"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: [0.8, 1.08, 0.95], opacity: 1 }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                        />
                        <motion.circle
                            key={`halo-${animateKey}`}
                            cx={lastX}
                            cy={lastY}
                            r="16"
                            fill="rgba(168,85,247,0.18)"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: [0.9, 1.2], opacity: [0.7, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                        />

                        <defs>
                            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#22d3ee" />
                                <stop offset="50%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#f472b6" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="mt-2 flex items-center justify-between text-xs text-white/45 px-1">
                        <span>Now</span>
                        <span>{months} months</span>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-white">Milestones</div>
                        <div className="text-xs text-white/55">Snapshot at key months</div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {milestones.map((m) => (
                            <div key={m.m} className="rounded-xl border border-white/10 bg-black/30 p-3">
                                <div className="text-xs text-white/55">{m.m === 0 ? "Now" : `Month ${m.m}`}</div>
                                <div className="mt-1 text-lg font-extrabold text-white">{m.reps}</div>
                                <div className="text-[11px] text-white/50">reps</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/** ---------- Email Gate Modal ---------- */
function EmailGateModal({
                            open,
                            onClose,
                            onSubmit,
                            loading,
                            error,
                            success,
                        }: {
    open: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
    loading: boolean;
    error: string | null;
    success: boolean;
}) {
    const [email, setEmail] = useState("");

    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="fixed inset-0 z-[80] flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={loading ? undefined : onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 14, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f15]/95 to-[#12121a]/95 shadow-[0_30px_120px_rgba(0,0,0,.65)]"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(138,92,246,0.18),rgba(255,255,255,0))]" />
                        <div className="relative p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                                        <Mail className="h-4 w-4" />
                                        Email required
                                    </div>
                                    <h3 className="mt-3 text-xl font-extrabold text-white">Download your results chart 📈</h3>
                                    <p className="mt-2 text-sm text-white/65">
                                        Enter your email to unlock the download (and we’ll send you useful training updates).
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={loading ? undefined : onClose}
                                    className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
                                    aria-label="Close"
                                >
                                    <X className="h-4 w-4 text-white/80" />
                                </button>
                            </div>

                            <div className="mt-5 space-y-3">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@email.com"
                                    className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-white/20 focus:ring-2 focus:ring-purple-500/20"
                                />

                                {error ? <div className="text-sm text-red-300">{error}</div> : null}

                                {success ? (
                                    <div className="flex items-center gap-2 text-sm text-emerald-200">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Subscribed. Downloading now...
                                    </div>
                                ) : null}

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => onSubmit(email)}
                                    className="h-12 w-full rounded-xl font-semibold text-white bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#f472b6] hover:opacity-95 transition disabled:opacity-60"
                                >
                                    {loading ? "Unlocking..." : "Unlock download"}
                                </button>

                                <div className="text-[11px] text-white/45">You can unsubscribe anytime. We don’t sell your data.</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

/** ---------- Download: SVG -> PNG ---------- */
async function downloadExportSvgAsPng(svgString: string, filename: string) {
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.crossOrigin = "anonymous";

    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 820;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    ctx.fillStyle = "#07070b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);

    const pngUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

/** ---------- Share Card Modal ---------- */
function ShareCardModal({
                            open,
                            onClose,
                            chasingReps,
                            currentReps,
                            rangeMonths,
                            daysPerWeek,
                            bodyweightKg,
                            toolPath = "/tools/future-self",
                        }: {
    open: boolean;
    onClose: () => void;
    chasingReps: number;
    currentReps: number;
    rangeMonths: 3 | 6 | 12;
    daysPerWeek: number;
    bodyweightKg?: number;
    toolPath?: string;
}) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toolUrl = useMemo(() => getToolUrl(toolPath), [toolPath]);

    const subtitle = useMemo(() => {
        const bw = bodyweightKg ? ` • ${bodyweightKg}kg` : "";
        return `${currentReps} reps now • ${daysPerWeek} days/week${bw} • ${rangeMonths} months`;
    }, [bodyweightKg, currentReps, daysPerWeek, rangeMonths]);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;

        (async () => {
            try {
                const dataUrl = await QRCode.toDataURL(toolUrl, {
                    margin: 1,
                    width: 360,
                    errorCorrectionLevel: "M",
                    color: { dark: "#ffffff", light: "#00000000" },
                });
                if (!cancelled) setQrDataUrl(dataUrl);
            } catch {
                if (!cancelled) setError("QR generation failed.");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [open, toolUrl]);

    async function downloadCard() {
        setError(null);
        if (!cardRef.current) return;

        setDownloading(true);
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `calishub-share-card-${chasingReps}reps-${rangeMonths}m.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch {
            setError("Download failed. Try again.");
        } finally {
            setDownloading(false);
        }
    }

    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="fixed inset-0 z-[90] flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={downloading ? undefined : onClose} />

                    <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 14, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-3xl"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-sm text-white/70">Share card</div>
                            <button
                                type="button"
                                onClick={downloading ? undefined : onClose}
                                className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
                            >
                                <X className="h-4 w-4 text-white/80" />
                            </button>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f15]/95 to-[#12121a]/95 p-4 sm:p-6">
                            <ShareCard
                                ref={cardRef}
                                chasingReps={chasingReps}
                                subtitle={subtitle}
                                qrDataUrl={qrDataUrl}
                                toolUrl={toolUrl}
                                rangeMonths={rangeMonths}
                            />

                            <div className="mt-5 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={downloadCard}
                                    disabled={downloading}
                                    className="h-12 flex-1 rounded-xl font-semibold text-white bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#f472b6] hover:opacity-95 transition disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    {downloading ? "Rendering..." : "Download share card"}
                                </button>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(toolUrl);
                                    }}
                                    className="h-12 px-5 rounded-xl border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition"
                                >
                                    Copy link
                                </button>
                            </div>

                            {error ? <div className="mt-3 text-sm text-red-300">{error}</div> : null}
                            <div className="mt-3 text-[11px] text-white/45">
                                Tip: Post this on Stories. The QR makes it effortless.
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

const ShareCard = React.forwardRef<
    HTMLDivElement,
    {
        chasingReps: number;
        subtitle: string;
        qrDataUrl: string;
        toolUrl: string;
        rangeMonths: 3 | 6 | 12;
    }
>(function ShareCardInner({ chasingReps, subtitle, qrDataUrl, toolUrl, rangeMonths }, ref) {
    return (
        <div
            ref={ref}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-black"
            style={{ width: "100%", maxWidth: 980, aspectRatio: "16 / 9" }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(138,92,246,0.32),rgba(255,255,255,0))]" />
            <div className="absolute -top-28 -right-28 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" />
            <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-cyan-400/12 blur-3xl" />

            <div className="absolute inset-0 opacity-[0.08] [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')]" />

            <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
                            <Sparkles className="h-4 w-4" />
                            CalisHub Future Self
                        </div>

                        <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                            I’m chasing{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#f472b6]">
                {formatInt(chasingReps)}
              </span>{" "}
                            reps
                        </div>

                        <div className="text-sm sm:text-base text-white/65">
                            {subtitle}
                            <span className="text-white/40"> • </span>
                            <span className="text-white/75 font-semibold">{rangeMonths}-month projection</span>
                        </div>
                    </div>

                    <div className="shrink-0 rounded-3xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs text-white/60 mb-2">Scan to try the tool</div>
                        <div className="h-[120px] w-[120px] rounded-2xl border border-white/10 bg-black/35 flex items-center justify-center overflow-hidden">
                            {qrDataUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={qrDataUrl} alt="QR" className="h-full w-full object-contain" />
                            ) : (
                                <div className="text-xs text-white/40">Generating…</div>
                            )}
                        </div>
                        <div className="mt-2 text-[11px] text-white/45 max-w-[160px] truncate">
                            {toolUrl.replace("https://", "").replace("http://", "")}
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-between gap-6">
                    <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
                        <div className="text-xs text-white/55">Challenge</div>
                        <div className="text-sm text-white/85">Beat your future self. Train. Retest. Repeat.</div>
                    </div>

                    <div className="text-sm font-semibold text-white/70">calishub.com</div>
                </div>
            </div>
        </div>
    );
});

/** ---------- main component ---------- */
export default function FutureSelfSimulator() {
    const [maxPushups, setMaxPushups] = useState<number>(30);
    const [days, setDays] = useState<number>(3);
    const [bw, setBw] = useState<number | undefined>(undefined);

    const [range, setRange] = useState<3 | 6 | 12>(6);

    // email gate states
    const [gateOpen, setGateOpen] = useState(false);
    const [gateLoading, setGateLoading] = useState(false);
    const [gateError, setGateError] = useState<string | null>(null);
    const [gateSuccess, setGateSuccess] = useState(false);

    // share card modal
    const [shareOpen, setShareOpen] = useState(false);

    const chartId = useMemo(() => `future-self-chart`, []);
    const filename = useMemo(() => {
        const bwText = bw ? `${bw}kg-` : "";
        return `calishub-future-self-${maxPushups}reps-${days}d-${bwText}${range}m.png`.replace(/\s+/g, "");
    }, [bw, days, maxPushups, range]);

    const target = useMemo(() => {
        return projectPushups({ current: maxPushups, daysPerWeek: days, bodyweight: bw, months: range });
    }, [maxPushups, days, bw, range]);

    const points = useMemo(() => {
        return buildMonthlyPoints({ current: maxPushups, daysPerWeek: days, bodyweight: bw, months: range });
    }, [maxPushups, days, bw, range]);

    const milestones = useMemo(() => {
        const ms = [0, 1, 3, 6, 12].filter((m) => m <= range);
        return ms.map((m) => ({ m, reps: Math.round(points[m]?.y ?? 0) }));
    }, [points, range]);

    const headline = useMemo(() => {
        const t = Math.round(target);
        return `In ${range} months, you could hit ${t} reps.`;
    }, [target, range]);

    const animateKey = `${range}-${maxPushups}-${days}-${bw ?? "na"}`;

    function buildExportSvg({
                                title,
                                subtitle,
                                months,
                                points,
                                milestones,
                            }: {
        title: string;
        subtitle: string;
        months: number;
        points: Array<{ m: number; y: number }>;
        milestones: Array<{ m: number; reps: number }>;
    }) {
        const W = 1400;
        const H = 820;

        const chartX = 90;
        const chartY = 140;
        const chartW = W - 180;
        const chartH = 380;

        const padL = 70;
        const padR = 30;
        const padT = 20;
        const padB = 60;

        const ys = points.map((p) => p.y);
        const minY0 = Math.min(...ys);
        const maxY0 = Math.max(...ys);
        const minY = Math.floor(minY0 - 3);
        const maxY = Math.ceil(maxY0 + 6);

        const ticks = (() => {
            const span = maxY - minY || 1;
            const raw = span / 4;
            const pow = Math.pow(10, Math.floor(Math.log10(raw)));
            const step = Math.ceil(raw / pow) * pow;
            const start = Math.floor(minY / step) * step;
            const end = Math.ceil(maxY / step) * step;
            const out: number[] = [];
            for (let v = start; v <= end + 1e-9; v += step) out.push(v);
            return out;
        })();

        const x = (m: number) => {
            const t = months === 0 ? 0 : m / months;
            return chartX + padL + t * (chartW - padL - padR);
        };
        const y = (v: number) => {
            const t = (v - ticks[0]) / ((ticks[ticks.length - 1] - ticks[0]) || 1);
            return chartY + (chartH - padB) - t * (chartH - padT - padB);
        };

        const pathD = points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.m).toFixed(2)} ${y(p.y).toFixed(2)}`)
            .join(" ");

        const cardsY = chartY + chartH + 70;
        const cardsH = 120;
        const gap = 16;
        const cardsCount = milestones.length;
        const cardW = Math.floor((chartW - gap * (cardsCount - 1)) / cardsCount);

        const escape = (s: string) =>
            s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

        return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="120%" r="80%">
      <stop offset="0%" stop-color="rgba(168,85,247,0.28)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#07070b"/>
  <rect width="${W}" height="${H}" fill="url(#glow)" opacity="1"/>

  <text x="90" y="70" font-size="44" font-weight="800" fill="rgba(255,255,255,0.96)" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto">
    ${escape(title)}
  </text>
  <text x="90" y="112" font-size="20" fill="rgba(255,255,255,0.68)" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto">
    ${escape(subtitle)}
  </text>

  <rect x="${chartX}" y="${chartY}" width="${chartW}" height="${chartH}" rx="28" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)"/>

  ${
            ticks
                .map((tv) => {
                    const yy = y(tv);
                    return `
          <line x1="${chartX + padL}" x2="${chartX + chartW - padR}" y1="${yy}" y2="${yy}" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
          <text x="${chartX + padL - 14}" y="${yy + 5}" text-anchor="end" font-size="16" fill="rgba(255,255,255,0.45)" font-family="ui-sans-serif, system-ui">${Math.round(tv)}</text>
        `;
                })
                .join("")
        }

  ${
            Array.from({ length: months + 1 }, (_, i) => i)
                .filter((m) => (months <= 6 ? true : m % 2 === 0))
                .map((m) => {
                    const xx = x(m);
                    const baseY = chartY + chartH - padB;
                    return `
          <line x1="${xx}" x2="${xx}" y1="${baseY}" y2="${baseY + 10}" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>
          <text x="${xx}" y="${chartY + chartH - 18}" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.42)" font-family="ui-sans-serif, system-ui">${m}m</text>
        `;
                })
                .join("")
        }

  <path d="${pathD}" fill="none" stroke="url(#g)" stroke-width="7" stroke-linecap="round"/>

  ${
            milestones
                .map((m) => {
                    const p = points[m.m];
                    if (!p) return "";
                    return `<circle cx="${x(p.m)}" cy="${y(p.y)}" r="7" fill="rgba(255,255,255,0.95)" />`;
                })
                .join("")
        }

  ${
            milestones
                .map((m, i) => {
                    const cx = chartX + i * (cardW + gap);
                    const label = m.m === 0 ? "Now" : `Month ${m.m}`;
                    return `
          <rect x="${cx}" y="${cardsY}" width="${cardW}" height="${cardsH}" rx="22" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.10)"/>
          <text x="${cx + 18}" y="${cardsY + 44}" font-size="18" fill="rgba(255,255,255,0.60)" font-family="ui-sans-serif, system-ui">${label}</text>
          <text x="${cx + 18}" y="${cardsY + 84}" font-size="42" font-weight="800" fill="rgba(255,255,255,0.96)" font-family="ui-sans-serif, system-ui">${m.reps}</text>
          <text x="${cx + 18}" y="${cardsY + 108}" font-size="16" fill="rgba(255,255,255,0.50)" font-family="ui-sans-serif, system-ui">reps</text>
        `;
                })
                .join("")
        }

  <text x="${W - 90}" y="${H - 34}" text-anchor="end" font-size="18" fill="rgba(255,255,255,0.45)" font-family="ui-sans-serif, system-ui">
    calishub.com
  </text>
</svg>
`.trim();
    }

    async function handleSubscribeAndDownload(email: string) {
        setGateError(null);

        if (!email || !isEmail(email)) {
            setGateError("Please enter a valid email.");
            return;
        }

        setGateLoading(true);
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok || !json?.ok) {
                setGateError(json?.error || "Subscription failed. Try again.");
                setGateLoading(false);
                return;
            }

            const title = "Future Self Simulator";
            const subtitle = `Now: ${maxPushups} push-ups  |  Training: ${days} days/week${
                bw ? `  |  BW: ${bw}kg` : ""
            }  |  Range: ${range} months`;

            const exportSvg = buildExportSvg({
                title,
                subtitle,
                months: range,
                points,
                milestones,
            });

            setGateSuccess(true);

            setTimeout(async () => {
                try {
                    await downloadExportSvgAsPng(exportSvg, filename);
                } finally {
                    setGateLoading(false);
                    setTimeout(() => {
                        setGateOpen(false);
                        setGateSuccess(false);
                    }, 450);
                }
            }, 350);
        } catch {
            setGateError("Network error. Please try again.");
            setGateLoading(false);
        }
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <EmailGateModal
                open={gateOpen}
                onClose={() => {
                    if (gateLoading) return;
                    setGateOpen(false);
                    setGateError(null);
                    setGateSuccess(false);
                }}
                onSubmit={handleSubscribeAndDownload}
                loading={gateLoading}
                error={gateError}
                success={gateSuccess}
            />

            <ShareCardModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                chasingReps={Math.round(target)}
                currentReps={maxPushups}
                rangeMonths={range}
                daysPerWeek={days}
                bodyweightKg={bw}
                toolPath="/tools/future-self"
            />

            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f15]/90 to-[#12121a]/90 backdrop-blur-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(138,92,246,0.16),rgba(255,255,255,0))]" />
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative p-5 sm:p-10 space-y-6 sm:space-y-8">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
                            <Sparkles className="h-4 w-4" />
                            “Can You Beat Your Future Self?” Simulator
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Predict your push-up future 🧬</h2>
                        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                            Plug in your current max and consistency. Inspect the curve month-by-month, then download your chart.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-4">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-white/70" />
                                        Inputs
                                    </div>
                                    <div className="text-xs text-white/55">Strict form assumptions</div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <ClickToAdjustNumber
                                        label="Current max push-ups"
                                        hint="Full ROM, chest close to floor, lockout at top."
                                        value={maxPushups}
                                        onChange={(v) => setMaxPushups(clamp(Math.round(v ?? 0), 0, 250))}
                                        min={0}
                                        max={250}
                                        step={1}
                                        unit="reps"
                                        placeholder="e.g. 32"
                                        defaultMode="click"
                                    />

                                    <ClickToAdjustNumber
                                        label="Training days per week"
                                        hint="How often you can train push-ups seriously."
                                        value={days}
                                        onChange={(v) => setDays(clamp(Math.round(v ?? 1), 1, 7))}
                                        min={1}
                                        max={7}
                                        step={1}
                                        unit="days"
                                        placeholder="e.g. 3"
                                        defaultMode="click"
                                    />

                                    <ClickToAdjustNumber
                                        label="Bodyweight (optional)"
                                        hint="Default: click +/−. Tap Type if you want to enter fast."
                                        value={bw}
                                        onChange={(v) => setBw(v === undefined ? undefined : clamp(v, 1, 250))}
                                        min={1}
                                        max={250}
                                        step={0.5}
                                        unit="kg"
                                        placeholder="e.g. 78"
                                        defaultMode="click"
                                    />
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                                    <div className="text-xs text-white/55">Projection range</div>
                                    <div className="flex gap-2">
                                        <Pill active={range === 3} onClick={() => setRange(3)}>
                                            3 months
                                        </Pill>
                                        <Pill active={range === 6} onClick={() => setRange(6)}>
                                            6 months
                                        </Pill>
                                        <Pill active={range === 12} onClick={() => setRange(12)}>
                                            12 months
                                        </Pill>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-white">Download results</div>
                                    <div className="text-xs text-white/55">Unlock via email</div>
                                </div>

                                <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                                    <div className="text-sm font-extrabold text-white">{headline}</div>
                                    <div className="mt-1 text-sm text-white/65">
                                        You’ll download a clean PNG of the chart with axis numbers + milestone points.
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setGateError(null);
                                        setGateSuccess(false);
                                        setGateOpen(true);
                                    }}
                                    className="mt-4 h-12 w-full rounded-xl font-semibold text-white bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#f472b6] hover:opacity-95 transition shadow-[0_16px_60px_rgba(168,85,247,.25)] flex items-center justify-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Download results chart
                                </button>

                                <div className="mt-3 text-[11px] text-white/45">
                                    Tip: this looks amazing in Stories. Screenshot works too, but download is cleaner.
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-white">Your Future Self</div>
                                    <div className="text-xs text-white/55">Projection only</div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <StatChip label="Now" value={`${formatNumber(maxPushups)}`} icon={<Zap className="h-3.5 w-3.5" />} />
                                    <StatChip
                                        label={`In ${range} months`}
                                        value={`${formatNumber(target)}`}
                                        icon={<TrendingUp className="h-3.5 w-3.5" />}
                                    />
                                    <StatChip
                                        label="Delta"
                                        value={`+${formatNumber(target - maxPushups)}`}
                                        icon={<Sparkles className="h-3.5 w-3.5" />}
                                    />
                                </div>
                            </div>

                            <ProjectionChartAdvanced id={chartId} points={points} months={range} animateKey={animateKey} />

                            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-black/35 to-white/5 p-4 sm:p-5">
                                <div className="text-sm font-semibold text-white">Share it with your friends</div>
                                <div className="mt-1 text-sm text-white/65">
                                    Generate a share-card with “I’m chasing {Math.round(target)} reps” + a QR to this tool.
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShareOpen(true)}
                                    className="mt-4 h-12 w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-semibold"
                                >
                                    Generate share card (QR)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

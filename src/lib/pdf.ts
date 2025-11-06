import { jsPDF } from "jspdf";
import type { Plan } from "./types";

/** Brand palette */
const COL = {
    bg: "#0b0b0f",
    panel: "#12121a",
    border: "#2a2a39",
    text: "#f3f4f6",
    sub: "#a1a1aa",
    purple: "#a855f7",
    cyan: "#22d3ee",
    faint: "#1a1a24",
};

type PdfOpts = {
    /** If you have /public/logo.png, just pass logoPath: "/logo.png" */
    logoPath?: string;
    /** Or pass a precomputed dataURL directly */
    logoDataUrl?: string;
    /** footer left text */
    siteLine?: string;
};

/** "#rrggbb" -> [r,g,b] */
function toRGB(hex: string): [number, number, number] {
    const c = hex.replace("#", "");
    return [
        parseInt(c.slice(0, 2), 16),
        parseInt(c.slice(2, 4), 16),
        parseInt(c.slice(4, 6), 16),
    ];
}

/** Fetch an image (e.g. /logo.png) and return a dataURL */
async function loadAsDataURL(path: string): Promise<string | null> {
    try {
        const res = await fetch(path);
        const blob = await res.blob();
        const reader = new FileReader();
        return await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

/**
 * Generate a CalisHub-styled PDF.
 */
export async function downloadPlanPdf(plan: Plan, opts: PdfOpts = {}) {
    const doc = new jsPDF({
        unit: "pt",
        format: "a4",
        compress: true,
    });

    // If no dataURL was provided, try to load from logoPath
    const logoDataUrl =
        opts.logoDataUrl || (opts.logoPath ? await loadAsDataURL(opts.logoPath) : undefined);

    // Layout constants
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const P = 36; // page padding
    let y = P;

    // ---------------- Helpers ----------------
    const paintPageBg = () => {
        doc.setFillColor(...toRGB(COL.bg));
        doc.rect(0, 0, W, H, "F");
    };

    const header = () => {
        // Logo
        if (logoDataUrl) {
            try {
                // 28x28 square logo; adjust if your logo is wide
                doc.addImage(logoDataUrl, "PNG", P, P - 4, 28, 28);
            } catch {
                /* ignore */
            }
        }

        // Brand title
        doc.setTextColor(...toRGB(COL.purple));
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("CalisHub • Workout Plan", P + (logoDataUrl ? 36 : 0), P + 14);

        // Thin divider
        doc.setDrawColor(...toRGB(COL.border));
        doc.setLineWidth(1);
        doc.line(P, P + 24, W - P, P + 24);

        y = P + 48;
    };

    const footer = (pageNum: number) => {
        const footerY = H - 18;
        doc.setFontSize(9);
        doc.setTextColor(...toRGB(COL.sub));
        if (opts.siteLine) {
            doc.text(opts.siteLine, P, footerY);
        }
        const pageText = `Page ${pageNum}`;
        const metrics = doc.getTextWidth(pageText);
        doc.text(pageText, W - P - metrics, footerY);
    };

    // Prevent blank first page:
    let _initialized = false;
    const newPage = () => {
        if (_initialized) {
            footer(doc.getNumberOfPages());
            doc.addPage();
        } else {
            _initialized = true; // use initial jsPDF page
        }
        paintPageBg();
        header();
    };

    const ensure = (need: number) => {
        // Add a new page if the remaining height is insufficient
        if (y + need > H - 48) {
            newPage();
        }
    };

    const dayCard = (day: {
        title: string;
        duration: string;
        exercises: Array<{ name: string; sets: number; reps: string }>;
    }) => {
        // Estimate height
        const lineH = 20;
        const headH = 28;
        const innerPad = 14;
        const est = headH + innerPad + day.exercises.length * lineH + innerPad + 6;

        ensure(est + 20);

        // Panel
        const panelX = P;
        const panelW = W - P * 2;
        const panelY = y;

        doc.setFillColor(...toRGB(COL.panel));
        doc.setDrawColor(...toRGB(COL.border));
        doc.setLineWidth(1);
        doc.roundedRect(panelX, panelY, panelW, est, 10, 10, "FD");

        // Title line
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(...toRGB(COL.cyan));
        doc.text(day.title, panelX + innerPad, panelY + innerPad + 12);

        // -------- Duration pill (right) — vector icon + text (no emoji) --------
        // Normalize: replace hyphen with en-dash; append " min" if missing.
        const normalized = day.duration.replace("-", "–");
        const hasMin = /\bmin\b/i.test(normalized);
        const label = hasMin ? normalized : `${normalized} min`;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const textW = doc.getTextWidth(label);

        const iconW = 10,
            iconPad = 6,
            textPad = 8;
        const pillW = iconPad + iconW + textPad + textW + 6;
        const pillH = 18;
        const pillX = panelX + panelW - innerPad - pillW;
        const pillY = panelY + innerPad;

        // pill bg
        doc.setDrawColor(...toRGB(COL.border));
        doc.setFillColor(...toRGB(COL.faint));
        doc.roundedRect(pillX, pillY, pillW, pillH, 8, 8, "FD");

        // clock icon (10x10)
        const cx = pillX + iconPad + iconW / 2;
        const cy = pillY + pillH / 2;
        const r = 4.2;
        doc.setDrawColor(...toRGB(COL.cyan));
        doc.circle(cx, cy, r, "S");
        doc.setLineWidth(1);
        doc.line(cx, cy, cx, cy - r + 1); // minute hand
        doc.line(cx, cy, cx + r - 1.5, cy); // hour hand

        // text
        doc.setTextColor(...toRGB(COL.text));
        doc.text(label, pillX + iconPad + iconW + textPad, pillY + 12);
        // -----------------------------------------------------------------------

        let yy = panelY + headH + innerPad;

        // Table header
        doc.setTextColor(...toRGB(COL.sub));
        doc.setFontSize(10);
        doc.text("#", panelX + innerPad, yy);
        doc.text("Exercise", panelX + innerPad + 18, yy);
        const colSetsX = panelX + panelW - innerPad - 90;
        const colRepsX = panelX + panelW - innerPad - 28;
        doc.text("Sets", colSetsX, yy);
        doc.text("Reps", colRepsX, yy);

        yy += 8;
        doc.setDrawColor(...toRGB(COL.border));
        doc.line(panelX + innerPad, yy, panelX + panelW - innerPad, yy);
        yy += 10;

        // Rows
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...toRGB(COL.text));
        doc.setFontSize(11);

        day.exercises.forEach((ex, i) => {
            // row bg (zebra faint)
            if (i % 2 === 1) {
                doc.setFillColor(...toRGB("#14141c"));
                doc.rect(panelX + innerPad - 6, yy - 10, panelW - innerPad * 2 + 12, 18, "F");
            }

            doc.text(String(i + 1), panelX + innerPad, yy);
            // Exercise name (truncate if needed)
            textTruncate(doc, ex.name, panelX + innerPad + 18, yy, colSetsX - (panelX + innerPad + 24));

            // Sets (purple), Reps (cyan)
            doc.setTextColor(...toRGB(COL.purple));
            doc.text(String(ex.sets), colSetsX, yy);
            doc.setTextColor(...toRGB(COL.cyan));
            doc.text(ex.reps, colRepsX, yy);

            yy += 18;
        });

        y = panelY + est + 20;
    };

    // Start ---------------------------------------------------------
    newPage();

    // Title Block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...toRGB(COL.text));
    doc.text(plan.title, P, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(...toRGB(COL.sub));
    doc.text(`Level: ${plan.level}   •   Goal: ${plan.goal}`, P, y);
    y += 18;

    // Accent divider
    doc.setDrawColor(...toRGB(COL.purple));
    doc.setLineWidth(2);
    doc.line(P, y, W - P, y);
    y += 12;

    // Days
    plan.workouts.forEach((d) => {
        dayCard({
            title: `Day ${d.day} — ${d.type}`,
            duration: d.duration,
            exercises: d.exercises,
        });
    });

    // Final footer on the last page
    footer(doc.getNumberOfPages());

    doc.save("calishub-workout-plan.pdf");
}

/** Draw a string that fits in maxWidth, add "…" if needed */
function textTruncate(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number
) {
    const ellipsis = "…";
    const full = doc.getTextWidth(text);
    if (full <= maxWidth) {
        doc.text(text, x, y);
        return;
    }
    let out = text;
    while (doc.getTextWidth(out + ellipsis) > maxWidth && out.length > 0) {
        out = out.slice(0, -1);
    }
    doc.text(out + ellipsis, x, y);
}

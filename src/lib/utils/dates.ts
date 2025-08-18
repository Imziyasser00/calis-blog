// FILE: lib/utils/dates.ts
export function formatDate(d?: string) {
    if (!d) return "";
    try {
        return new Date(d).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return d;
    }
}

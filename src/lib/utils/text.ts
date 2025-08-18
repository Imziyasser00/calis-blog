export function excerptWords(input?: string | null, words = 40): string {
    if (!input) return "";
    const tokens = input.trim().replace(/\s+/g, " ").split(" ");
    return tokens.slice(0, words).join(" ");
}
export function isTruncatedByWords(input?: string | null, words = 40): boolean {
    if (!input) return false;
    return input.trim().split(/\s+/).length > words;
}

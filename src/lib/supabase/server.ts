import { createClient } from "@supabase/supabase-js";

export function supabaseServer() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!url || !serviceRole) {
        throw new Error("Missing Supabase env vars for server client.");
    }

    return createClient(url, serviceRole, {
        auth: { persistSession: false },
    });
}

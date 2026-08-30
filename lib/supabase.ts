import { createClient, SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) {
    throw new Error("Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }
  adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}

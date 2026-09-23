import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";

/** Use only after verifying the caller with the cookie-bound server client. */
export function createAdminClient() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");

  return createClient(supabaseConfig().url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

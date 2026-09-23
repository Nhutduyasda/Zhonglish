import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  if (!isSupabaseConfigured()) return NextResponse.redirect(new URL("/sign-in?error=configuration", origin));
  const supabase = await createClient();
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && (type === "email" || type === "recovery")
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("Missing token") };
  if (error) return NextResponse.redirect(new URL("/sign-in?error=link", origin));
  return NextResponse.redirect(new URL(type === "recovery" ? "/reset-password" : "/onboarding?resume=1", origin));
}

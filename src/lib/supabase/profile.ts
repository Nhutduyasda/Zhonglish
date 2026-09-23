import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./config";
import { createClient } from "./server";

export async function authStatus() {
  if (!isSupabaseConfigured()) return { user: null, completed: false };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, completed: false };
  const { data } = await supabase.from("profiles").select("onboarding_completed").eq("id", user.id).maybeSingle();
  return { user, completed: data?.onboarding_completed === true };
}

export async function redirectAuthenticated() {
  const status = await authStatus();
  if (status.user) redirect(status.completed ? "/app" : "/onboarding?resume=1");
}

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./config";
import { createClient } from "./server";

export type UserProfile = {
  id: string;
  learning_language: "english" | "chinese";
  learning_goal: "communication" | "work" | "travel" | "study" | "other";
  daily_goal_minutes: 5 | 10 | 15;
  experience_level: "absolute_beginner" | "some_knowledge";
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
};

export async function authStatus() {
  if (!isSupabaseConfigured()) return { user: null, completed: false };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, completed: false };
  const { data } = await supabase.from("profiles").select("onboarding_completed").eq("id", user.id).maybeSingle();
  return { user, completed: data?.onboarding_completed === true };
}

export async function getUserProfile() {
  if (!isSupabaseConfigured()) return { user: null, profile: null };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };
  const { data } = await supabase
    .from("profiles")
    .select("id, learning_language, learning_goal, daily_goal_minutes, experience_level, onboarding_completed, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();
  return { user, profile: (data as UserProfile | null) ?? null };
}

export async function redirectAuthenticated() {
  const status = await authStatus();
  if (status.user) redirect(status.completed ? "/app" : "/onboarding?resume=1");
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { validateDraft } from "@/features/onboarding/draft";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 }); }
  const draft = validateDraft(body);
  if (!draft) return NextResponse.json({ error: "Lựa chọn học tập không hợp lệ." }, { status: 400 });
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 });
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    learning_language: draft.language,
    learning_goal: draft.goal,
    daily_goal_minutes: draft.dailyGoal,
    experience_level: draft.experience,
    onboarding_completed: true,
  }, { onConflict: "id" });
  if (error) return NextResponse.json({ error: "Chưa lưu được lựa chọn. Hãy thử lại." }, { status: 503 });
  return NextResponse.json({ ok: true });
}

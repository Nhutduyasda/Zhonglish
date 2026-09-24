import { NextResponse } from "next/server";
import { getLessonById } from "@/data/lessons";
import { evaluateExercise } from "@/features/lesson/evaluation";
import type { ReviewStateRow } from "@/features/review/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  }
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Dữ liệu yêu cầu không hợp lệ." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Dữ liệu yêu cầu không hợp lệ." }, { status: 400 });
  }
  const { reviewId, requestId, answer } = body as Record<string, unknown>;
  if (typeof reviewId !== "string" || typeof requestId !== "string" || !UUID_V4.test(reviewId) || !UUID_V4.test(requestId)) {
    return NextResponse.json({ error: "Mã yêu cầu không hợp lệ." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 });

  const { data, error } = await supabase.from("review_state")
    .select("id, language, source_lesson_id, source_exercise_id, vocabulary_id, strength, repetitions, mistake_count, next_review_at, created_at")
    .eq("id", reviewId).eq("user_id", user.id).eq("is_active", true).maybeSingle();
  if (error || !data) {
    return NextResponse.json({ error: "Không tìm thấy nội dung ôn tập." }, { status: 404 });
  }

  const row = data as ReviewStateRow;
  const lesson = getLessonById(row.source_lesson_id);
  const exercise = lesson?.exercises.find((candidate) => candidate.id === row.source_exercise_id);
  if (!lesson || !exercise || lesson.language !== row.language) {
    try {
      await createAdminClient().from("review_state")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", row.id).eq("user_id", user.id);
    } catch (staleError) {
      console.error("Failed to deactivate stale review item:", staleError);
    }
    return NextResponse.json({ error: "Nội dung này không còn khả dụng. Hãy tải lại phiên ôn tập." }, { status: 410 });
  }

  const evaluation = evaluateExercise(exercise, answer);
  let admin;
  try { admin = createAdminClient(); } catch {
    return NextResponse.json({ error: "Máy chủ chưa được cấu hình để lưu ôn tập." }, { status: 503 });
  }
  const { data: mutation, error: mutationError } = await admin.rpc("record_trusted_review_answer", {
    p_user_id: user.id,
    p_review_id: reviewId,
    p_request_id: requestId,
    p_was_correct: evaluation.isCorrect,
  });
  if (mutationError) {
    const status = mutationError.code === "P0002" ? 404 : 500;
    return NextResponse.json({ error: status === 404 ? "Không tìm thấy nội dung ôn tập." : "Chưa thể lưu kết quả ôn tập." }, { status });
  }
  const result = mutation as {
    previous_strength: number;
    new_strength: number;
    next_review_at: string;
  };
  return NextResponse.json({
    ok: true,
    isCorrect: evaluation.isCorrect,
    correctAnswerDisplay: evaluation.correctAnswerDisplay,
    explanation: evaluation.explanation,
    previousStrength: result.previous_strength,
    newStrength: result.new_strength,
    nextReviewAt: result.next_review_at,
  });
}

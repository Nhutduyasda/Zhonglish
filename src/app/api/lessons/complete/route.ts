import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUserProfile } from "@/lib/supabase/profile";
import { getLessonById } from "@/data/lessons";
import { evaluateExercise } from "@/features/lesson/evaluation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isLessonUnlocked } from "@/lib/supabase/lesson-access";
import { getLearningSummary } from "@/lib/supabase/learning-progress";
import type { ExerciseSubmission } from "@/features/lesson/types";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu yêu cầu không hợp lệ." },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("lessonId" in body) ||
    typeof (body as { lessonId: unknown }).lessonId !== "string"
  ) {
    return NextResponse.json(
      { error: "Thiếu lessonId." },
      { status: 400 }
    );
  }

  const { lessonId, submissions, requestId } = body as {
    lessonId: string;
    submissions?: unknown[];
    requestId?: unknown;
  };

  if (typeof requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
    return NextResponse.json({ error: "Mã lưu bài học không hợp lệ." }, { status: 400 });
  }

  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return NextResponse.json(
      { error: "Bài học không tồn tại." },
      { status: 404 }
    );
  }

  const { user, profile } = await getUserProfile();
  if (!user || !profile || !profile.onboarding_completed) {
    return NextResponse.json(
      { error: "Vui lòng đăng nhập." },
      { status: 401 }
    );
  }

  // Language check: user must be learning the lesson's language
  if (lesson.language !== profile.learning_language) {
    return NextResponse.json(
      { error: "Bài học không thuộc ngôn ngữ học tập hiện tại." },
      { status: 403 }
    );
  }

  try {
    if (!(await isLessonUnlocked(user.id, lesson))) {
      return NextResponse.json({ error: "Giai đoạn này chưa mở khóa." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Chưa thể kiểm tra lộ trình. Vui lòng thử lại." }, { status: 503 });
  }

  // Validate submissions array
  if (!Array.isArray(submissions)) {
    return NextResponse.json(
      { error: "Dữ liệu bài làm không hợp lệ." },
      { status: 400 }
    );
  }

  if (submissions.length !== lesson.exercises.length || submissions.length > 100) {
    return NextResponse.json({ error: "Bài làm chưa đầy đủ." }, { status: 400 });
  }

  // Map submissions by exerciseId for safe lookup
  const submissionMap = new Map<string, unknown>();
  for (const item of submissions) {
    if (
      item &&
      typeof item === "object" &&
      "exerciseId" in item &&
      typeof (item as ExerciseSubmission).exerciseId === "string"
    ) {
      const sub = item as ExerciseSubmission;
      if (submissionMap.has(sub.exerciseId)) {
        return NextResponse.json({ error: "Bài làm bị trùng câu hỏi." }, { status: 400 });
      }
      submissionMap.set(sub.exerciseId, sub.answer);
    }
  }

  if (lesson.exercises.some((exercise) => !submissionMap.has(exercise.id))) {
    return NextResponse.json({ error: "Bài làm chưa đầy đủ." }, { status: 400 });
  }

  // Server-side re-evaluation: never trust client score
  let correctCount = 0;
  const totalExercises = lesson.exercises.length;

  for (const exercise of lesson.exercises) {
    const userAnswer = submissionMap.get(exercise.id);
    const result = evaluateExercise(exercise, userAnswer);
    if (result.isCorrect) {
      correctCount += 1;
    }
  }

  const accuracy =
    totalExercises > 0 ? Math.round((correctCount / totalExercises) * 100) : 0;

  // Execute atomic completion RPC on Supabase
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Chưa cấu hình máy chủ lưu tiến độ." }, { status: 503 });
  }
  let before;
  try {
    before = await getLearningSummary();
  } catch {
    return NextResponse.json({ error: "Chưa thể kiểm tra phần thưởng. Vui lòng thử lại." }, { status: 503 });
  }
  const supabase = createAdminClient();
  const { data: rpcResult, error: rpcError } = await supabase.rpc(
    "record_trusted_lesson_completion",
    {
      p_lesson_id: lesson.id,
      p_language: lesson.language,
      p_stage_id: lesson.stageId,
      p_correct_count: correctCount,
      p_total_exercises: totalExercises,
      p_accuracy: accuracy,
      p_learning_minutes: lesson.estimatedMinutes,
      p_user_id: user.id,
      p_request_id: requestId,
    }
  );

  if (rpcError) {
    console.error("Error recording lesson completion:", rpcError);
    const isMissingFunctionOrTable =
      rpcError.code === "PGRST202" ||
      rpcError.code === "42883" ||
      rpcError.code === "42P01" ||
      rpcError.message?.toLowerCase().includes("does not exist") ||
      rpcError.message?.toLowerCase().includes("schema cache");

    return NextResponse.json(
      {
        error: isMissingFunctionOrTable
          ? "Máy chủ chưa được cập nhật cấu trúc lưu tiến độ. Vui lòng liên hệ quản trị viên."
          : "Chưa thể lưu tiến độ học. Vui lòng thử lại.",
      },
      { status: 500 }
    );
  }

  const completionData = rpcResult as {
    is_first_completion?: boolean;
    xp_awarded?: number;
    learning_minutes?: number;
  };

  let after;
  try {
    after = await getLearningSummary();
  } catch {
    // Retrying with the same UUID is safe: the database already saved this completion.
    return NextResponse.json({ error: "Đã lưu bài nhưng chưa đọc được phần thưởng. Vui lòng thử lưu lại." }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    isFirstCompletion: completionData?.is_first_completion ?? false,
    xpAwarded: completionData?.xp_awarded ?? 0,
    learningMinutes: completionData?.learning_minutes ?? lesson.estimatedMinutes,
    dailyGoalMinutesAdded: Math.max(0, after.todayLearningMinutes - before.todayLearningMinutes),
    newAchievements: after.earnedAchievementIds.filter((id) => !before.earnedAchievementIds.includes(id)),
    accuracy,
    correctCount,
    totalExercises,
  });
}

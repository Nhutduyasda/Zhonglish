import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUserProfile } from "@/lib/supabase/profile";
import { getLessonById } from "@/data/lessons";
import { evaluateExercise } from "@/features/lesson/evaluation";
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

  const { lessonId, submissions } = body as {
    lessonId: string;
    submissions?: unknown[];
  };

  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return NextResponse.json(
      { error: "Bài học không tồn tại." },
      { status: 404 }
    );
  }

  const { user, profile } = await getUserProfile();
  if (!user || !profile) {
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

  // Validate submissions array
  if (!Array.isArray(submissions)) {
    return NextResponse.json(
      { error: "Dữ liệu bài làm không hợp lệ." },
      { status: 400 }
    );
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
      submissionMap.set(sub.exerciseId, sub.answer);
    }
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
  const supabase = await createClient();
  const { data: rpcResult, error: rpcError } = await supabase.rpc(
    "record_lesson_completion",
    {
      p_lesson_id: lesson.id,
      p_language: lesson.language,
      p_stage_id: lesson.stageId,
      p_correct_count: correctCount,
      p_total_exercises: totalExercises,
      p_accuracy: accuracy,
      p_learning_minutes: lesson.estimatedMinutes,
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
          ? "Cơ sở dữ liệu Supabase chưa được cập nhật bảng/hàm tiến độ. Vui lòng chạy file migration 'supabase/migrations/0003_learning_progress.sql' trên Supabase SQL Editor."
          : `Lỗi cơ sở dữ liệu: ${rpcError.message || "Chưa thể lưu tiến độ học."}`,
        details: rpcError.message,
        code: rpcError.code,
      },
      { status: 500 }
    );
  }

  const completionData = rpcResult as {
    is_first_completion?: boolean;
    xp_awarded?: number;
    learning_minutes?: number;
  };

  return NextResponse.json({
    ok: true,
    isFirstCompletion: completionData?.is_first_completion ?? false,
    xpAwarded: completionData?.xp_awarded ?? 0,
    learningMinutes: completionData?.learning_minutes ?? lesson.estimatedMinutes,
    accuracy,
    correctCount,
    totalExercises,
  });
}

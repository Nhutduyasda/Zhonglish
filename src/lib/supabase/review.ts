import "server-only";
import { getLessonById } from "@/data/lessons";
import type { ReviewSessionItem, ReviewStateRow } from "@/features/review/types";
import { createAdminClient } from "./admin";
import { createClient } from "./server";

export type ReviewSummary = { dueReviewCount: number; weakItemCount: number };

export async function getReviewSummary(userId: string): Promise<ReviewSummary> {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const [due, weak] = await Promise.all([
    supabase.from("review_state").select("id", { count: "exact", head: true })
      .eq("user_id", userId).eq("is_active", true).lte("next_review_at", now),
    supabase.from("review_state").select("id", { count: "exact", head: true })
      .eq("user_id", userId).eq("is_active", true).lte("strength", 1),
  ]);
  if (due.error || weak.error) {
    throw new Error(due.error?.message ?? weak.error?.message ?? "Không thể tải dữ liệu ôn tập.");
  }
  return { dueReviewCount: due.count ?? 0, weakItemCount: weak.count ?? 0 };
}

export async function getDueReviewItems(userId: string, limit = 5): Promise<ReviewSessionItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("review_state")
    .select("id, language, source_lesson_id, source_exercise_id, vocabulary_id, strength, repetitions, mistake_count, next_review_at, created_at")
    .eq("user_id", userId).eq("is_active", true)
    .lte("next_review_at", new Date().toISOString())
    .order("next_review_at", { ascending: true })
    .order("mistake_count", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(Math.min(Math.max(limit * 3, limit), 30));
  if (error) throw new Error(error.message);

  const items: ReviewSessionItem[] = [];
  const staleIds: string[] = [];
  for (const row of (data ?? []) as ReviewStateRow[]) {
    const lesson = getLessonById(row.source_lesson_id);
    const exercise = lesson?.exercises.find((candidate) => candidate.id === row.source_exercise_id);
    if (!lesson || !exercise || lesson.language !== row.language) {
      staleIds.push(row.id);
      continue;
    }
    items.push({
      reviewId: row.id,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      exercise,
      strength: row.strength,
      mistakeCount: row.mistake_count,
    });
    if (items.length >= Math.min(Math.max(limit, 1), 10)) break;
  }

  if (staleIds.length > 0) {
    const admin = createAdminClient();
    const { error: staleError } = await admin.from("review_state")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("user_id", userId).in("id", staleIds);
    if (staleError) console.error("Failed to deactivate stale review items:", staleError);
  }
  return items;
}

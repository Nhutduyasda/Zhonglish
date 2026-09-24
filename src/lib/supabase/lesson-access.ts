import "server-only";
import { courses } from "@/data/curriculum";
import { getLessonsForStage } from "@/data/lessons";
import type { Lesson } from "@/features/lesson/types";
import { createClient } from "./server";

/** Check progression with the signed-in user's RLS-bound client. Fail closed on read errors. */
export async function isLessonUnlocked(userId: string, lesson: Lesson): Promise<boolean> {
  const stages = courses[lesson.language].stages;
  const stageIndex = stages.findIndex((stage) => stage.id === lesson.stageId);
  if (stageIndex < 0) return false;
  if (stageIndex === 0) return true;

  const requiredLessons = stages.slice(0, stageIndex).flatMap((stage) =>
    getLessonsForStage(lesson.language, stage.id)
  );
  if (requiredLessons.length < stageIndex) return false;

  const client = await createClient();
  const { data, error } = await client
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("status", "completed")
    .in("lesson_id", requiredLessons.map((required) => required.id));

  if (error || !data) {
    throw new Error("Could not verify lesson access");
  }
  const completed = new Set(data.map((row) => row.lesson_id));
  return requiredLessons.every((required) => completed.has(required.id));
}

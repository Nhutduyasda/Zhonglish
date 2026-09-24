import "server-only";
import { createClient } from "./server";
import type { AchievementId } from "@/data/achievements";

export type LearningSummary = {
  todayLearningMinutes: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  completedLessons: number;
  earnedAchievementIds: AchievementId[];
};

export type DashboardLearningStats = LearningSummary & {
  completedLessonIds: string[];
};

const achievementIds: AchievementId[] = ["first_lesson", "three_lessons", "three_day_streak"];

export async function getLearningSummary(): Promise<LearningSummary> {
  const client = await createClient();
  const { data, error } = await client.rpc("get_learning_summary");
  if (error || !data || typeof data !== "object") {
    throw new Error("Could not load learning summary");
  }
  const summary = data as Record<string, unknown>;
  const numericKeys = ["today_learning_minutes", "total_xp", "current_streak", "longest_streak", "completed_lessons"];
  if (numericKeys.some((key) => !Number.isSafeInteger(summary[key]) || (summary[key] as number) < 0) ||
      !Array.isArray(summary.achievements)) {
    throw new Error("Invalid learning summary");
  }

  const earnedAchievementIds = achievementIds.filter((id) =>
    (summary.achievements as unknown[]).some((value) => {
      if (!value || typeof value !== "object") return false;
      const achievement = value as { id?: unknown; earned?: unknown };
      return achievement.id === id && achievement.earned === true;
    })
  );

  return {
    todayLearningMinutes: summary.today_learning_minutes as number,
    totalXp: summary.total_xp as number,
    currentStreak: summary.current_streak as number,
    longestStreak: summary.longest_streak as number,
    completedLessons: summary.completed_lessons as number,
    earnedAchievementIds,
  };
}

export async function getDashboardLearningData(userId: string): Promise<DashboardLearningStats> {
  const client = await createClient();
  const [{ data, error }, summary] = await Promise.all([
    client.from("lesson_progress").select("lesson_id").eq("user_id", userId).eq("status", "completed"),
    getLearningSummary(),
  ]);
  if (error || !data) throw new Error("Could not load lesson progression");
  return { ...summary, completedLessonIds: data.map((row) => row.lesson_id) };
}

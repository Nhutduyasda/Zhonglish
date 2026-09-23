import { createClient } from "./server";

export type DashboardLearningStats = {
  completedLessonIds: string[];
  todayLearningMinutes: number;
  totalXp: number;
  currentStreak: number;
};

/**
 * Returns UTC date string 'YYYY-MM-DD' for a Date instance or ISO string
 */
function toUtcDateString(dateInput: Date | string): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return d.toISOString().split("T")[0];
}

/**
 * Calculates the current streak of consecutive days meeting the daily goal.
 */
function calculateStreak(
  activities: { learning_minutes: number; completed_at: string }[],
  dailyGoalMinutes: number
): number {
  if (!activities || activities.length === 0 || dailyGoalMinutes <= 0) {
    return 0;
  }

  // Aggregate minutes by UTC date string 'YYYY-MM-DD'
  const minutesByDate = new Map<string, number>();
  for (const act of activities) {
    const dateKey = toUtcDateString(act.completed_at);
    const current = minutesByDate.get(dateKey) ?? 0;
    minutesByDate.set(dateKey, current + act.learning_minutes);
  }

  const now = new Date();
  const todayKey = toUtcDateString(now);

  const yesterday = new Date(now);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayKey = toUtcDateString(yesterday);

  const todayMinutes = minutesByDate.get(todayKey) ?? 0;
  const yesterdayMinutes = minutesByDate.get(yesterdayKey) ?? 0;

  const todayCompleted = todayMinutes >= dailyGoalMinutes;
  const yesterdayCompleted = yesterdayMinutes >= dailyGoalMinutes;

  // If neither today nor yesterday met the goal, streak is 0
  if (!todayCompleted && !yesterdayCompleted) {
    return 0;
  }

  let streak = 0;
  // Start checking from today if today reached goal, otherwise from yesterday
  const cursor = todayCompleted ? new Date(now) : new Date(yesterday);

  while (true) {
    const key = toUtcDateString(cursor);
    const dayMinutes = minutesByDate.get(key) ?? 0;

    if (dayMinutes >= dailyGoalMinutes) {
      streak += 1;
      // Move 1 day back in UTC
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export async function getDashboardLearningData(
  userId: string,
  dailyGoalMinutes: number
): Promise<DashboardLearningStats> {
  const defaultStats: DashboardLearningStats = {
    completedLessonIds: [],
    todayLearningMinutes: 0,
    totalXp: 0,
    currentStreak: 0,
  };

  try {
    const supabase = await createClient();

    // 1. Fetch completed lesson IDs
    const { data: progressData, error: progressError } = await supabase
      .from("lesson_progress")
      .select("lesson_id, status")
      .eq("user_id", userId)
      .eq("status", "completed");

    const completedLessonIds =
      progressError || !progressData
        ? []
        : progressData.map((p) => p.lesson_id);

    // 2. Fetch all learning activity records
    const { data: activityData, error: activityError } = await supabase
      .from("learning_activity")
      .select("learning_minutes, xp_awarded, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (activityError || !activityData) {
      return {
        ...defaultStats,
        completedLessonIds,
      };
    }

    // 3. Compute total XP
    const totalXp = activityData.reduce(
      (sum, item) => sum + (item.xp_awarded ?? 0),
      0
    );

    // 4. Compute today's learning minutes
    const todayKey = toUtcDateString(new Date());
    const todayLearningMinutes = activityData.reduce((sum, item) => {
      const itemDateKey = toUtcDateString(item.completed_at);
      return itemDateKey === todayKey
        ? sum + (item.learning_minutes ?? 0)
        : sum;
    }, 0);

    // 5. Compute streak
    const currentStreak = calculateStreak(activityData, dailyGoalMinutes);

    return {
      completedLessonIds,
      todayLearningMinutes,
      totalXp,
      currentStreak,
    };
  } catch (err) {
    console.error("Failed to load dashboard learning data:", err);
    return defaultStats;
  }
}

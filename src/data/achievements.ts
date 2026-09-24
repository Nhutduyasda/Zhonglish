export type AchievementId = "first_lesson" | "three_lessons" | "three_day_streak";

export const achievements: ReadonlyArray<{
  id: AchievementId;
  title: string;
  description: string;
}> = [
  { id: "first_lesson", title: "Bước đầu tiên", description: "Hoàn thành bài học đầu tiên" },
  { id: "three_lessons", title: "Ham học hỏi", description: "Hoàn thành 3 bài học khác nhau" },
  { id: "three_day_streak", title: "Bền bỉ", description: "Học trong 3 ngày liên tiếp" },
];

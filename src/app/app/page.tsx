import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDashboardLearningData } from "@/lib/supabase/learning-progress";
import { courses } from "@/data/curriculum";
import { getNextLessonForUser } from "@/data/lessons";
import { LearningHeader } from "@/components/learning/learning-header";
import { ContinueLearningCard } from "@/components/learning/continue-learning-card";
import { LearningStats } from "@/components/learning/learning-stats";
import { CoursePath } from "@/components/learning/course-path";
import { Achievements } from "@/components/learning/achievements";
import { ReviewCard } from "@/components/learning/review-card";
import { getReviewSummary } from "@/lib/supabase/review";

export const dynamic = "force-dynamic";

const goalNames: Record<string, string> = {
  communication: "Giao tiếp tự tin",
  work: "Phục vụ công việc",
  travel: "Du lịch & trải nghiệm",
  study: "Du học & chứng chỉ",
  other: "Sở thích cá nhân",
};

export default async function LearningDashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect("/sign-in");
  }

  const { user, profile } = await getUserProfile();

  if (!user) {
    redirect("/sign-in");
  }

  if (!profile || !profile.onboarding_completed) {
    redirect("/onboarding?resume=1");
  }

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  // 1. Fetch real progress data from Supabase
  const [stats, reviewSummary] = await Promise.all([
    getDashboardLearningData(user.id),
    getReviewSummary(user.id).catch((error) => {
      console.error("Failed to load review summary:", error);
      return { dueReviewCount: 0, weakItemCount: 0 };
    }),
  ]);

  // 2. Resolve the next lesson and stage progression
  const course = courses[profile.learning_language];
  const nextLesson = getNextLessonForUser(
    profile.learning_language,
    stats.completedLessonIds
  );
  const hasAnyCompletion = stats.completedLessonIds.length > 0;
  const goalLabel = goalNames[profile.learning_goal] ?? "Phát triển bản thân";

  return (
    <div className="learning-shell">
      <LearningHeader
        learningLanguage={profile.learning_language}
        userEmail={user.email}
        signOutAction={signOut}
      />

      <main className="learning-main">
        <div className="learning-content-container">
          {/* Greeting section */}
          <section className="learning-greeting-section" aria-label="Lời chào">
            <div className="learning-greeting-content">
              <h1 className="learning-greeting-title">
                Chào mừng bạn quay lại 👋
              </h1>
              <p className="learning-greeting-subtitle">
                Khoá học: <strong>{course.name}</strong> · Mục tiêu:{" "}
                <strong>{goalLabel}</strong>
              </p>
            </div>
          </section>

          {/* Continue Learning CTA (Dynamic Next Lesson) */}
          <ContinueLearningCard
            course={course}
            learningLanguage={profile.learning_language}
            nextLesson={nextLesson}
            hasAnyCompletion={hasAnyCompletion}
          />

          <ReviewCard dueReviewCount={reviewSummary.dueReviewCount} />

          {/* Real Daily Goal, Streak & XP Stats */}
          <LearningStats
            dailyGoalMinutes={profile.daily_goal_minutes}
            todayLearningMinutes={stats.todayLearningMinutes}
            totalXp={stats.totalXp}
            currentStreak={stats.currentStreak}
          />

          <Achievements earnedIds={stats.earnedAchievementIds} />

          {/* Dynamic Course Roadmap */}
          <CoursePath
            course={course}
            learningLanguage={profile.learning_language}
            completedLessonIds={stats.completedLessonIds}
          />
        </div>
      </main>
    </div>
  );
}

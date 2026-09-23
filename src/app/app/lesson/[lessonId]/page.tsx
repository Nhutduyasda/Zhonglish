import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUserProfile } from "@/lib/supabase/profile";
import { getLessonById, getStarterLessonForLanguage } from "@/data/lessons";
import { LessonPlayer } from "@/components/lesson/lesson-player";

export const dynamic = "force-dynamic";

type LessonPageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
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

  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  // If lesson doesn't exist, redirect safely to dashboard
  if (!lesson) {
    redirect("/app");
  }

  // Language Guard: Prevent cross-language mismatch
  if (lesson.language !== profile.learning_language) {
    const safeStarterLesson = getStarterLessonForLanguage(profile.learning_language);
    redirect(`/app/lesson/${safeStarterLesson}`);
  }

  return <LessonPlayer lesson={lesson} />;
}

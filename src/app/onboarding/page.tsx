import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { authStatus } from "@/lib/supabase/profile";

export default async function Page({ searchParams }: { searchParams: Promise<{ language?: string }> }) {
  const [params, status] = await Promise.all([searchParams, authStatus()]);
  if (status.completed) redirect("/app");
  const language = params.language === "english" || params.language === "chinese" ? params.language : undefined;
  return <OnboardingFlow initialLanguage={language} authenticated={Boolean(status.user)} />;
}

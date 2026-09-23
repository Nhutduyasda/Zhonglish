export type OnboardingDraft = {
  language: "english" | "chinese";
  goal: "communication" | "work" | "travel" | "study" | "other";
  dailyGoal: 5 | 10 | 15;
  experience: "absolute_beginner" | "some_knowledge";
};
export type PartialDraft = Partial<OnboardingDraft>;
export const DRAFT_KEY = "zhonglish:onboarding:v1";

export function validateDraft(value: unknown): OnboardingDraft | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (v.language !== "english" && v.language !== "chinese") return null;
  if (!["communication", "work", "travel", "study", "other"].includes(String(v.goal))) return null;
  if (v.dailyGoal !== 5 && v.dailyGoal !== 10 && v.dailyGoal !== 15) return null;
  if (v.experience !== "absolute_beginner" && v.experience !== "some_knowledge") return null;
  return v as OnboardingDraft;
}

export function readDraft(): PartialDraft {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    const value: unknown = raw ? JSON.parse(raw) : {};
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const v = value as Record<string, unknown>;
    return {
      ...(v.language === "english" || v.language === "chinese" ? { language: v.language } : {}),
      ...(["communication", "work", "travel", "study", "other"].includes(String(v.goal)) ? { goal: v.goal as OnboardingDraft["goal"] } : {}),
      ...(v.dailyGoal === 5 || v.dailyGoal === 10 || v.dailyGoal === 15 ? { dailyGoal: v.dailyGoal } : {}),
      ...(v.experience === "absolute_beginner" || v.experience === "some_knowledge" ? { experience: v.experience } : {}),
    };
  } catch { return {}; }
}
export function writeDraft(value: PartialDraft) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(value));
}

export async function persistDraft(): Promise<"saved" | "missing" | "error"> {
  const draft = validateDraft(readDraft());
  if (!draft) return "missing";
  try {
    const response = await fetch("/api/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!response.ok) return "error";
    sessionStorage.removeItem(DRAFT_KEY);
    return "saved";
  } catch { return "error"; }
}

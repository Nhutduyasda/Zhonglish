import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { ReviewPlayer } from "@/components/review/review-player";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUserProfile } from "@/lib/supabase/profile";
import { getDueReviewItems } from "@/lib/supabase/review";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  if (!isSupabaseConfigured()) redirect("/sign-in");
  const { user, profile } = await getUserProfile();
  if (!user) redirect("/sign-in");
  if (!profile?.onboarding_completed) redirect("/onboarding?resume=1");

  let items;
  try { items = await getDueReviewItems(user.id, 5); } catch (error) {
    console.error("Failed to load review session:", error);
    return (
      <main className="review-state-page">
        <AlertCircle size={42} aria-hidden="true" />
        <h1>Chưa thể tải nội dung ôn tập</h1>
        <p>Vui lòng thử tải lại trang. Tiến độ đã lưu của bạn vẫn an toàn.</p>
        <Link href="/app/review" className="review-primary-link">Thử lại</Link>
        <Link href="/app" className="review-secondary-link">Quay lại Dashboard</Link>
      </main>
    );
  }
  if (items.length === 0) {
    return (
      <main className="review-state-page">
        <CheckCircle2 size={46} aria-hidden="true" />
        <h1>Không có nội dung cần ôn lúc này 🎉</h1>
        <p>Bạn đã hoàn thành mọi nội dung đang đến hạn.</p>
        <Link href="/app" className="review-primary-link">Quay lại Dashboard</Link>
      </main>
    );
  }
  return <ReviewPlayer items={items} />;
}

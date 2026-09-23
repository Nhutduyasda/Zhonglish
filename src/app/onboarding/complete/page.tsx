import Link from "next/link";
import { redirect } from "next/navigation";
import { authStatus } from "@/lib/supabase/profile";
export default async function Page() {
  const status = await authStatus();
  if (!status.user) redirect("/sign-in");
  if (!status.completed) redirect("/onboarding?resume=1");
  return <main className="completion-page"><div><span className="completion-check">✓</span><p className="eyebrow">BƯỚC ĐẦU TIÊN</p><h1>Bạn đã sẵn sàng.</h1><p>Lựa chọn học tập đã được lưu. Hẹn gặp bạn ở bài học đầu tiên.</p><Link className="form-submit" href="/app">Tiếp tục →</Link></div></main>;
}

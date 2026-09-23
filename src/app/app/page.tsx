import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authStatus } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function Page() {
  if (!isSupabaseConfigured()) redirect("/sign-in");
  const status = await authStatus();
  if (!status.user) redirect("/sign-in");
  if (!status.completed) redirect("/onboarding?resume=1");
  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }
  return <main className="app-placeholder"><div><Link href="/" className="auth-brand">✳ Zhonglish</Link><h1>Hồ sơ học tập đã sẵn sàng.</h1><p>Dashboard học tập sẽ được xây dựng ở Phase 3.</p><div className="app-actions"><Link href="/">Quay lại trang chủ</Link><form action={signOut}><button type="submit">Đăng xuất</button></form></div></div></main>;
}

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { persistDraft } from "@/features/onboarding/draft";

type Mode = "sign-in" | "sign-up" | "forgot-password" | "reset-password";
const copy = {
  "sign-in": ["Học tiếp từ nơi bạn đã dừng lại.", "Chào mừng bạn quay lại 👋"],
  "sign-up": ["Bắt đầu hành trình của bạn.", "Lưu lựa chọn để tiếp tục học trên bất kỳ thiết bị nào."],
  "forgot-password": ["Tìm lại mật khẩu.", "Nhập email để nhận đường dẫn đặt lại mật khẩu."],
  "reset-password": ["Đặt mật khẩu mới.", "Chọn mật khẩu bạn chưa dùng ở nơi khác."],
} as const;

function errorMessage(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("rate limit") || lower.includes("over_email_send_rate_limit")) return "Hệ thống đã vượt giới hạn gửi email xác nhận. Vui lòng thử lại sau; nếu lỗi tiếp diễn, hãy liên hệ quản trị viên.";
  if (lower.includes("email not confirmed")) return "Email chưa được xác nhận. Hãy mở thư xác nhận trước khi đăng nhập.";
  if (lower.includes("invalid login")) return "Email hoặc mật khẩu chưa đúng. Hãy kiểm tra lại nhé.";
  if (lower.includes("weak") || lower.includes("password")) return "Mật khẩu cần ít nhất 8 ký tự và đủ mạnh.";
  if (lower.includes("already registered") || lower.includes("already exists")) return "Email này đã có tài khoản. Hãy đăng nhập nhé.";
  if (lower.includes("expired") || lower.includes("invalid token")) return "Đường dẫn đã hết hạn. Hãy yêu cầu email mới.";
  return "Chưa kết nối được. Hãy kiểm tra mạng và thử lại.";
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(""); setSuccess("");
    if (!isSupabaseConfigured()) { setError("Tính năng tài khoản đang được cấu hình. Hãy quay lại sau."); return; }
    if ((mode === "sign-up" || mode === "reset-password") && (password.length < 8 || password !== confirm)) {
      setError("Mật khẩu cần ít nhất 8 ký tự và hai ô phải giống nhau."); return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      if (mode === "sign-in") {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        const saved = await persistDraft();
        if (saved === "error") { router.push("/onboarding?resume=1"); return; }
        router.push(saved === "saved" ? "/onboarding/complete" : "/app");
        router.refresh();
      } else if (mode === "sign-up") {
        const result = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (result.error) throw result.error;
        if (result.data.session) {
          const saved = await persistDraft();
          router.push(saved === "saved" ? "/onboarding/complete" : "/onboarding?resume=1");
          router.refresh();
        } else setSuccess(`Kiểm tra email ${email} để xác nhận tài khoản. Sau đó quay lại đăng nhập; lựa chọn học của bạn vẫn được giữ trên thiết bị này.`);
      } else if (mode === "forgot-password") {
        const result = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
        });
        if (result.error) throw result.error;
        setSuccess("Nếu email này có tài khoản, bạn sẽ nhận được đường dẫn đặt lại mật khẩu.");
      } else {
        const result = await supabase.auth.updateUser({ password });
        if (result.error) throw result.error;
        setSuccess("Đã đổi mật khẩu. Bạn có thể đăng nhập để tiếp tục.");
      }
    } catch (cause) {
      setError(errorMessage(cause instanceof Error ? cause.message : ""));
    } finally { setBusy(false); }
  }

  return <div className="auth-shell"><div className="auth-art"><Link href="/" className="auth-brand">✳ Zhonglish</Link><div><span>HELLO / 你好</span><h2>Mỗi ngày một chút.<br />Bạn sẽ đi xa hơn.</h2></div><p>English + Chinese cho người mới bắt đầu.</p></div><main className="auth-main"><Link href="/" className="auth-back">← Trang chủ</Link><div className="auth-content"><span className="eyebrow">ZHONGLISH / TÀI KHOẢN</span><h1>{copy[mode][0]}</h1><p>{copy[mode][1]}</p>{success ? <div className="auth-success" role="status">✓ {success}<br /><Link href="/sign-in">Quay lại đăng nhập →</Link></div> : <form onSubmit={submit} noValidate>
    {mode !== "reset-password" && <label>Email<input type="email" name="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="ban@example.com" /></label>}
    {mode !== "forgot-password" && <label>{mode === "reset-password" ? "Mật khẩu mới" : "Mật khẩu"}<input type="password" name="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} required minLength={mode === "sign-in" ? 1 : 8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Ít nhất 8 ký tự" /></label>}
    {(mode === "sign-up" || mode === "reset-password") && <label>Nhập lại mật khẩu<input type="password" name="confirm" autoComplete="new-password" required value={confirm} onChange={e => setConfirm(e.target.value)} /></label>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="form-submit" type="submit" disabled={busy}>{busy ? "Đang xử lý…" : mode === "sign-in" ? "Đăng nhập" : mode === "sign-up" ? "Tạo tài khoản" : mode === "forgot-password" ? "Gửi email đặt lại" : "Lưu mật khẩu"}</button>
  </form>}
  <div className="auth-links">{mode === "sign-in" && <><Link href="/forgot-password">Quên mật khẩu?</Link><span>Chưa có tài khoản? <Link href="/sign-up">Tạo tài khoản</Link></span></>}{mode === "sign-up" && <span>Đã có tài khoản? <Link href="/sign-in">Đăng nhập</Link></span>}{mode === "forgot-password" && <Link href="/sign-in">Quay lại đăng nhập</Link>}</div></div></main></div>;
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { persistDraft, readDraft, writeDraft, type PartialDraft, type OnboardingDraft } from "@/features/onboarding/draft";

const goals = [
  ["communication", "💬", "Giao tiếp"],
  ["work", "💼", "Công việc"],
  ["travel", "✈️", "Du lịch"],
  ["study", "🎓", "Học tập"],
  ["other", "✨", "Mục tiêu khác"],
] as const;
const minutes = [[5, "Nhẹ nhàng"], [10, "Đều đặn"], [15, "Tập trung"]] as const;
const experience = [["absolute_beginner", "Mình bắt đầu từ số 0", "Bắt đầu với những điều đơn giản nhất."], ["some_knowledge", "Mình đã biết một chút", "Bạn vẫn có thể học lại nền tảng và đi tiếp."]] as const;
const questions = ["Bạn muốn học gì trước?", "Bạn muốn dùng ngôn ngữ mới cho điều gì?", "Mỗi ngày bạn muốn dành bao lâu?", "Bạn đang bắt đầu từ đâu?"];

export function OnboardingFlow({ initialLanguage, authenticated }: { initialLanguage?: OnboardingDraft["language"]; authenticated: boolean }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<PartialDraft>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const previous = readDraft();
      const next = initialLanguage ? { ...previous, language: initialLanguage } : previous;
      setDraft(next);
      setStep(next.language && next.goal && next.dailyGoal && next.experience ? 4 : 0);
      if (initialLanguage) writeDraft(next);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [initialLanguage]);

  function select<K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    writeDraft(next);
    setError("");
  }
  function next() {
    if (step === 0 && !draft.language || step === 1 && !draft.goal || step === 2 && !draft.dailyGoal || step === 3 && !draft.experience) {
      setError("Hãy chọn một lựa chọn để tiếp tục."); return;
    }
    setStep(Math.min(4, step + 1)); setError("");
  }
  async function finish() {
    setSaving(true); setError("");
    const result = await persistDraft();
    setSaving(false);
    if (result === "saved") { router.push("/onboarding/complete"); router.refresh(); }
    else setError(result === "missing" ? "Lựa chọn chưa đầy đủ. Hãy quay lại kiểm tra nhé." : "Chưa lưu được. Hãy kiểm tra kết nối rồi thử lại.");
  }

  if (!ready) return <main className="onboarding-shell"><p>Đang mở hành trình học…</p></main>;
  return <main className="onboarding-shell"><div className="onboarding-top"><Link href="/" className="onboarding-brand">✳ Zhonglish</Link><span>Học theo nhịp của bạn</span></div><div className="onboarding-inner">
    {step > 0 && <button type="button" className="back-button" onClick={() => { setStep(step - 1); setError(""); }}>← Quay lại</button>}
    <div className="onboarding-progress" role="progressbar" aria-valuenow={step} aria-valuemin={0} aria-valuemax={4} aria-label="Tiến độ bắt đầu học"><span style={{ width: `${(step + 1) * 20}%` }} /></div>
    <motion.div key={step} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}>
      <p className="eyebrow">{step === 4 ? "HÀNH TRÌNH ĐÃ SẴN SÀNG" : "BẮT ĐẦU THẬT DỄ"}</p>
      <h1>{step === 4 ? "Tuyệt! Lộ trình của bạn đã sẵn sàng." : questions[step]}</h1>
      <p className="onboarding-description">{step === 4 ? "Lưu lựa chọn để có thể học tiếp sau này." : "Chọn điều phù hợp nhất với bạn. Bạn luôn có thể đổi sau."}</p>
      {step === 0 && <div className="option-grid two"><button type="button" aria-pressed={draft.language === "english"} onClick={() => select("language", "english")}><strong>🇬🇧 English</strong><small>Bắt đầu bằng những câu giao tiếp đơn giản.</small></button><button type="button" aria-pressed={draft.language === "chinese"} onClick={() => select("language", "chinese")}><strong>中文 Chinese</strong><small>Làm quen Pinyin và những chữ đầu tiên.</small></button></div>}
      {step === 1 && <div className="option-grid">{goals.map(([value, icon, label]) => <button type="button" key={value} aria-pressed={draft.goal === value} onClick={() => select("goal", value)}><strong>{icon} {label}</strong></button>)}</div>}
      {step === 2 && <div className="option-grid">{minutes.map(([value, label]) => <button type="button" key={value} aria-pressed={draft.dailyGoal === value} onClick={() => select("dailyGoal", value)}><strong>{value} phút / ngày</strong><small>{label}{value === 10 ? " · Gợi ý" : ""}</small></button>)}</div>}
      {step === 3 && <div className="option-grid">{experience.map(([value, label, detail]) => <button type="button" key={value} aria-pressed={draft.experience === value} onClick={() => select("experience", value)}><strong>{label}</strong><small>{detail}</small></button>)}</div>}
      {step === 4 && <div className="draft-summary"><span>{draft.language === "english" ? "🇬🇧 English" : "🇨🇳 Chinese"}</span><span>🎯 {goals.find(x => x[0] === draft.goal)?.[2]}</span><span>⏱ {draft.dailyGoal} phút / ngày</span><span>🌱 {draft.experience === "absolute_beginner" ? "Bắt đầu từ số 0" : "Đã biết một chút"}</span></div>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {step < 4 ? <button type="button" className="form-submit" onClick={next}>Tiếp tục →</button> : authenticated ? <button type="button" className="form-submit" disabled={saving} onClick={finish}>{saving ? "Đang lưu…" : "Lưu hành trình của tôi"}</button> : <div className="gate-actions"><Link className="form-submit" href="/sign-up">Tạo tài khoản</Link><Link className="gate-secondary" href="/sign-in">Mình đã có tài khoản · Đăng nhập</Link></div>}
    </motion.div>
  </div><footer className="onboarding-footer">Một lựa chọn mỗi lần. Không cần vội.</footer></main>;
}

"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, AudioLines, CheckCircle2, Globe2, Info } from "lucide-react";

type Language = "english" | "chinese";
const lessons = {
  english: { label: "ENGLISH", word: "Hello!", pronunciation: "/həˈləʊ/", question: "“Hello” có nghĩa là gì?", options: ["Xin chào", "Cảm ơn", "Tạm biệt"], correct: "Xin chào" },
  chinese: { label: "中文", word: "你好", pronunciation: "nǐ hǎo", question: "“你好” có nghĩa là gì?", options: ["Xin chào", "Cảm ơn", "Tạm biệt"], correct: "Xin chào" },
} as const;

export function LanguageExperience() {
  const [language, setLanguage] = useState<Language>("chinese");
  const [answer, setAnswer] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const lesson = lessons[language];

  function previewLanguage(next: Language) {
    setLanguage(next);
    setAnswer(null);
  }

  return <>
    <section className="section-block page-width languages-section" id="languages" aria-labelledby="language-title">
      <div className="section-heading"><p className="eyebrow">CHỌN LỐI BẮT ĐẦU</p><h2 id="language-title">Hôm nay bạn muốn học gì?</h2><p>Chọn một ngôn ngữ để bắt đầu. Bạn có thể đổi bất cứ lúc nào.</p></div>
      <div className="language-grid">
        <a className="language-card language-english" href="/onboarding?language=english" aria-label="Bắt đầu học English"><span className="language-card-top"><Globe2 size={22}/> ENGLISH <ArrowRight size={24}/></span><span className="language-word">Hello<span>!</span></span><span className="language-subtitle">Từ những câu giao tiếp đầu tiên</span><span className="language-card-bottom">Bắt đầu học English <ArrowRight size={17}/></span></a>
        <a className="language-card language-chinese" href="/onboarding?language=chinese" aria-label="Bắt đầu học Chinese"><span className="language-card-top"><Globe2 size={22}/> 中文 <ArrowRight size={24}/></span><span className="language-word">你好<span>。</span></span><span className="language-subtitle">Từ Pinyin và những chữ đầu tiên</span><span className="language-card-bottom">Bắt đầu học Chinese <ArrowRight size={17}/></span></a>
      </div>
    </section>
    <section className="section-block page-width preview-section" id="lesson-preview" aria-labelledby="preview-title">
      <div className="section-heading"><p className="eyebrow">NHÌN THỬ MỘT BÀI HỌC</p><h2 id="preview-title">Học thật sẽ trông như thế này.</h2><p>Một câu hỏi nhỏ. Một câu trả lời rõ ràng. Đây chỉ là bản xem trước, chưa lưu tiến độ học.</p><div className="preview-tabs" role="group" aria-label="Ngôn ngữ của bài học mẫu"><button type="button" aria-pressed={language === "english"} onClick={() => previewLanguage("english")}>English</button><button type="button" aria-pressed={language === "chinese"} onClick={() => previewLanguage("chinese")}>中文</button></div></div>
      <div className="preview-stage">
        <div className="preview-side"><span className="preview-star">✳</span><h3>Ít hơn một trang giáo trình.<br />Nhiều hơn một chút tự tin.</h3><p>Nhận diện → chọn → hiểu. Hãy thử câu đầu tiên ngay tại đây.</p><span className="preview-side-bottom">ZHONGLISH / BÀI HỌC MẪU</span></div>
        <motion.div key={language} className="lesson-card" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div className="lesson-top"><span>BÀI HỌC MẪU · {lesson.label}</span><span>01 / 03</span></div>
          <div className="lesson-progress"><span /></div>
          <div className="lesson-word">{lesson.word}</div>
          <div className="lesson-pronunciation"><AudioLines size={17} aria-hidden="true" /> {lesson.pronunciation}</div>
          <h3>{lesson.question}</h3>
          <div className="lesson-options">{lesson.options.map((option) => <button type="button" key={option} onClick={() => setAnswer(option)} className={answer === option ? (option === lesson.correct ? "selected-correct" : "selected-incorrect") : ""} aria-pressed={answer === option}>{option}</button>)}</div>
          <div className="lesson-feedback" aria-live="polite">{answer ? <>{answer === lesson.correct ? <CheckCircle2 size={18} aria-hidden="true" /> : <Info size={18} aria-hidden="true" />} {answer === lesson.correct ? "Chính xác! Một bước nhỏ đã xong." : `Gần đúng rồi. ${lesson.word} nghĩa là “Xin chào”.`}</> : "Chọn một câu trả lời để xem phản hồi."}</div>
        </motion.div>
      </div>
    </section>
  </>;
}

"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";
import { ExerciseRenderer } from "@/components/lesson/exercise-renderer";
import { ExerciseFeedback } from "@/components/lesson/exercise-feedback";
import { LessonHeader } from "@/components/lesson/lesson-header";
import type { ReviewAnswerResult, ReviewSessionItem } from "@/features/review/types";

function isValidAnswer(item: ReviewSessionItem, answer: unknown) {
  const exercise = item.exercise;
  if (["multiple_choice", "listening", "hanzi_choice", "pinyin_choice"].includes(exercise.type)) {
    return typeof answer === "string" && answer.length > 0;
  }
  if (exercise.type === "text_input") return typeof answer === "string" && answer.trim().length > 0;
  return exercise.type === "matching" && !!answer && typeof answer === "object" && Object.keys(answer).length === exercise.pairs.length;
}

export function ReviewPlayer({ items }: { items: ReviewSessionItem[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<unknown>(null);
  const [result, setResult] = useState<ReviewAnswerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [results, setResults] = useState<ReviewAnswerResult[]>([]);
  const requestId = useRef<string | null>(null);
  const item = items[index];
  const completed = index >= items.length;

  const submit = useCallback(async () => {
    if (!item || result || isSubmitting || !isValidAnswer(item, answer)) return;
    requestId.current ??= crypto.randomUUID();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/review/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: item.reviewId, answer, requestId: requestId.current }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error ?? "Chưa thể lưu câu trả lời.");
      const nextResult = payload as ReviewAnswerResult;
      setResult(nextResult);
      setResults((current) => [...current, nextResult]);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }, [answer, isSubmitting, item, result]);

  const continueReview = () => {
    setIndex((current) => current + 1);
    setAnswer(null);
    setResult(null);
    setSubmitError(null);
    requestId.current = null;
  };

  if (completed) {
    const correct = results.filter((entry) => entry.isCorrect).length;
    return (
      <main className="review-result-wrap" aria-label="Kết quả ôn tập">
        <section className="review-result-card">
          <div className="review-result-icon" aria-hidden="true"><CheckCircle2 size={38} /></div>
          <h1>Ôn tập hoàn thành 🎉</h1>
          <p className="review-result-score">{correct} / {results.length} đúng</p>
          <p>{correct} nội dung đã được củng cố · {results.length - correct} nội dung sẽ xuất hiện lại sớm</p>
          <button type="button" className="result-dashboard-btn" onClick={() => { router.push("/app"); router.refresh(); }}>
            Quay lại Dashboard <ArrowRight size={17} aria-hidden="true" />
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="lesson-shell">
      <LessonHeader title={`Ôn tập · ${item.lessonTitle}`} currentIndex={index} totalExercises={items.length} onExit={() => router.push("/app")} />
      <main className="lesson-main">
        <div className="lesson-content-container">
          <p className="review-context">Nội dung cần ôn · Mức ghi nhớ {item.strength}/3</p>
          <ExerciseRenderer exercise={item.exercise} userAnswer={answer} isSubmitted={!!result} isCorrect={result?.isCorrect} onAnswerChange={setAnswer} onSubmit={submit} />
          {submitError && (
            <div className="review-submit-error" role="alert">
              <AlertCircle size={17} aria-hidden="true" /><span>{submitError}</span>
              <button type="button" onClick={submit}><RotateCcw size={14} aria-hidden="true" /> Thử lại</button>
            </div>
          )}
        </div>
      </main>
      <div className="lesson-bottom-bar">
        {result ? (
          <ExerciseFeedback isCorrect={result.isCorrect} correctAnswerDisplay={result.correctAnswerDisplay} explanation={result.explanation} onContinue={continueReview} />
        ) : (
          <div className="lesson-action-bar-inner">
            <button type="button" disabled={!isValidAnswer(item, answer) || isSubmitting} onClick={submit} className="lesson-check-btn">
              {isSubmitting ? "Đang kiểm tra..." : "Kiểm tra"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

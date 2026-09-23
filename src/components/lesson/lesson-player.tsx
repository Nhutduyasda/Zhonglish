"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type {
  Lesson,
  EvaluationResult,
  UserAnswerHistoryItem,
  LessonCompletionResult,
} from "@/features/lesson/types";
import { evaluateExercise } from "@/features/lesson/evaluation";
import { LessonHeader } from "./lesson-header";
import { ExitLessonDialog } from "./exit-lesson-dialog";
import { ExerciseRenderer } from "./exercise-renderer";
import { ExerciseFeedback } from "./exercise-feedback";
import { LessonResult } from "./lesson-result";

type LessonPlayerProps = {
  lesson: Lesson;
};

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const router = useRouter();

  // Navigation and exercise tracking
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<unknown>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [answersHistory, setAnswersHistory] = useState<UserAnswerHistoryItem[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Persistence tracking
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [completionResult, setCompletionResult] = useState<LessonCompletionResult | null>(null);
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());

  const currentExercise = lesson.exercises[currentIndex];
  const totalExercises = lesson.exercises.length;

  // Determine if user has provided a valid answer to enable "Kiểm tra"
  const isAnswerValid = useCallback(() => {
    if (!currentExercise) return false;
    switch (currentExercise.type) {
      case "multiple_choice":
      case "listening":
      case "hanzi_choice":
      case "pinyin_choice":
        return typeof currentAnswer === "string" && currentAnswer.length > 0;
      case "text_input":
        return typeof currentAnswer === "string" && currentAnswer.trim().length > 0;
      case "matching":
        return (
          typeof currentAnswer === "object" &&
          currentAnswer !== null &&
          Object.keys(currentAnswer).length === currentExercise.pairs.length
        );
      default:
        return false;
    }
  }, [currentExercise, currentAnswer]);

  // Submit and evaluate answer locally
  const handleSubmit = useCallback(() => {
    if (isSubmitted || !isAnswerValid() || !currentExercise) return;

    const result = evaluateExercise(currentExercise, currentAnswer);
    setEvaluationResult(result);
    setIsSubmitted(true);

    setAnswersHistory((prev) => [
      ...prev,
      {
        exerciseId: currentExercise.id,
        isCorrect: result.isCorrect,
        summary: result.correctAnswerDisplay,
        answer: currentAnswer,
      },
    ]);
  }, [isSubmitted, isAnswerValid, currentExercise, currentAnswer]);

  // Save completion to server API
  const saveCompletion = useCallback(
    async (historyToSave: UserAnswerHistoryItem[]) => {
      setSaveStatus("saving");
      setSaveErrorMessage(null);
      try {
        const submissions = historyToSave.map((item) => ({
          exerciseId: item.exerciseId,
          answer: item.answer,
        }));

        const response = await fetch("/api/lessons/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: lesson.id,
            submissions,
            requestId,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          const msg =
            errData?.error || "Chưa thể lưu tiến độ học vào hệ thống.";
          console.error("Save completion failed:", response.status, errData);
          setSaveErrorMessage(msg);
          setSaveStatus("error");
          return;
        }

        const data: LessonCompletionResult = await response.json();
        setCompletionResult(data);
        setSaveStatus("saved");
      } catch (err) {
        console.error("Save completion error:", err);
        setSaveErrorMessage("Lỗi kết nối mạng khi gửi dữ liệu bài học.");
        setSaveStatus("error");
      }
    },
    [lesson.id, requestId]
  );

  // Proceed to next exercise or complete lesson
  const handleContinue = useCallback(() => {
    if (currentIndex + 1 < totalExercises) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentAnswer(null);
      setIsSubmitted(false);
      setEvaluationResult(null);
    } else {
      setIsCompleted(true);
      // Initiate persistence call
      saveCompletion(answersHistory);
    }
  }, [currentIndex, totalExercises, answersHistory, saveCompletion]);

  // Exit handling
  const handleExitRequest = () => {
    if (answersHistory.length === 0 || isCompleted) {
      router.push("/app");
    } else {
      setShowExitModal(true);
    }
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    router.push("/app");
  };

  // Restart lesson in-place
  const handleRestart = () => {
    setRequestId(crypto.randomUUID());
    setCurrentIndex(0);
    setCurrentAnswer(null);
    setIsSubmitted(false);
    setEvaluationResult(null);
    setAnswersHistory([]);
    setIsCompleted(false);
    setSaveStatus("idle");
    setCompletionResult(null);
  };

  if (isCompleted) {
    return (
      <div className="lesson-shell">
        <LessonHeader
          title={lesson.title}
          currentIndex={totalExercises - 1}
          totalExercises={totalExercises}
          onExit={handleExitRequest}
        />
        <main className="lesson-main">
          <LessonResult
            lesson={lesson}
            answersHistory={answersHistory}
            saveStatus={saveStatus}
            saveErrorMessage={saveErrorMessage}
            completionResult={completionResult}
            onRetrySave={() => saveCompletion(answersHistory)}
            onRestart={handleRestart}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="lesson-shell">
      {/* Slim Top Bar */}
      <LessonHeader
        title={lesson.title}
        currentIndex={currentIndex}
        totalExercises={totalExercises}
        onExit={handleExitRequest}
      />

      {/* Main Exercise Area */}
      <main className="lesson-main">
        <div className="lesson-content-container">
          <ExerciseRenderer
            exercise={currentExercise}
            userAnswer={currentAnswer}
            isSubmitted={isSubmitted}
            isCorrect={evaluationResult?.isCorrect}
            onAnswerChange={setCurrentAnswer}
            onSubmit={handleSubmit}
          />
        </div>
      </main>

      {/* Bottom Action / Feedback Area */}
      <div className="lesson-bottom-bar">
        {isSubmitted && evaluationResult ? (
          <ExerciseFeedback
            isCorrect={evaluationResult.isCorrect}
            correctAnswerDisplay={evaluationResult.correctAnswerDisplay}
            explanation={evaluationResult.explanation}
            onContinue={handleContinue}
          />
        ) : (
          <div className="lesson-action-bar-inner">
            <button
              type="button"
              disabled={!isAnswerValid() || isSubmitted}
              onClick={handleSubmit}
              className="lesson-check-btn"
            >
              Kiểm tra
            </button>
          </div>
        )}
      </div>

      {/* Exit confirmation dialog */}
      <ExitLessonDialog
        isOpen={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}

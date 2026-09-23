"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Award,
  BookOpen,
  AlertCircle,
  Zap,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type {
  Lesson,
  UserAnswerHistoryItem,
  LessonCompletionResult,
} from "@/features/lesson/types";

type LessonResultProps = {
  lesson: Lesson;
  answersHistory: UserAnswerHistoryItem[];
  saveStatus: "idle" | "saving" | "saved" | "error";
  saveErrorMessage?: string | null;
  completionResult: LessonCompletionResult | null;
  onRetrySave: () => void;
  onRestart: () => void;
};

export function LessonResult({
  lesson,
  answersHistory,
  saveStatus,
  saveErrorMessage,
  completionResult,
  onRetrySave,
  onRestart,
}: LessonResultProps) {
  const router = useRouter();

  const total = answersHistory.length;
  const correctCount = answersHistory.filter((item) => item.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Mistakes in this session
  const wrongExercises = answersHistory.filter((item) => !item.isCorrect);

  const handleReturnToDashboard = () => {
    router.push("/app");
    router.refresh();
  };

  return (
    <div className="result-container" role="main" aria-label="Kết quả bài học">
      <div className="result-card">
        {/* Celebration Header */}
        <div className="result-celebration-badge" aria-hidden="true">
          <Award size={36} />
        </div>

        <h2 className="result-title">Bài học hoàn thành! 🎉</h2>
        <p className="result-subtitle">
          Bạn vừa hoàn thành bài học “{lesson.title}”.
        </p>

        {/* Persistence Status Banner */}
        {saveStatus === "saving" && (
          <div className="result-save-status result-save-saving" role="status">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            <span>Đang lưu tiến độ học tập...</span>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="result-save-status result-save-error" role="alert">
            <AlertCircle size={16} aria-hidden="true" />
            <div className="save-error-content">
              <span>{saveErrorMessage || "Chưa thể lưu tiến độ học vào hệ thống."}</span>
              <button
                type="button"
                onClick={onRetrySave}
                className="save-retry-btn"
              >
                <RefreshCw size={13} aria-hidden="true" />
                <span>Thử lưu lại</span>
              </button>
            </div>
          </div>
        )}

        {saveStatus === "saved" && completionResult && (
          <div className="result-save-status result-save-success" role="status">
            <CheckCircle2 size={16} className="text-emerald-600" aria-hidden="true" />
            <span>Tiến độ đã được ghi nhận vào hồ sơ.</span>
          </div>
        )}

        {/* Score & Accuracy Stats */}
        <div className="result-stats-row">
          <div className="result-stat-box">
            <span className="result-stat-number">
              {correctCount} / {total}
            </span>
            <span className="result-stat-label">Số câu đúng</span>
          </div>

          <div className="result-stat-box">
            <span className="result-stat-number">{accuracy}%</span>
            <span className="result-stat-label">Độ chính xác</span>
          </div>
        </div>

        {/* Real Rewards from Database */}
        {saveStatus === "saved" && completionResult && (
          <div className="result-rewards-row">
            <div className="reward-badge">
              <Zap size={18} className="text-amber-500 fill-amber-500" aria-hidden="true" />
              <span>
                {completionResult.isFirstCompletion
                  ? `+${completionResult.xpAwarded} XP`
                  : "Đã hoàn thành trước đó (+0 XP)"}
              </span>
            </div>

            <div className="reward-badge">
              <Clock size={18} className="text-emerald-600" aria-hidden="true" />
              <span>+{completionResult.learningMinutes} phút học tập</span>
            </div>
          </div>
        )}

        {/* Practiced Concepts */}
        <div className="result-section">
          <h3 className="result-section-title">
            <BookOpen size={16} aria-hidden="true" />
            <span>Nội dung bạn đã luyện:</span>
          </h3>
          <div className="result-topics-chips">
            {lesson.topicsPracticed.map((topic) => (
              <span key={topic} className="result-topic-pill">
                <CheckCircle2 size={13} aria-hidden="true" className="text-emerald-600" />
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Mistakes review in current session (if any) */}
        {wrongExercises.length > 0 && (
          <div className="result-section result-review-section">
            <h3 className="result-section-title text-amber-700">
              <AlertCircle size={16} aria-hidden="true" />
              <span>Điểm cần chú ý ôn lại:</span>
            </h3>
            <p className="result-review-hint">
              Bạn có thể làm lại bài này để đạt kết quả tối đa 100%.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="result-actions">
          <button
            type="button"
            onClick={onRestart}
            className="result-restart-btn"
          >
            <RotateCcw size={17} aria-hidden="true" />
            <span>Học lại</span>
          </button>

          <button
            type="button"
            onClick={handleReturnToDashboard}
            className="result-dashboard-btn"
          >
            <span>Quay lại Dashboard</span>
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

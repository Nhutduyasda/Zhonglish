import Link from "next/link";
import { CheckCircle2, RotateCcw, ArrowRight, Award, BookOpen, AlertCircle } from "lucide-react";
import type { Lesson, UserAnswerHistoryItem } from "@/features/lesson/types";

type LessonResultProps = {
  lesson: Lesson;
  answersHistory: UserAnswerHistoryItem[];
  onRestart: () => void;
};

export function LessonResult({
  lesson,
  answersHistory,
  onRestart,
}: LessonResultProps) {
  const total = answersHistory.length;
  const correctCount = answersHistory.filter((item) => item.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Mistakes in this session
  const wrongExercises = answersHistory.filter((item) => !item.isCorrect);

  return (
    <div className="result-container" role="main" aria-label="Kết quả bài học">
      <div className="result-card">
        {/* Celebration Header */}
        <div className="result-celebration-badge" aria-hidden="true">
          <Award size={36} />
        </div>

        <h2 className="result-title">Bài học hoàn thành! 🎉</h2>
        <p className="result-subtitle">
          Bạn vừa hoàn thành xuất sắc bài học “{lesson.title}”.
        </p>

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

        {/* Neutral gamification notice (no fake XP / Streak) */}
        <div className="result-gamification-notice">
          <p>
            Điểm thưởng và chuỗi ngày học sẽ được kết nối ở giai đoạn gamification.
          </p>
        </div>

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

          <Link href="/app" className="result-dashboard-btn">
            <span>Quay lại Dashboard</span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

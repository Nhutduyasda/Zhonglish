import { ArrowLeft } from "lucide-react";

type LessonHeaderProps = {
  title: string;
  currentIndex: number;
  totalExercises: number;
  onExit: () => void;
};

export function LessonHeader({
  title,
  currentIndex,
  totalExercises,
  onExit,
}: LessonHeaderProps) {
  const currentStep = currentIndex + 1;
  const progressPercent = totalExercises > 0
    ? Math.round((currentStep / totalExercises) * 100)
    : 0;

  return (
    <header className="lesson-header" aria-label="Điều hướng bài học">
      <div className="lesson-header-inner">
        {/* Back / Exit Button */}
        <button
          type="button"
          onClick={onExit}
          className="lesson-exit-btn"
          aria-label="Thoát khỏi bài học"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          <span className="lesson-exit-text">Thoát</span>
        </button>

        {/* Progress bar */}
        <div className="lesson-progress-wrapper">
          <div
            className="lesson-progress-bar"
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalExercises}
            aria-label={`Tiến độ bài học: câu ${currentStep} trên ${totalExercises}`}
          >
            <div
              className="lesson-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Counter and Title */}
        <div className="lesson-header-info">
          <span className="lesson-counter">
            {currentStep} / {totalExercises}
          </span>
          <span className="lesson-header-title" title={title}>
            {title}
          </span>
        </div>
      </div>
    </header>
  );
}

import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

type ExerciseFeedbackProps = {
  isCorrect: boolean;
  correctAnswerDisplay: string;
  explanation: string;
  onContinue: () => void;
};

export function ExerciseFeedback({
  isCorrect,
  correctAnswerDisplay,
  explanation,
  onContinue,
}: ExerciseFeedbackProps) {
  return (
    <div
      className={`exercise-feedback-bar ${
        isCorrect ? "feedback-correct" : "feedback-incorrect"
      }`}
      role="region"
      aria-live="polite"
      aria-label="Kết quả câu trả lời"
    >
      <div className="feedback-bar-inner">
        <div className="feedback-message-group">
          <div className="feedback-icon" aria-hidden="true">
            {isCorrect ? (
              <CheckCircle2 size={28} className="text-emerald-600" />
            ) : (
              <AlertCircle size={28} className="text-amber-600" />
            )}
          </div>

          <div className="feedback-text-content">
            <h4 className="feedback-headline">
              {isCorrect ? "Chính xác! 🎉" : "Gần đúng rồi."}
            </h4>

            {!isCorrect && (
              <div className="feedback-solution">
                <span className="solution-label">Đáp án đúng:</span>
                <span className="solution-value">{correctAnswerDisplay}</span>
              </div>
            )}

            {explanation && (
              <p className="feedback-explanation">{explanation}</p>
            )}
          </div>
        </div>

        <div className="feedback-actions">
          <button
            type="button"
            className="feedback-continue-btn"
            onClick={onContinue}
            autoFocus
          >
            <span>Tiếp tục</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

import type { MultipleChoiceExercise } from "@/features/lesson/types";

type MultipleChoiceProps = {
  exercise: MultipleChoiceExercise;
  selectedAnswer: string;
  isSubmitted: boolean;
  isCorrect?: boolean;
  onSelect: (option: string) => void;
};

export function MultipleChoice({
  exercise,
  selectedAnswer,
  isSubmitted,
  onSelect,
}: MultipleChoiceProps) {
  return (
    <div className="exercise-layout">
      <div className="exercise-prompt-area">
        <h3 className="exercise-prompt-text">{exercise.prompt}</h3>
      </div>

      <div
        className="options-grid"
        role="radiogroup"
        aria-label={exercise.prompt}
      >
        {exercise.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isOptionCorrect = isSubmitted && option === exercise.correctAnswer;
          const isOptionWrong = isSubmitted && isSelected && !isOptionCorrect;

          let optionStateClass = "";
          if (isOptionCorrect) {
            optionStateClass = "option-correct";
          } else if (isOptionWrong) {
            optionStateClass = "option-wrong";
          } else if (isSelected) {
            optionStateClass = "option-selected";
          }

          return (
            <button
              key={`${exercise.id}-opt-${index}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isSubmitted}
              className={`option-button ${optionStateClass}`}
              onClick={() => onSelect(option)}
            >
              <span className="option-index" aria-hidden="true">
                {index + 1}
              </span>
              <span className="option-text">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

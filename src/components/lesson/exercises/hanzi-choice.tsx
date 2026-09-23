"use client";

import type { HanziChoiceExercise } from "@/features/lesson/types";
import { SpeechButton } from "../speech-button";

type HanziChoiceProps = {
  exercise: HanziChoiceExercise;
  selectedAnswer: string;
  isSubmitted: boolean;
  onSelect: (option: string) => void;
};

export function HanziChoice({
  exercise,
  selectedAnswer,
  isSubmitted,
  onSelect,
}: HanziChoiceProps) {
  return (
    <div className="exercise-layout">
      {/* Prompt Area */}
      <div className="exercise-prompt-area">
        <h3 className="exercise-prompt-text">{exercise.prompt}</h3>
      </div>

      {/* Target Clue Presentation Box */}
      <div className="hanzi-target-clue-card" role="region" aria-label="Gợi ý từ vựng cần tìm">
        {exercise.pinyin && (
          <span className="hanzi-target-pinyin">{exercise.pinyin}</span>
        )}
        <span className="hanzi-target-meaning">{exercise.meaning}</span>
        {exercise.term?.speechText && (
          <div className="hanzi-target-audio">
            <SpeechButton
              text={exercise.term.speechText}
              lang="zh-CN"
              label={`Nghe phát âm gợi ý ${exercise.term.hanzi}, ${exercise.term.pinyin}`}
              variant="pill"
            />
          </div>
        )}
      </div>

      {/* Hanzi Choice Options Grid */}
      <div
        className="hanzi-options-grid"
        role="radiogroup"
        aria-label="Các lựa chọn chữ Hán"
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
              key={`${exercise.id}-hanzi-${index}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isSubmitted}
              className={`hanzi-choice-card ${optionStateClass}`}
              onClick={() => onSelect(option)}
              aria-label={`Lựa chọn ${index + 1}: Chữ Hán ${option}`}
            >
              <span className="hanzi-character-display chinese-hanzi" lang="zh-CN">
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

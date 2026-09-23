"use client";

import type { PinyinChoiceExercise } from "@/features/lesson/types";
import { SpeechButton } from "../speech-button";

type PinyinChoiceProps = {
  exercise: PinyinChoiceExercise;
  selectedAnswer: string;
  isSubmitted: boolean;
  onSelect: (option: string) => void;
};

export function PinyinChoice({
  exercise,
  selectedAnswer,
  isSubmitted,
  onSelect,
}: PinyinChoiceProps) {
  return (
    <div className="exercise-layout">
      {/* Prompt Area */}
      <div className="exercise-prompt-area">
        <h3 className="exercise-prompt-text">{exercise.prompt}</h3>
      </div>

      {/* Target Hanzi Presentation Box */}
      <div className="pinyin-target-hanzi-card" role="region" aria-label={`Chữ Hán: ${exercise.hanzi}`}>
        <div className="pinyin-target-character chinese-hanzi" lang="zh-CN">
          {exercise.hanzi}
        </div>
        {exercise.meaning && (
          <span className="pinyin-target-meaning">{exercise.meaning}</span>
        )}
        <div className="pinyin-target-audio">
          <SpeechButton
            text={exercise.term?.speechText || exercise.hanzi}
            lang="zh-CN"
            label={`Nghe phát âm chữ ${exercise.hanzi}`}
            variant="pill"
          />
        </div>
      </div>

      {/* Pinyin Choice Options Grid */}
      <div
        className="options-grid"
        role="radiogroup"
        aria-label="Các lựa chọn phiên âm pinyin"
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
              key={`${exercise.id}-pinyin-${index}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isSubmitted}
              className={`option-button ${optionStateClass}`}
              onClick={() => onSelect(option)}
              aria-label={`Lựa chọn ${index + 1}: ${option}`}
            >
              <span className="option-index" aria-hidden="true">
                {index + 1}
              </span>
              <span className="option-text font-medium text-lg">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

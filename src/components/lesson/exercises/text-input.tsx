"use client";

import type { TextInputExercise } from "@/features/lesson/types";

type TextInputProps = {
  exercise: TextInputExercise;
  userInput: string;
  isSubmitted: boolean;
  isCorrect?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function TextInput({
  exercise,
  userInput,
  isSubmitted,
  isCorrect,
  onChange,
  onSubmit,
}: TextInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitted && userInput.trim().length > 0) {
      e.preventDefault();
      onSubmit();
    }
  };

  let inputStateClass = "";
  if (isSubmitted) {
    inputStateClass = isCorrect ? "input-correct" : "input-wrong";
  }

  return (
    <div className="exercise-layout">
      <div className="exercise-prompt-area">
        <h3 id={`prompt-${exercise.id}`} className="exercise-prompt-text">
          {exercise.prompt}
        </h3>
      </div>

      <div className="text-input-area">
        <label htmlFor={`input-${exercise.id}`} className="sr-only">
          {exercise.prompt}
        </label>
        <input
          id={`input-${exercise.id}`}
          type="text"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
          placeholder={exercise.placeholder || "Nhập câu trả lời của bạn..."}
          value={userInput}
          disabled={isSubmitted}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`lesson-text-field ${inputStateClass}`}
          aria-labelledby={`prompt-${exercise.id}`}
        />
        <p className="text-input-hint">Nhấn Enter hoặc bấm Kiểm tra bên dưới</p>
      </div>
    </div>
  );
}

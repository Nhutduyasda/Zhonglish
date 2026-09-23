"use client";

import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { ListeningExercise } from "@/features/lesson/types";

type ListeningProps = {
  exercise: ListeningExercise;
  selectedAnswer: string;
  isSubmitted: boolean;
  onSelect: (option: string) => void;
};

export function Listening({
  exercise,
  selectedAnswer,
  isSubmitted,
  onSelect,
}: ListeningProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Cancel speech on unmount or when exercise changes
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [exercise.id]);

  const playAudio = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeechSupported(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // cancel any active utterance
      const utterance = new SpeechSynthesisUtterance(exercise.speechText);
      utterance.lang = exercise.speechLang;
      utterance.rate = 0.85; // slightly slower for language learners

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setHasPlayedOnce(true);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setHasPlayedOnce(true);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeechSupported(false);
    }
  }, [exercise.speechText, exercise.speechLang]);

  return (
    <div className="exercise-layout">
      <div className="exercise-prompt-area">
        <h3 className="exercise-prompt-text">{exercise.prompt}</h3>
      </div>

      {/* Audio Play Control */}
      <div className="listening-audio-box">
        {speechSupported ? (
          <div className="audio-control-group">
            <button
              type="button"
              onClick={playAudio}
              className={`listening-play-btn ${isPlaying ? "playing" : ""}`}
              aria-label={hasPlayedOnce ? "Nghe lại phát âm" : "Phát âm thanh bài tập"}
            >
              <Volume2 size={32} aria-hidden="true" />
              <span>{hasPlayedOnce ? "Nghe lại" : "Bấm để nghe phát âm"}</span>
            </button>
            <p className="listening-hint">
              {hasPlayedOnce
                ? "Bạn có thể bấm nghe lại bao nhiêu lần tuỳ thích"
                : "Bấm vào nút trên để nghe giọng đọc"}
            </p>
          </div>
        ) : (
          <div className="audio-fallback-box">
            <div className="fallback-header">
              <VolumeX size={20} aria-hidden="true" />
              <span>Trình duyệt không hỗ trợ phát âm tự động</span>
            </div>
            {exercise.fallbackTextAlternative && (
              <p className="fallback-text">{exercise.fallbackTextAlternative}</p>
            )}
          </div>
        )}
      </div>

      {/* Options */}
      <div
        className="options-grid"
        role="radiogroup"
        aria-label="Chọn đáp án bạn nghe thấy"
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
              key={`${exercise.id}-lis-${index}`}
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

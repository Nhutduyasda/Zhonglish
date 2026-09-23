"use client";

import { useState, useMemo } from "react";
import type { MatchingExercise } from "@/features/lesson/types";

type MatchingProps = {
  exercise: MatchingExercise;
  userPairs: Record<string, string>; // leftId -> rightId
  isSubmitted: boolean;
  onPairsChange: (pairs: Record<string, string>) => void;
};

// Deterministic seed-based pseudo shuffle so server and client match
function pseudoShuffle<T>(array: readonly T[], seed: string): T[] {
  const result = [...array];
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  for (let i = result.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) | 0;
    const j = Math.abs(h) % (i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export function Matching({
  exercise,
  userPairs,
  isSubmitted,
  onPairsChange,
}: MatchingProps) {
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);

  // Shuffled right items (consistent across renders for the same exercise)
  const rightItems = useMemo(() => {
    return pseudoShuffle(exercise.pairs, exercise.id);
  }, [exercise.pairs, exercise.id]);

  const leftItems = exercise.pairs;

  // Set of rightIds that are currently paired
  const pairedRightToLeft = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [leftId, rightId] of Object.entries(userPairs)) {
      map[rightId] = leftId;
    }
    return map;
  }, [userPairs]);

  const handleLeftClick = (leftId: string) => {
    if (isSubmitted) return;

    // If already paired, unpair it
    if (userPairs[leftId]) {
      const next = { ...userPairs };
      delete next[leftId];
      onPairsChange(next);
      setSelectedLeftId(null);
      return;
    }

    // If right item is already selected, connect them
    if (selectedRightId) {
      // If that right item was paired elsewhere, remove old pair
      const next = { ...userPairs };
      for (const [lId, rId] of Object.entries(next)) {
        if (rId === selectedRightId) {
          delete next[lId];
        }
      }
      next[leftId] = selectedRightId;
      onPairsChange(next);
      setSelectedLeftId(null);
      setSelectedRightId(null);
      return;
    }

    // Otherwise toggle selection
    setSelectedLeftId(selectedLeftId === leftId ? null : leftId);
  };

  const handleRightClick = (rightId: string) => {
    if (isSubmitted) return;

    // If already paired, unpair it
    if (pairedRightToLeft[rightId]) {
      const leftId = pairedRightToLeft[rightId];
      const next = { ...userPairs };
      delete next[leftId];
      onPairsChange(next);
      setSelectedRightId(null);
      return;
    }

    // If left item is already selected, connect them
    if (selectedLeftId) {
      const next = { ...userPairs };
      next[selectedLeftId] = rightId;
      onPairsChange(next);
      setSelectedLeftId(null);
      setSelectedRightId(null);
      return;
    }

    // Otherwise toggle selection
    setSelectedRightId(selectedRightId === rightId ? null : rightId);
  };

  return (
    <div className="exercise-layout">
      <div className="exercise-prompt-area">
        <h3 className="exercise-prompt-text">{exercise.prompt}</h3>
        <p className="matching-instruction">
          Chọn một từ bên trái, sau đó chọn từ tương ứng bên phải để ghép cặp.
        </p>
      </div>

      <div className="matching-columns-grid">
        {/* Left Column */}
        <div className="matching-column" aria-label="Cột bên trái">
          {leftItems.map((item) => {
            const isPaired = Boolean(userPairs[item.id]);
            const isSelected = selectedLeftId === item.id;
            const pairedRightId = userPairs[item.id];
            const isPairCorrect = isSubmitted && pairedRightId === item.id;
            const isPairWrong = isSubmitted && isPaired && !isPairCorrect;

            let buttonClass = "";
            if (isSubmitted) {
              buttonClass = isPairCorrect ? "matching-correct" : isPairWrong ? "matching-wrong" : "";
            } else if (isSelected) {
              buttonClass = "matching-selected";
            } else if (isPaired) {
              buttonClass = "matching-paired";
            }

            return (
              <button
                key={`left-${item.id}`}
                type="button"
                disabled={isSubmitted}
                onClick={() => handleLeftClick(item.id)}
                className={`matching-card ${buttonClass}`}
                aria-pressed={isSelected || isPaired}
              >
                <span className="matching-card-text">{item.left}</span>
                {isPaired && !isSubmitted && (
                  <span className="matching-pair-indicator" aria-label="Đã ghép">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="matching-column" aria-label="Cột bên phải">
          {rightItems.map((item) => {
            const isPaired = Boolean(pairedRightToLeft[item.id]);
            const isSelected = selectedRightId === item.id;
            const pairedLeftId = pairedRightToLeft[item.id];
            const isPairCorrect = isSubmitted && pairedLeftId === item.id;
            const isPairWrong = isSubmitted && isPaired && !isPairCorrect;

            let buttonClass = "";
            if (isSubmitted) {
              buttonClass = isPairCorrect ? "matching-correct" : isPairWrong ? "matching-wrong" : "";
            } else if (isSelected) {
              buttonClass = "matching-selected";
            } else if (isPaired) {
              buttonClass = "matching-paired";
            }

            return (
              <button
                key={`right-${item.id}`}
                type="button"
                disabled={isSubmitted}
                onClick={() => handleRightClick(item.id)}
                className={`matching-card ${buttonClass}`}
                aria-pressed={isSelected || isPaired}
              >
                <span className="matching-card-text">{item.right}</span>
                {isPaired && !isSubmitted && (
                  <span className="matching-pair-indicator" aria-label="Đã ghép">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

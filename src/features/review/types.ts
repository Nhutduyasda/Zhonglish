import type { Exercise } from "@/features/lesson/types";

export type ReviewStateRow = {
  id: string;
  language: "english" | "chinese";
  source_lesson_id: string;
  source_exercise_id: string;
  vocabulary_id: string | null;
  strength: number;
  repetitions: number;
  mistake_count: number;
  next_review_at: string;
  created_at: string;
};

export type ReviewSessionItem = {
  reviewId: string;
  lessonId: string;
  lessonTitle: string;
  exercise: Exercise;
  strength: number;
  mistakeCount: number;
};

export type ReviewAnswerResult = {
  ok: true;
  isCorrect: boolean;
  correctAnswerDisplay: string;
  explanation: string;
  previousStrength: number;
  newStrength: number;
  nextReviewAt: string;
};

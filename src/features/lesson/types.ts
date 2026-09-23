import type { LearningLanguage } from "@/data/curriculum";

export type ExerciseType =
  | "multiple_choice"
  | "matching"
  | "listening"
  | "text_input";

export type BaseExercise = {
  id: string;
  type: ExerciseType;
  prompt: string;
  explanation: string;
};

export type MultipleChoiceExercise = BaseExercise & {
  type: "multiple_choice";
  options: string[];
  correctAnswer: string;
};

export type MatchingPair = {
  id: string;
  left: string;
  right: string;
};

export type MatchingExercise = BaseExercise & {
  type: "matching";
  pairs: MatchingPair[];
};

export type ListeningExercise = BaseExercise & {
  type: "listening";
  speechText: string;
  speechLang: "en-US" | "zh-CN";
  options: string[];
  correctAnswer: string;
  fallbackTextAlternative?: string;
};

export type TextInputExercise = BaseExercise & {
  type: "text_input";
  placeholder?: string;
  acceptedAnswers: string[];
  displayAnswer: string;
};

export type Exercise =
  | MultipleChoiceExercise
  | MatchingExercise
  | ListeningExercise
  | TextInputExercise;

export type Lesson = {
  id: string;
  language: LearningLanguage;
  stageId: string;
  title: string;
  description: string;
  topicsPracticed: string[];
  exercises: Exercise[];
};

export type EvaluationResult = {
  isCorrect: boolean;
  correctAnswerDisplay: string;
  explanation: string;
};

export type UserAnswerHistoryItem = {
  exerciseId: string;
  isCorrect: boolean;
  summary: string;
};

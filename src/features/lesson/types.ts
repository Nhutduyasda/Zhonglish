import type { LearningLanguage } from "@/data/curriculum";

export type ChineseTerm = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  speechText: string;
};

export type ExerciseType =
  | "multiple_choice"
  | "matching"
  | "listening"
  | "text_input"
  | "hanzi_choice"
  | "pinyin_choice";

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

export type HanziChoiceExercise = BaseExercise & {
  type: "hanzi_choice";
  meaning: string;
  pinyin?: string;
  options: string[];
  correctAnswer: string;
  term?: ChineseTerm;
};

export type PinyinChoiceExercise = BaseExercise & {
  type: "pinyin_choice";
  hanzi: string;
  meaning?: string;
  options: string[];
  correctAnswer: string;
  term?: ChineseTerm;
};

export type Exercise =
  | MultipleChoiceExercise
  | MatchingExercise
  | ListeningExercise
  | TextInputExercise
  | HanziChoiceExercise
  | PinyinChoiceExercise;

export type Lesson = {
  id: string;
  language: LearningLanguage;
  stageId: string;
  order: number;
  estimatedMinutes: number;
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
  answer?: unknown;
};

export type ExerciseSubmission = {
  exerciseId: string;
  answer: unknown;
};

export type LessonCompletionResult = {
  ok: boolean;
  isFirstCompletion: boolean;
  xpAwarded: number;
  learningMinutes: number;
  dailyGoalMinutesAdded: number;
  newAchievements: import("@/data/achievements").AchievementId[];
  accuracy: number;
  correctCount: number;
  totalExercises: number;
  mistakesQueued: number;
};

import type {
  EvaluationResult,
  Exercise,
  ListeningExercise,
  MatchingExercise,
  MultipleChoiceExercise,
  TextInputExercise,
} from "./types";

/**
 * Normalizes text input for safe deterministic evaluation.
 * - Trims leading and trailing whitespace
 * - Collapses consecutive whitespace to a single space
 * - Converts to lower case
 * - Preserves Unicode characters (including Vietnamese & Chinese Hanzi)
 */
export function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

export function evaluateMultipleChoice(
  exercise: MultipleChoiceExercise,
  selectedAnswer: string,
): EvaluationResult {
  const isCorrect = selectedAnswer === exercise.correctAnswer;
  return {
    isCorrect,
    correctAnswerDisplay: exercise.correctAnswer,
    explanation: exercise.explanation,
  };
}

export function evaluateTextInput(
  exercise: TextInputExercise,
  userInput: string,
): EvaluationResult {
  const normalizedUser = normalizeText(userInput);
  const isCorrect = exercise.acceptedAnswers.some(
    (ans) => normalizeText(ans) === normalizedUser,
  );

  return {
    isCorrect,
    correctAnswerDisplay: exercise.displayAnswer,
    explanation: exercise.explanation,
  };
}

export function evaluateMatching(
  exercise: MatchingExercise,
  userPairs: Record<string, string>, // leftId -> rightId
): EvaluationResult {
  // Every pair must be matched, and userPairs[pair.id] must equal pair.id
  const totalPairs = exercise.pairs.length;
  const matchedKeys = Object.keys(userPairs);

  let correctCount = 0;
  for (const pair of exercise.pairs) {
    if (userPairs[pair.id] === pair.id) {
      correctCount += 1;
    }
  }

  const isCorrect = totalPairs > 0 && correctCount === totalPairs && matchedKeys.length === totalPairs;

  const pairsDisplay = exercise.pairs
    .map((p) => `${p.left} = ${p.right}`)
    .join(" · ");

  return {
    isCorrect,
    correctAnswerDisplay: pairsDisplay,
    explanation: exercise.explanation,
  };
}

export function evaluateListening(
  exercise: ListeningExercise,
  selectedAnswer: string,
): EvaluationResult {
  const isCorrect = selectedAnswer === exercise.correctAnswer;
  return {
    isCorrect,
    correctAnswerDisplay: exercise.correctAnswer,
    explanation: exercise.explanation,
  };
}

export function evaluateExercise(
  exercise: Exercise,
  userSubmission: unknown,
): EvaluationResult {
  switch (exercise.type) {
    case "multiple_choice":
      return evaluateMultipleChoice(
        exercise,
        typeof userSubmission === "string" ? userSubmission : "",
      );
    case "text_input":
      return evaluateTextInput(
        exercise,
        typeof userSubmission === "string" ? userSubmission : "",
      );
    case "matching":
      return evaluateMatching(
        exercise,
        userSubmission && typeof userSubmission === "object"
          ? (userSubmission as Record<string, string>)
          : {},
      );
    case "listening":
      return evaluateListening(
        exercise,
        typeof userSubmission === "string" ? userSubmission : "",
      );
    default: {
      return {
        isCorrect: false,
        correctAnswerDisplay: "Không xác định",
        explanation: "Dạng bài tập chưa được hỗ trợ.",
      };
    }
  }
}

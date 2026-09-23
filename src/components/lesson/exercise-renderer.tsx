import type { Exercise } from "@/features/lesson/types";
import { MultipleChoice } from "./exercises/multiple-choice";
import { TextInput } from "./exercises/text-input";
import { Matching } from "./exercises/matching";
import { Listening } from "./exercises/listening";
import { HanziChoice } from "./exercises/hanzi-choice";
import { PinyinChoice } from "./exercises/pinyin-choice";

type ExerciseRendererProps = {
  exercise: Exercise;
  userAnswer: unknown;
  isSubmitted: boolean;
  isCorrect?: boolean;
  onAnswerChange: (answer: unknown) => void;
  onSubmit: () => void;
};

export function ExerciseRenderer({
  exercise,
  userAnswer,
  isSubmitted,
  isCorrect,
  onAnswerChange,
  onSubmit,
}: ExerciseRendererProps) {
  switch (exercise.type) {
    case "multiple_choice":
      return (
        <MultipleChoice
          exercise={exercise}
          selectedAnswer={typeof userAnswer === "string" ? userAnswer : ""}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          onSelect={(val) => onAnswerChange(val)}
        />
      );

    case "text_input":
      return (
        <TextInput
          exercise={exercise}
          userInput={typeof userAnswer === "string" ? userAnswer : ""}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          onChange={(val) => onAnswerChange(val)}
          onSubmit={onSubmit}
        />
      );

    case "matching":
      return (
        <Matching
          exercise={exercise}
          userPairs={
            userAnswer && typeof userAnswer === "object"
              ? (userAnswer as Record<string, string>)
              : {}
          }
          isSubmitted={isSubmitted}
          onPairsChange={(pairs) => onAnswerChange(pairs)}
        />
      );

    case "listening":
      return (
        <Listening
          exercise={exercise}
          selectedAnswer={typeof userAnswer === "string" ? userAnswer : ""}
          isSubmitted={isSubmitted}
          onSelect={(val) => onAnswerChange(val)}
        />
      );

    case "hanzi_choice":
      return (
        <HanziChoice
          exercise={exercise}
          selectedAnswer={typeof userAnswer === "string" ? userAnswer : ""}
          isSubmitted={isSubmitted}
          onSelect={(val) => onAnswerChange(val)}
        />
      );

    case "pinyin_choice":
      return (
        <PinyinChoice
          exercise={exercise}
          selectedAnswer={typeof userAnswer === "string" ? userAnswer : ""}
          isSubmitted={isSubmitted}
          onSelect={(val) => onAnswerChange(val)}
        />
      );

    default:
      return (
        <div className="exercise-unsupported">
          <p>Dạng bài tập này chưa được hỗ trợ.</p>
        </div>
      );
  }
}

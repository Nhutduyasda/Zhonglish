"use client";

import type { ChineseTerm } from "@/features/lesson/types";
import { SpeechButton } from "./speech-button";

type ChineseTermCardProps = {
  term: ChineseTerm;
  compact?: boolean;
  className?: string;
};

export function ChineseTermCard({
  term,
  compact = false,
  className = "",
}: ChineseTermCardProps) {
  return (
    <div
      className={`chinese-term-card ${compact ? "chinese-term-card-compact" : ""} ${className}`}
      role="region"
      aria-label={`Từ vựng: ${term.hanzi}, phiên âm ${term.pinyin}, nghĩa ${term.meaning}`}
    >
      {/* 1. Large Hanzi */}
      <div className="chinese-term-hanzi chinese-hanzi" lang="zh-CN">
        {term.hanzi}
      </div>

      {/* 2. Pinyin with Tone Marks */}
      <div className="chinese-term-pinyin">{term.pinyin}</div>

      {/* 3. Vietnamese Meaning */}
      <div className="chinese-term-meaning">{term.meaning}</div>

      {/* 4. Speech Audio Action */}
      <div className="chinese-term-audio">
        <SpeechButton
          text={term.speechText || term.hanzi}
          lang="zh-CN"
          label={`Nghe phát âm ${term.hanzi}, ${term.pinyin}`}
          variant="pill"
        />
      </div>
    </div>
  );
}

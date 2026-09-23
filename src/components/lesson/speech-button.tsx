"use client";

import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";

type SpeechButtonProps = {
  text: string;
  lang?: string;
  rate?: number;
  label?: string;
  variant?: "pill" | "icon" | "card";
  className?: string;
};

export function SpeechButton({
  text,
  lang = "zh-CN",
  rate = 0.8,
  label,
  variant = "pill",
  className = "",
}: SpeechButtonProps) {
  const { speak, isPlaying, hasPlayedOnce, isSupported } = useSpeech({
    text,
    lang,
    rate,
  });

  const accessibleLabel =
    label || `Nghe phát âm ${text} (${hasPlayedOnce ? "Nghe lại" : "Nghe"})`;

  if (!isSupported) {
    return (
      <span
        className="speech-unsupported-hint"
        title="Trình duyệt không hỗ trợ phát âm tự động"
        aria-label="Trình duyệt không hỗ trợ phát âm tự động"
      >
        <VolumeX size={16} aria-hidden="true" />
      </span>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={speak}
        className={`speech-icon-btn ${isPlaying ? "playing" : ""} ${className}`}
        aria-label={accessibleLabel}
        title={accessibleLabel}
      >
        {isPlaying ? (
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        ) : (
          <Volume2 size={18} aria-hidden="true" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={speak}
      className={`speech-pill-btn ${isPlaying ? "playing" : ""} ${className}`}
      aria-label={accessibleLabel}
    >
      <Volume2 size={18} aria-hidden="true" />
      <span>{isPlaying ? "Đang phát..." : hasPlayedOnce ? "Nghe lại" : "Nghe phát âm"}</span>
    </button>
  );
}

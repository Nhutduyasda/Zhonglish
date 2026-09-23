"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type UseSpeechOptions = {
  text: string;
  lang?: string;
  rate?: number;
};

export function useSpeech({ text, lang = "zh-CN", rate = 0.8 }: UseSpeechOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof window === "undefined") return true;
    return "speechSynthesis" in window;
  });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cleanup on unmount or when text changes
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any existing audio

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;

      // Try selecting preferred voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice =
          voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ||
          voices.find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setHasPlayedOnce(true);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setHasPlayedOnce(true);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSupported(false);
    }
  }, [text, lang, rate]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    hasPlayedOnce,
    isSupported,
  };
}

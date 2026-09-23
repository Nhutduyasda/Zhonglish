# Phase 5 — Chinese Foundation

## 1. Objective

Phase 5 transforms Chinese learning in Zhonglish from generic lessons into a dedicated, first-class learning foundation while continuing to leverage the shared **Lesson Engine** and **Progress Persistence** foundation from Phase 4 & Phase 4.1.

Architecture flow:
$$\text{Chinese Content (Typed Terms)} \longrightarrow \text{Chinese Exercises (hanzi\_choice, pinyin\_choice)} \longrightarrow \text{Lesson Engine} \longrightarrow \text{Shared Server Evaluation} \longrightarrow \text{Database Persistence} \longrightarrow \text{Dashboard}$$

---

## 2. Chinese Term Data Model

A typed, centralized data model was established in `src/features/lesson/types.ts`:

```typescript
export type ChineseTerm = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  speechText: string;
};
```

Starter vocabulary repository is defined in `src/data/chinese-vocabulary.ts` with 23 foundational terms (`你好`, `谢谢`, `再见`, `我`, `你`, `他`, `她`, `叫`, `家`, `爸爸`, `妈妈`, `吃`, `喝`, `水`, `饭`, `是`, `不是`, etc.).

---

## 3. Hanzi Presentation (`ChineseTermCard`)

The `ChineseTermCard` component (`src/components/lesson/chinese-term-card.tsx`) delivers clear visual hierarchy for beginners:
1. **Hanzi**: Largest visual prominence (`clamp(40px, 7vw, 56px)`), styled with `font-family: var(--font-chinese)` (Noto Sans SC).
2. **Pinyin**: Second prominence, preserving accurate tone marks (`nǐ hǎo`, `xiè xie`).
3. **Meaning**: Vietnamese definition in clear, readable text.
4. **Audio**: Actionable `SpeechButton` offering on-demand pronunciation.

---

## 4. Pinyin & Audio Foundation

### Pinyin Rules
- Tone marks are preserved on all user-facing displays (`ā á ǎ à`, `ē é ě è`, `ī í ǐ ì`, `ō ó ǒ ò`, `ū ú ǔ ù`, `ǖ ǘ ǚ ǜ`).
- User input for pinyin exercises accepts both accented and tone-less inputs (e.g. `["shui", "shuǐ"]`) without destructive normalization.

### Audio Implementation (`useSpeech` & `SpeechButton`)
- Extracted into a reusable hook `src/hooks/use-speech.ts` and component `src/components/lesson/speech-button.tsx`.
- Reused across `ChineseTermCard`, `HanziChoice`, `PinyinChoice`, and `Listening`.
- Speed rate: `0.8` (steady and clear for beginners).
- Audio behavior:
  - Only plays upon explicit user interaction (no autoplay).
  - Cancels any running utterance before starting a new one.
  - Automatically selects `zh-CN` voice when available on the user's system.
  - Cleans up (`cancel()`) upon component unmount.
  - Graceful fallback when Web Speech API is unsupported.

---

## 5. Chinese-Specific Exercise Types

Extended `ExerciseType` union with 2 new primitives:

1. **`hanzi_choice`** (`HanziChoiceExercise`):
   - Presents target Pinyin + Vietnamese meaning (and optional audio clue).
   - Learner identifies and selects the correct Hanzi from a 2x2 grid.
   - High-contrast, large Hanzi touch buttons.
2. **`pinyin_choice`** (`PinyinChoiceExercise`):
   - Presents the target Hanzi prominently with audio pronunciation.
   - Learner selects the matching Pinyin with correct tone marks.

---

## 6. Lesson Engine Integration & Server Evaluation

- **Client**: `ExerciseRenderer` routes `hanzi_choice` and `pinyin_choice` to their dedicated renderer components. `LessonPlayer.isAnswerValid()` validates selections without duplicate logic.
- **Server Parity**: `src/features/lesson/evaluation.ts` implements `evaluateHanziChoice()` and `evaluatePinyinChoice()`. `POST /api/lessons/complete` re-evaluates submissions on the server using the exact same logic, eliminating any risk of score drift.

---

## 7. Stage 3 Chinese Lesson (`chinese-daily-1`)

Added `chinese-daily-1` to `src/data/lessons.ts`:
- **Stage**: `daily` ("Cuộc sống thường ngày")
- **Order**: `3`
- **Estimated minutes**: `5`
- **Objective**: "Gia đình và sinh hoạt" (`家`, `爸爸`, `妈妈`, `吃`, `喝`, `水`)
- **Exercises**: 7 exercises mixing `hanzi_choice`, `pinyin_choice`, `listening`, `matching`, and `text_input`.
- **Existing Lessons Safety**: `chinese-survival-1` (Stage 1) and `chinese-me-1` (Stage 2) remain untouched to avoid re-locking progress for existing users.

---

## 8. Persistence & Progression Integration

- Reuses `public.lesson_progress`, `public.learning_activity`, and `public.record_lesson_completion`.
- XP: **+10 XP** on first completion, **+0 XP** on replay.
- Daily minutes: **+5 minutes**.
- Stage unlock: Completing `chinese-survival-1` and `chinese-me-1` transitions Stage 3 (`daily`) from `upcoming` to `ready`, with `chinese-daily-1` automatically targeted in the Dashboard Continue Learning card.

---

## 9. Accessibility & Responsive Verification

- **Accessibility**:
  - Semantic `<button type="button">` with `aria-checked` in `radiogroup`.
  - Accessible labels for Hanzi buttons including character text.
  - High visible focus outlines (`focus-visible`).
  - Audio buttons have explicit `aria-label`.
- **Responsive**:
  - Tested at 375px, 768px, and 1440px with no horizontal overflow.
  - Hanzi button sizes adapt responsively (`clamp(34px, 5.5vw, 46px)` on desktop, `32px` on mobile).

---

## 10. Deferred Features

Intentionally deferred to later phases according to roadmap:
- Handwriting recognition / stroke-order engine (Phase 7+).
- Speech recognition / pronunciation grading via microphone.
- Spaced repetition scheduling (`next_review_at`, SM-2 algorithm).
- Advanced gamification & achievements (Phase 6).

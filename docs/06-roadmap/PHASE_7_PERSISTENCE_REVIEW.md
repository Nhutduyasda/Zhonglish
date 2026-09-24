# Phase 7 — Persistence + Mistake Review

## Outcome

Phase 7 closes the review loop without creating a parallel lesson system:

`Lesson → canonical server evaluation → atomic mistake persistence → Dashboard due queue → shared exercise engine → trusted review evaluation → deterministic scheduling`

## Data and consistency

Migration `20260924020000_phase_7_review_state.sql` adds `review_state`, `review_activity`, and `lesson_completion_requests`. A review item is unique per user, lesson, and exercise. Authenticated users can select only their own review state; all mutations use service-role-only RPCs behind authenticated Next.js APIs.

Lesson completion and mistake upserts share one transaction in `record_trusted_lesson_completion`. A failure rolls back both rather than reporting partial success. Completion and review RPCs use a user/request advisory lock plus unique request ledgers, so retries return the original result without double increments.

## Scheduling policy

- First/new mistake: strength 0 and due immediately.
- Incorrect review: strength decreases toward 0 and is due on the next `Asia/Ho_Chi_Minh` calendar day.
- Correct review: strength increases to a maximum of 3; new strengths 1, 2, and 3 schedule +3, +7, and +14 calendar days.
- Lesson replay correctness does not delete or silently advance an existing review item. Only the explicit review flow advances review strength.

## Product behavior

- Dashboard fetches an aggregate due count, not the full queue.
- `/app/review` uses the same `ExerciseRenderer`, `ExerciseFeedback`, audio, matching, English, Hanzi, and Pinyin primitives.
- Sessions contain 5 due items by default and support at most 10, ordered by due time, mistake count, then creation time.
- Each answer persists immediately. Empty, loading, fetch error, submit error/retry, completed, and stale-content states are handled.
- Missing/renamed canonical content is skipped and deactivated rather than crashing a session.

## Explicit non-effects

Review awards 0 XP and does not modify lesson minutes, streak, achievements, or stage progression. Advanced SRS/FSRS, AI scheduling, speech scoring, handwriting, and review XP remain deferred.

## Acceptance limits

Code-level owner filters, RLS, and forged-ID behavior are implemented. A real two-independent-account browser isolation test, remote migration history verification, and hosted Supabase Advisor checks require target-project access and remain deferred until that environment is available.

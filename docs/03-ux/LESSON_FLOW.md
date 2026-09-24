# Lesson Flow

## State machine

```text
loading
→ active exercise
→ submitted
→ correct / incorrect feedback
→ next
→ ...
→ completed
→ result
```

## Correct answer

- positive feedback;
- concise explanation if useful;
- continue button.

## Incorrect answer

- never shame;
- show correct answer;
- explain only the key point;
- queue mistake for later review.

## Phase 7 persistence boundary

The browser submits answers, never correctness or scheduling fields. On completion the server resolves the canonical lesson, re-evaluates every exercise, then records lesson progress and incorrect exercise review state in one database transaction. The result screen only reports queued mistakes after that transaction succeeds.

Review uses the same exercise renderer and evaluation rules. A correct review strengthens the item and schedules it for 3, 7, or 14 days according to the new strength; an incorrect review schedules the next Vietnam calendar day. Review grants no XP, minutes, streak, achievement, or stage progress.

## Progress

Visible at the top.
Do not display overly precise complex metrics during lesson.

## Exit

If user exits an unfinished lesson:
- show small confirmation only when progress would be lost;
- ideally persist attempt.

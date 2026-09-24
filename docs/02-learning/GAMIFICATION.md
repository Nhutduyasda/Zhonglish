# Gamification

## Goal

Gamification supports learning consistency.
It must not become the product itself.

## MVP mechanics

### XP
Earned from:
- lesson completion;
- daily challenge.

Current implementation:
- lesson completion awards 10 XP once and 0 XP on replay;
- Phase 7 review awards 0 XP and does not write lesson activity;
- review XP is deferred until a capped, idempotent anti-farming rule is defined.

### Streak
Increment when daily learning goal is satisfied.

### Daily goal
Simple:
- 5 min;
- 10 min;
- 15 min.

### Achievement
Examples:
- First Lesson
- 3 Day Streak
- 100 XP
- Perfect Lesson

### Leaderboard
Optional participation.
Avoid making beginners feel punished for learning slowly.

## Reward feedback

On completion:
- XP animation;
- short success motion;
- optional subtle confetti;
- progress update.

Never block next action behind a long animation.

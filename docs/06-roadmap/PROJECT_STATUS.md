# Zhonglish Project Status

Current Phase: **Phase 4.1 — Learning Progress Foundation (Code & Migration Complete)**

## Completed

- Repository created and documentation initialized.
- Product, design and architecture direction documented.
- Phase 0 — Foundation: Next.js application, UI tokens, typography, accessibility baseline and production build.
- Phase 1 landing deployed at https://zhonglish.vercel.app and accepted as completed by the project owner. Desktop production interactions and page overflow were checked.
- Phase 2 code and build implemented. The `profiles` migrations have been applied to the Zhonglish Supabase project; RLS, policies and table grants were verified.
- Phase 3 — Learning Dashboard: `/app` route fully replaced with Learning Dashboard. Connected to Supabase `profiles` (`learning_language`, `learning_goal`, `daily_goal_minutes`), dynamic curriculum preview for English and Chinese, authentic 0-stat baseline (0 XP, 0 Streak, 0/N min daily goal), accessible hero Continue Learning CTA card with Phase 4 preparation, responsive for 375px/768px/1440px without overflow, lint/typecheck/build passed.
- Phase 4 — Lesson Engine: `/app/lesson/[lessonId]` server-guarded route; pure deterministic evaluation; typed exercise primitives (Multiple Choice, Text Input, Matching, Listening via Web Speech API); encouragement feedback without shaming; session result screen with accuracy % and restart; starter lessons `english-survival-1` and `chinese-survival-1`; direct connection to Dashboard Continue Learning CTA; responsive 375px/768px/1440px; lint/typecheck/build passed.
- Phase 4.1 — Learning Progress Foundation: Closed the learning loop between Dashboard, Lesson Player, Completion API, and Database Persistence (`lesson_progress`, `learning_activity`). Added navigation from Dashboard back to Landing Page (`/`); implemented atomic RPC completion recording (+10 XP first time, +0 XP replay); dynamic Dashboard stats (today's minutes, streak, XP); Stage 2 unlocking & lessons (`english-me-1`, `chinese-me-1`); pure immutable stage progression rendering; lint/typecheck/build passed.

## Next

- Apply `supabase/migrations/0003_learning_progress.sql` to remote Supabase DB (if not already applied).
- Phase 5 — Chinese Foundation: Hanzi characters, Pinyin support, pronunciation foundation, Chinese-specific exercises.

## Not Started

- Phase 5 — Chinese Foundation
- Phase 6 — Gamification
- Phase 7 — Persistence + Review
- Phase 8 — Polish

Update this file after every phase.

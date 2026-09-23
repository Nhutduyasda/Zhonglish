# Zhonglish Project Status

Current Phase: **Phase 3 — Learning Dashboard (Completed)**

## Completed

- Repository created and documentation initialized.
- Product, design and architecture direction documented.
- Phase 0 — Foundation: Next.js application, UI tokens, typography, accessibility baseline and production build.
- Phase 1 landing deployed at https://zhonglish.vercel.app and accepted as completed by the project owner. Desktop production interactions and page overflow were checked.
- Phase 2 code and build implemented. The `profiles` migrations have been applied to the Zhonglish Supabase project; RLS, policies and table grants were verified.
- Phase 3 — Learning Dashboard: `/app` route fully replaced with Learning Dashboard. Connected to Supabase `profiles` (`learning_language`, `learning_goal`, `daily_goal_minutes`), dynamic curriculum preview for English and Chinese, authentic 0-stat baseline (0 XP, 0 Streak, 0/N min daily goal), accessible hero Continue Learning CTA card with Phase 4 preparation, responsive for 375px/768px/1440px without overflow, lint/typecheck/build passed.

## Next

- Phase 4 — Lesson Engine: exercise renderer, multiple choice, matching, listening, text input, instant feedback, result screen.

## Not Started

- Phase 4 — Lesson Engine
- Phase 5 — Chinese Foundation
- Phase 6 — Gamification
- Phase 7 — Persistence + Review
- Phase 8 — Polish

Update this file after every phase.

# Zhonglish Project Status

Current Phase: **Phase 7 — Persistence + Review (Code complete; final production multi-account acceptance deferred)**

## Completed

- Repository created and documentation initialized.
- Product, design and architecture direction documented.
- Phase 0 — Foundation: Next.js application, UI tokens, typography, accessibility baseline and production build.
- Phase 1 landing deployed at https://zhonglish.vercel.app and accepted as completed by the project owner. Desktop production interactions and page overflow were checked.
- Phase 2 code and build implemented. The `profiles` migrations have been applied to the Zhonglish Supabase project; RLS, policies and table grants were verified.
- Phase 3 — Learning Dashboard: `/app` route fully replaced with Learning Dashboard. Connected to Supabase `profiles` (`learning_language`, `learning_goal`, `daily_goal_minutes`), dynamic curriculum preview for English and Chinese, authentic 0-stat baseline (0 XP, 0 Streak, 0/N min daily goal), accessible hero Continue Learning CTA card with Phase 4 preparation, responsive for 375px/768px/1440px without overflow, lint/typecheck/build passed.
- Phase 4 — Lesson Engine: `/app/lesson/[lessonId]` server-guarded route; pure deterministic evaluation; typed exercise primitives (Multiple Choice, Text Input, Matching, Listening via Web Speech API); encouragement feedback without shaming; session result screen with accuracy % and restart; starter lessons `english-survival-1` and `chinese-survival-1`; direct connection to Dashboard Continue Learning CTA; responsive 375px/768px/1440px; lint/typecheck/build passed.
- Phase 4.1 — Learning Progress Foundation: Closed the learning loop between Dashboard, Lesson Player, Completion API, and Database Persistence (`lesson_progress`, `learning_activity`). Added navigation from Dashboard back to Landing Page (`/`); implemented atomic RPC completion recording (+10 XP first time, +0 XP replay); dynamic Dashboard stats (today's minutes, streak, XP); Stage 2 unlocking & lessons (`english-me-1`, `chinese-me-1`); pure immutable stage progression rendering; lint/typecheck/build passed.
- Phase 5 — Chinese Foundation: First-class Chinese learning foundation reusing Lesson Engine; typed ChineseTerm model and vocabulary repository (`src/data/chinese-vocabulary.ts`); reusable Web Speech audio primitive (`useSpeech`, `SpeechButton`) at beginner rate 0.8; `ChineseTermCard` presentation hierarchy (Hanzi > Pinyin > Meaning > Audio); new Chinese exercise types `hanzi_choice` and `pinyin_choice` with full server evaluation parity; Stage 3 lesson `chinese-daily-1` ("Gia đình và sinh hoạt"); English regression verified; lint/typecheck/build passed.
- Phase 6 — Gamification: XP, Vietnam-time streak, daily-credit rules and derived achievements implemented; production verification remains deferred to the owner.
- Phase 7 — Persistence + Review: server-verified mistakes, private idempotent review state, real Dashboard due count, shared exercise-engine review session, deterministic Vietnam-time scheduling, stale-content safety, empty/error/loading/result states, and zero review XP.

## Next

- Phase 7 release gate was audited on 2026-09-24 before implementation: the signed-in production Dashboard rendered 30 XP, a two-day streak and the first two earned achievements. Supabase reported six applied migrations, RLS on all three existing public tables, a clean Performance Advisor and the known leaked-password warning. The new Phase 7 migration still needs deployment and verification.
- Finish [Phase 5.1 production hardening](PHASE_5_1_PRODUCTION_HARDENING.md): deploy and verify server-side stage guard; test two independent authenticated sessions, forged/denied writes and concurrent completion/retry on a disposable test lesson/account. A previous Chinese production completion and replay were confirmed by the owner; direct RPC access is revoked and read isolation was checked with simulated SQL roles.
- Owner to verify [Phase 6 — Gamification](PHASE_6_GAMIFICATION.md) on the website: sign-in, lesson rewards, same-day replay, retry, streak, responsive and loading/error states. Leaderboard is deferred for privacy and identity design; do not start Phase 7 before deciding how to close the remaining checks.
- Apply and verify the Phase 7 review-state migration on the target Supabase project.
- Complete production two-account isolation E2E and Supabase Security/Performance Advisor checks.
- Phase 8 — Polish.

## Not Started

- Phase 8 — Polish

Update this file after every phase.

# Phase 6 — Gamification

Status: **Implementation in progress; production end-to-end acceptance pending.** The owner explicitly requested continuing Phase 6 on 2026-09-24 after being told that Phase 5.1 negative and concurrency tests remain outstanding. Those limitations remain open and are not reclassified as passed.

## Evidence so far

- Supabase migration `20260924012202` is applied. Catalog inspection confirms `get_learning_summary()` is `SECURITY INVOKER`, executable by `authenticated` and denied to `anon`. Security Advisor reports only disabled leaked-password protection; Performance Advisor has no notices.
- Read-only database-role simulations for two existing accounts returned respectively 30 XP / two achieved badges and 0 XP / no badges. Neither simulation writes activities or exercises two signed browser sessions.
- Local lint, typecheck and production build pass. The new application screens and new completion response have **not** yet been deployed or exercised end to end in production.

## Rules

- The existing trusted completion transaction grants **10 XP on a user's first completion of a lesson** and **0 XP on replay**. Achievements grant no additional XP.
- One lesson contributes its canonical learning minutes to the daily goal **at most once per user per Vietnam calendar day** (`Asia/Ho_Chi_Minh`, UTC+7). Additional retries and replays of that lesson that day contribute zero minutes. A replay on a later day can count once toward that day's practice goal, with zero XP.
- A streak day requires at least one credited lesson. The current streak includes today if practiced; otherwise it retains the streak through yesterday. Longest streak is the maximum consecutive run across the user's history. The calendar day boundary is Vietnam time.
- Three derived achievements: first distinct lesson; three distinct lessons; three consecutive practice days at any time. They persist conceptually because they are derived from history; there are no writable badge rows and no extra XP. Changing an onboarding goal does not affect streak history.
- The SQL summary function is `SECURITY INVOKER`, uses `auth.uid()` and owner-row RLS, and exposes no user ID or minutes arguments. It aggregates all owner activity in Postgres, avoiding the Data API's row pagination limit.

## Release order and acceptance

1. Migration `20260924012202_phase_6_learning_summary.sql` was applied to production; the filename was reconciled with remote migration history. Check authenticated execute grants and both Advisors.
2. Deploy application code. Verify a fresh account's sign-in → dashboard → first completion → XP, achievement and daily goal → reload → sign-out/in. Verify replay yields zero XP and zero additional minutes on the same day; retry the same UUID and race two first completions on a disposable account. Verify a later-day streak and three-day badge without changing production clocks or resetting data.
3. Check 375px, 768px and 1440px, keyboard focus, loading/error and both languages. Do not report the phase complete until these are exercised in production.

Leaderboard MVP is **deferred**: profiles do not have a display name, opt-in consent or a public ranking/visibility model. Exposing user email or learning history by default would violate expected privacy. Decide identity and consent rules before implementing it.

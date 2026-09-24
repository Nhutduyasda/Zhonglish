# Phase 5.1 — Production hardening

Status: **PARTIAL — one production lesson and replay confirmed by the owner; negative security and concurrency E2E still unverified.** Phase 6 has not started.

## Follow-up audit on 2026-09-24 — gate remains open

**Verified on production:** Vercel's latest Ready production deployment points at `main` commit `e14c496`. All five repository migration versions appear in Supabase's migration history. Catalog checks show RLS enabled on both learning tables, own-row SELECT policies, and `authenticated` with SELECT but no INSERT/UPDATE/DELETE. Neither completion RPC is executable by `authenticated` or `anon`; the trusted RPC is executable by `service_role`. The trusted function contains a per-user-and-lesson advisory transaction lock and request-ID retry lookup; the two unique indexes cover `(user_id, lesson_id)` and `(user_id, request_id)`. A read-only SQL transaction assuming `authenticated` with each of two existing account IDs showed the account with three progress/activity rows could read its own three rows, while the second account saw zero rows and neither saw another account's rows. This is a **database-role simulation**, not two independent browser sessions with signed JWTs. There were no rows awarding more than 10 XP to a user for one lesson at audit time.

**Production user observation:** The project owner reports the first completion of “Gia đình và sinh hoạt” awarded 10 XP and five minutes, persisted after reload, and a replay did not add XP. A read-only browser inspection in the existing signed-in session showed 30 XP and Stage 3 completed. This audit did not finish another lesson or modify that account's learning data.

**Source inspection, awaiting deployment:** The completion API authenticates via the user's cookie and profile, resolves a canonical lesson, evaluates the complete submissions again, and passes its canonical minutes and server-verified user ID to the privileged RPC. An invalid lesson ID receives 404. A valid lesson in a locked stage was still accepted by the API even though the dashboard hid it; this audit adds a server-side progression check to the route and the lesson page. It has not been deployed or tested in production yet. Because lesson answers are included in browser-delivered content, a determined client may submit all correct answers without genuinely spending five minutes. `estimatedMinutes` is a fixed curriculum credit, not measured elapsed time.

**Still unverified and required before closing Phase 5.1:** Make negative requests using two independently authenticated test sessions: cross-account reads and writes, direct table writes, both direct RPCs, forged user/minutes fields and invalid/locked lesson IDs. Exercise a fresh lesson with simultaneous completion requests and retry the same request UUID, then compare progress, activity count and XP before and after. Verify the new stage guard on production, and check the signed-in UI at 375px, 768px and 1440px including loading/error. The SQL grants, RLS, lock and unique constraints support the expected behavior but do not substitute for these live request tests. Do not reuse the account that already reached 30 XP for an additional first-completion test. Phase 6 is blocked until these checks pass.

**Advisors:** Security Advisor reports only `auth_leaked_password_protection` (WARN; disabled); Performance Advisor reports no notices. This warning is a separate Auth setting decision and is not silently treated as enabled.

**Local checks for this follow-up branch:** `npm run lint`, `npm run typecheck`, `npm run build` and `git diff --check` passed. No production deployment of the new progression guard is claimed.

## Audit on 2026-09-23

- At the time of the original audit, production landing, sign-in, sign-up and forgot-password rendered; unauthenticated `/app` and a lesson route redirected to sign-in. The later owner-confirmed signed-in lesson result is recorded above.
- Production `public.lesson_progress` and `public.learning_activity` have the columns, constraints and indexes described by repository migration `20260923092415_learning_progress_history_reconciled.sql`, and both have own-row SELECT policies. The function body also matches the repository version. The remote schema for 0003 was applied outside migration tracking. On 2026-09-23, a guarded schema assertion was recorded as migration `20260923092415_learning_progress_history_reconciled`; the source migration was renamed to that version without changing its SQL. The cause of the original manual application remains unknown.
- At the initial audit, `authenticated` had table write grants (RLS denied writes) and could execute the public SECURITY DEFINER completion function. That function trusted caller supplied lesson ID and minutes. The revocation migration has since closed this exposure. Security Advisor now reports only disabled leaked-password protection; Performance Advisor has no notices.

## Prepared code

- `src/lib/supabase/admin.ts`: server-only privileged client, requiring `SUPABASE_SERVICE_ROLE_KEY`; no public env prefix or browser import.
- `/api/lessons/complete`: validates signed-in user and complete submission list, loads canonical lesson, recomputes results, supplies trusted user ID, canonical minutes and a request ID to a privileged RPC. Database errors no longer reveal raw SQL messages to visitors.
- `LessonPlayer`: uses a stable UUID for retries of a completion attempt and a fresh UUID for a new attempt.
- `20260923092455_prepare_trusted_completion.sql` is applied: adds the unique `(user_id, request_id)` activity index and service-role-only RPC. It serializes same-user same-lesson writes and prevents repeat XP or minutes on retry. `20260923093152_revoke_untrusted_completion.sql` has been applied after Vercel deployed commit `4a5ad0b` (Ready).

## Release sequence

1. The 0003 migration history has been reconciled after schema assertions; legacy migration files were renamed to match recorded remote versions. Do not rerun the old DDL or reset data.
2. `SUPABASE_SERVICE_ROLE_KEY` now appears in Vercel Production. Never add it as `NEXT_PUBLIC_*`, commit it, or print it. The application must prove the key works via completion after deployment.
3. The additive migration and the new application have been deployed; the revocation migration has been applied. Both RPCs deny `authenticated`; the tables grant `authenticated` SELECT only. The owner subsequently confirmed a normal authenticated completion and replay, as recorded above.
4. Verify authenticated direct RPC calls fail with permission denied, authenticated table writes fail, ordinary completion succeeds, cross-user writes fail, arbitrary lesson IDs/minutes do not award rewards, first completion awards 10 XP, replay awards zero, retries with the same UUID do not add activity, and concurrent completions award XP once.
5. Run Security and Performance Advisors again; separately decide whether to enable leaked-password protection in Auth. Check 375px, 768px and 1440px on the deployed app with a dedicated confirmed test account for both languages.

Do not mark this phase completed or begin Phase 6 until all release checks pass. Normal lesson saving and replay were exercised on production, but a second signed-in test session and controlled retry/concurrency tests remain outstanding. Security Advisor now only warns about disabled leaked-password protection; Performance Advisor is clean.

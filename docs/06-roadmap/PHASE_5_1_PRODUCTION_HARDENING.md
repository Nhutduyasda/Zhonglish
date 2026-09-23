# Phase 5.1 — Production hardening

Status: **PARTIAL — prepared locally; production release gate has not passed.** Phase 6 has not started.

## Audit on 2026-09-23

- Production landing, sign-in, sign-up and forgot-password rendered; unauthenticated `/app` and a lesson route redirected to sign-in. Signed-in flows were not tested because a confirmed dedicated test account was unavailable.
- Production `public.lesson_progress` and `public.learning_activity` have the columns, constraints and indexes described by repository migration `0003_learning_progress.sql`, and both have own-row SELECT policies. The function body also matches the repository version. The remote schema for 0003 was applied outside migration tracking. On 2026-09-23, a guarded schema assertion was recorded as migration `20260923092415_learning_progress_history_reconciled`; the source migration was renamed to that version without changing its SQL. The cause of the original manual application remains unknown.
- Remote `authenticated` role still has table write grants (RLS denies writes) and can execute the public SECURITY DEFINER completion function. That function trusts caller supplied lesson ID and minutes. This is a live integrity vulnerability. Security Advisor reports that function and separately disabled leaked-password protection; Performance Advisor has no notices.

## Prepared code

- `src/lib/supabase/admin.ts`: server-only privileged client, requiring `SUPABASE_SERVICE_ROLE_KEY`; no public env prefix or browser import.
- `/api/lessons/complete`: validates signed-in user and complete submission list, loads canonical lesson, recomputes results, supplies trusted user ID, canonical minutes and a request ID to a privileged RPC. Database errors no longer reveal raw SQL messages to visitors.
- `LessonPlayer`: uses a stable UUID for retries of a completion attempt and a fresh UUID for a new attempt.
- `20260923092455_prepare_trusted_completion.sql` is applied: adds the unique `(user_id, request_id)` activity index and service-role-only RPC. It serializes same-user same-lesson writes and prevents repeat XP or minutes on retry. `20260923092516_revoke_untrusted_completion.sql` is prepared for the cutover after the new application is deployed.

## Release sequence

1. The 0003 migration history has been reconciled after schema assertions; legacy migration files were renamed to match recorded remote versions. Do not rerun the old DDL or reset data.
2. `SUPABASE_SERVICE_ROLE_KEY` now appears in Vercel Production. Never add it as `NEXT_PUBLIC_*`, commit it, or print it. The application must prove the key works via completion after deployment.
3. The additive migration has been applied. Deploy the application and verify a normal completion, then apply `20260923092516_revoke_untrusted_completion.sql` promptly. This two-step cutover keeps the old application functional until the new one is live.
4. Verify authenticated direct RPC calls fail with permission denied, authenticated table writes fail, ordinary completion succeeds, cross-user writes fail, arbitrary lesson IDs/minutes do not award rewards, first completion awards 10 XP, replay awards zero, retries with the same UUID do not add activity, and concurrent completions award XP once.
5. Run Security and Performance Advisors again; separately decide whether to enable leaked-password protection in Auth. Check 375px, 768px and 1440px on the deployed app with a dedicated confirmed test account for both languages.

Do not mark this phase completed or begin Phase 6 until all release checks pass. The remaining blocker for E2E verification is a confirmed dedicated test account. The new app and revocation migration are not yet deployed.

# Phase 2 — Authentication + Beginner Onboarding

Status: **Partial — implementation built, external configuration and live verification pending.**

## Architecture

- Next.js 16 `src/proxy.ts` refreshes Supabase SSR cookie sessions on auth-related routes via `getClaims()`.
- `src/lib/supabase/client.ts` creates the browser client; `server.ts` creates a request-scoped server client. Only the project URL and publishable key are used.
- Server components use `getUser()` before protected data access. `/app` redirects guests to `/sign-in` and incomplete users to `/onboarding`.
- `/api/onboarding/complete` validates every preference, determines the user ID from Supabase Auth and upserts only that user's profile. No client-supplied user ID is accepted.
- The marketing page remains static and does not import Supabase.

## Supabase setup

1. Create a Supabase project and apply `supabase/migrations/0001_create_profiles.sql` through the SQL editor or migration workflow. This has **not** been applied in this environment.
2. In Supabase Auth, enable email/password. Add `http://localhost:3000/auth/callback` and `https://zhonglish.vercel.app/auth/callback` to redirect URLs; configure preview domains as needed.
3. For SSR confirmation emails, use a confirmation template that sends `token_hash` and `type=email` to `/auth/callback`, or a PKCE code link. Verify the actual template and recovery URL in the project.
4. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_APP_URL` in local and Vercel Development, Preview and Production environments. Never commit a service role key or database password.
5. Redeploy after adding environment variables; test real email, callback and cookies on production.

## Database and RLS

`public.profiles` contains a user-owned UUID and four constrained onboarding fields, completion flag and timestamps. RLS is enabled with own-row select/insert/update policies based on `auth.uid()`. No public read policy. Two-account cross-user tests have **not** been run; do not assume the migration is active merely because it exists in Git.

## User flow

Landing CTAs open `/onboarding`; language cards pass a valid query preselection. The four questions ask for language, goal, daily minutes and experience. Choices persist in same-tab `sessionStorage` until authentication completes, including a refresh and email confirmation return on that device. The auth gate links to `/sign-up` and `/sign-in`. After authentication the draft is validated and saved, then cleared; `/onboarding/complete` shows a success screen. `/app` remains a protected Phase 3 placeholder.

Sign-up handles both active-session and confirmation-email configurations. Sign-in, sign-out, forgot password and password reset are implemented. Error messages are in Vietnamese. The callback supports PKCE code and `token_hash` email/recovery flows.

## Validation performed

- `npm run lint`, `npm run typecheck`, `npm run build`: pass without Supabase credentials.
- Draft validation accepts supported values and rejects invalid language and daily minute values.
- Phase 1 production page rendered; language preview and FAQ interaction worked at desktop viewport with no document overflow or site console error observed.

## Still required before completion

- Connect a real Supabase project and verify migration and RLS with two separate accounts.
- Verify sign-up, confirmation, sign-in, reset, sign-out, session refresh, profile write and redirects.
- Test production Vercel cookies and redirects, plus responsive 375px, 768px and 1440px browser QA.
- If confirmation email is opened on another device/tab, the in-tab onboarding draft is unavailable there; the user can complete onboarding again. A cross-device pre-auth draft would require a separate design.

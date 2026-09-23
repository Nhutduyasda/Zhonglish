# Tech Stack

## Recommended

- Next.js — App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide icons
- Supabase PostgreSQL for user profiles (Phase 2 migration)
- Supabase Auth email/password with `@supabase/ssr` cookie sessions (Phase 2)
- Prisma or Drizzle may be reconsidered for later domain data; neither is installed
- Vercel

## Optional later

- Web Speech API
- speech provider API
- AI conversation API
- analytics
- error monitoring

## Rules

- Keep Vercel compatibility.
- Do not depend on a persistent local filesystem.
- Secrets only through environment variables.
- Use managed database in production.
- Keep bundle lean.

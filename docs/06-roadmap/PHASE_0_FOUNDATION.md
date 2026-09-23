# Phase 0 — Foundation

Status: **Completed**. Application foundation implemented. Phase 1 remains not started.

Read `AGENTS.md`, `MVP_ROADMAP.md`, `docs/01-design/` and `docs/05-rules/` before implementation.

## 0.1 Project Scaffold

- [x] Scaffold Next.js App Router with TypeScript, `src/`, Tailwind CSS and ESLint.
- [x] Enable TypeScript strict mode and add `lint`, `typecheck` and `build` scripts.

## 0.2 UI Foundation

- [x] Configure shadcn/ui component infrastructure and Button manually, plus Framer Motion and Lucide icons.
- [x] Centralize design tokens and CSS variables per `docs/01-design/DESIGN_SYSTEM.md`.
- [x] Configure Noto Sans Vietnamese/Latin and Noto Sans SC using `next/font/local`.
- [x] Establish accessible focus states and reduced motion support.

## 0.3 Project Structure

- [x] Prepare `src/app/`, `src/components/ui/` and `src/lib/`; create future feature folders when their code exists.
- [x] Keep future feature and content logic out of this phase.

## 0.4 Route Architecture

- [x] Prepare the public `(marketing)` route group; auth, onboarding and learning routes remain documented for later phases.
- [x] Define the marketing boundary in its own layout; create learning shell when Phase 3 begins.
- [x] Avoid implementing landing, authentication, onboarding and learning features.

## 0.5 Quality Gates

- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Check responsive CSS structure, semantic markup and keyboard focus rules. Full visual browser QA awaits a browser with local app access.

## 0.6 Vercel Readiness

- [x] Confirm independent Next.js production build; GitHub repository is connected. Vercel deployment was not performed.
- [x] Document environment variables with `.env.example`; keep secrets out of Git.
- [x] Avoid any dependency on a persistent local filesystem in production.

## Definition of Done

- [x] Next.js scaffold hoàn chỉnh
- [x] TypeScript strict
- [x] Tailwind hoạt động
- [x] shadcn/ui component infrastructure configured manually
- [x] Framer Motion installed
- [x] Lucide installed and rendered
- [x] Design tokens centralized
- [x] Typography configured
- [x] Basic project structure created
- [x] Marketing boundary prepared; future app boundary documented
- [x] ESLint passes
- [x] Typecheck passes
- [x] Production build passes
- [x] Vercel-compatible framework build; deployment not verified

The shadcn CLI registry endpoint was inaccessible from this environment. `components.json`, the Button primitive and required utilities were configured locally. New registry components may need a follow-up check when that endpoint is reachable.

Update `PROJECT_STATUS.md` when Phase 0 is complete.

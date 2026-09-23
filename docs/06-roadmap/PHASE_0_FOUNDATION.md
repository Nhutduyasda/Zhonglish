# Phase 0 — Foundation

Status: **Not Started**. This document prepares the next implementation task; no application scaffold is included in repository bootstrap.

Read `AGENTS.md`, `MVP_ROADMAP.md`, `docs/01-design/` and `docs/05-rules/` before implementation.

## 0.1 Project Scaffold

- [ ] Scaffold Next.js App Router with TypeScript, `src/`, Tailwind CSS and ESLint.
- [ ] Enable TypeScript strict mode and add `lint`, `typecheck` and `build` scripts.

## 0.2 UI Foundation

- [ ] Configure shadcn/ui, Framer Motion and Lucide icons.
- [ ] Centralize design tokens and CSS variables per `docs/01-design/DESIGN_SYSTEM.md`.
- [ ] Configure a readable Vietnamese, Latin and Simplified Chinese font using `next/font`.
- [ ] Establish accessible focus states and reduced motion support.

## 0.3 Project Structure

- [ ] Prepare `src/app/`, `src/components/`, `src/features/`, `src/hooks/`, `src/lib/`, `src/data/`, `src/types/` and `src/styles/` as needed by the scaffold.
- [ ] Keep future feature and content logic out of this phase.

## 0.4 Route Architecture

- [ ] Prepare public `(marketing)` and future `(auth)` route groups plus `onboarding/` and `app/` architecture.
- [ ] Define separate marketing and learning shell boundaries; lesson screens will later have a focused layout.
- [ ] Avoid implementing landing, authentication, onboarding and learning features.

## 0.5 Quality Gates

- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Check basic desktop and mobile shell rendering and accessibility.

## 0.6 Vercel Readiness

- [ ] Confirm production build is compatible with Vercel and GitHub integration.
- [ ] Document environment variables with `.env.example`; keep secrets out of Git.
- [ ] Avoid any dependency on a persistent local filesystem in production.

## Definition of Done

- [ ] Next.js scaffold hoàn chỉnh
- [ ] TypeScript strict
- [ ] Tailwind hoạt động
- [ ] shadcn/ui configured
- [ ] Framer Motion configured
- [ ] Lucide configured
- [ ] Design tokens centralized
- [ ] Typography configured
- [ ] Basic project structure created
- [ ] Marketing/app architecture prepared
- [ ] ESLint passes
- [ ] Typecheck passes
- [ ] Production build passes
- [ ] Vercel compatible

Update `PROJECT_STATUS.md` when Phase 0 is complete.

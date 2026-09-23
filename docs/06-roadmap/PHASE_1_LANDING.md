# Phase 1 — Skolla-inspired Landing

Status: **Completed and deployed, as confirmed by the project owner.** Desktop production interaction was checked in Phase 2; mobile and tablet visual checks were not available in this browser session.

## Scope

Replace the foundation placeholder at `/` with a Vietnamese marketing page for people starting English or Chinese. No account, lesson engine, database, pricing or progress persistence is implemented.

## Sections

1. Sticky pill navigation and responsive mobile menu.
2. Hero with original CSS lesson cards and two anchor actions.
3. Five concise learning benefits.
4. Experience section with a four-card grid and large learning-path graphic.
5. English and Chinese selection cards.
6. Interactive sample exercise with local-only selection and feedback.
7. Three-step learning explanation.
8. Progress and learning method previews.
9. Beginner concerns in place of fabricated testimonials or metrics.
10. Native FAQ accordion, final CTA and footer.

## Component architecture

- `src/app/(marketing)/page.tsx` composes sections.
- `src/components/marketing/header.tsx` owns only mobile navigation state.
- `hero.tsx`, `sections.tsx` and `faq.tsx` render static server components.
- `language-experience.tsx` owns local sample exercise state and a reduced-motion-aware Framer Motion transition.
- `src/data/marketing.ts` holds benefits, steps, methods and FAQs.

## Visual decisions

The reference's dark field, floating pill navigation, centered oversized headline, dramatic section spacing, rounded stage surfaces and editorial card rhythm inform the composition. Zhonglish uses its own language cards, copy, graphics and accent colors. No reference images, template code, testimonials, prices or user statistics were copied.

## Responsive and accessibility

CSS recomposes the hero, experience grid, preview and progress section at 900px, then stacks language and step cards at 650px. The benefit strip becomes touch-scrollable on small screens. The menu has an accessible toggle, Escape handling and focus return. FAQ uses native `details/summary`; answer feedback uses text and icons. Global visible focus and CSS reduced motion apply. The sample exercise additionally uses `useReducedMotion`.

## Validation

- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm run build`: pass; `/` is statically rendered.
- Production HTTP smoke check: `/` returned 200.
- All local anchor targets were checked in rendered HTML.

## Pending visual QA

The local server was blocked by the cloud browser, but the page is now available at `https://zhonglish.vercel.app`. In Phase 2 desktop production QA, the landing rendered, language preview and FAQ responded, and the document did not overflow horizontally. Mobile and tablet viewport screenshots and the mobile menu remain unverified here.

## Known limitations

- “Bắt đầu học” scrolls to language selection while onboarding remains a future phase.
- Language preview is a marketing sample only and does not store progress.

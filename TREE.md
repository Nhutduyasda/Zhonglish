# Repository Tree

```text
Zhonglish/
├── .gitignore
├── .env.example
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── components.json
├── supabase/migrations/
│   ├── 0001_create_profiles.sql
│   └── 0003_learning_progress.sql
├── README.md
├── 00_START_HERE.md
├── AGENTS.md
├── TREE.md
├── public/
│   └── .gitkeep
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── (marketing)/
│   │   ├── (auth)/
│   │   ├── onboarding/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   └── lesson/[lessonId]/
│   │   ├── auth/callback/
│   │   └── api/
│   │       ├── onboarding/complete/
│   │       └── lessons/complete/
│   ├── proxy.ts
│   ├── components/
│   │   ├── ui/
│   │   │   └── button.tsx
│   │   └── marketing/
│   │       ├── header.tsx
│   │       ├── hero.tsx
│   │       ├── sections.tsx
│   │       ├── language-experience.tsx
│   │       └── faq.tsx
│   │   ├── auth/
│   │   │   └── auth-form.tsx
│   │   ├── onboarding/
│   │   │   └── onboarding-flow.tsx
│   │   └── lesson/
│   │       ├── lesson-player.tsx
│   │       ├── speech-button.tsx
│   │       ├── chinese-term-card.tsx
│   │       └── exercises/
│   │           ├── multiple-choice.tsx
│   │           ├── text-input.tsx
│   │           ├── matching.tsx
│   │           ├── listening.tsx
│   │           ├── hanzi-choice.tsx
│   │           └── pinyin-choice.tsx
│   ├── data/
│   │   ├── curriculum.ts
│   │   ├── lessons.ts
│   │   ├── chinese-vocabulary.ts
│   │   └── marketing.ts
│   ├── hooks/
│   │   └── use-speech.ts
│   ├── features/
│   │   ├── onboarding/
│   │   │   └── draft.ts
│   │   └── lesson/
│   │       ├── types.ts
│   │       └── evaluation.ts
│   └── lib/
│       ├── utils.ts
│       └── supabase/
│           ├── client.ts
│           ├── server.ts
│           ├── proxy.ts
│           ├── profile.ts
│           ├── learning-progress.ts
│           └── config.ts
├── docs/
│   ├── README.md
│   ├── 00-product/
│   │   ├── PRODUCT_VISION.md
│   │   ├── TARGET_USERS.md
│   │   ├── SYSTEM_SCOPE.md
│   │   └── SUCCESS_METRICS.md
│   ├── 01-design/
│   │   ├── DESIGN_DIRECTION.md
│   │   ├── DESIGN_SYSTEM.md
│   │   ├── LANDING_PAGE_SKOLLA.md
│   │   ├── LEARNING_APP_UI.md
│   │   ├── MOTION_GUIDELINES.md
│   │   └── RESPONSIVE_RULES.md
│   ├── 02-learning/
│   │   ├── LEARNING_MODEL.md
│   │   ├── ENGLISH_PATH.md
│   │   ├── CHINESE_PATH.md
│   │   └── GAMIFICATION.md
│   ├── 03-ux/
│   │   ├── USER_FLOWS.md
│   │   ├── ONBOARDING_FLOW.md
│   │   └── LESSON_FLOW.md
│   ├── 04-architecture/
│   │   ├── TECH_STACK.md
│   │   ├── APP_STRUCTURE.md
│   │   ├── DATA_MODEL.md
│   │   └── VERCEL_DEPLOYMENT.md
│   ├── 05-rules/
│   │   ├── AI_AGENT_RULES.md
│   │   ├── CODING_RULES.md
│   │   ├── UI_UX_RULES.md
│   │   ├── ACCESSIBILITY.md
│   │   └── CONTENT_RULES.md
│   ├── 06-roadmap/
│   │   ├── MVP_ROADMAP.md
│   │   ├── PHASE_0_FOUNDATION.md
│   │   ├── PHASE_1_LANDING.md
│   │   ├── PHASE_2_AUTH_ONBOARDING.md
│   │   ├── PHASE_4_1_LEARNING_PROGRESS.md
│   │   ├── PHASE_5_CHINESE_FOUNDATION.md
│   │   ├── PROJECT_STATUS.md
│   │   └── FUTURE_BACKLOG.md
│   └── 07-references/
│       ├── INSPIRATION.md
│       └── LICENSE_AND_ORIGINALITY.md
└── prompts/
    ├── MASTER_BUILD_PROMPT.md
    └── PHASE_PROMPT_TEMPLATE.md
```

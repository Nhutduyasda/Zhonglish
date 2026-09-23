# App Structure

Suggested implementation structure:

```text
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── pricing/
│   │   └── contact/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── onboarding/
│   └── app/
│       ├── dashboard/
│       ├── learn/
│       ├── lesson/[lessonId]/
│       ├── review/
│       ├── leaderboard/
│       └── profile/
├── components/
│   ├── marketing/
│   ├── learning/
│   ├── gamification/
│   ├── layout/
│   └── ui/
├── features/
│   ├── auth/
│   ├── course/
│   ├── lesson/
│   ├── progress/
│   └── gamification/
├── lib/
├── hooks/
├── types/
├── data/
└── styles/
```

## Route principles

- `(marketing)` uses public layout.
- `/app/*` uses learning shell.
- Lesson route uses reduced distraction layout.

# Phase 4.1 — Learning Progress Foundation

## Overview

Phase 4.1 closes the core learning loop of **Zhonglish**:
$$\text{Dashboard } (/app) \longrightarrow \text{Lesson } (/app/lesson/[lessonId]) \longrightarrow \text{Completion } (/api/lessons/complete) \longrightarrow \text{Database Persistence } \longrightarrow \text{Progress Updates & Next Stage Unlock}$$

Prior to this phase:
1. The Learning Dashboard (`/app`) had no navigation link back to the Landing Page (`/`).
2. Lesson completion was purely client-side; upon returning to `/app`, stats (Today's Minutes, Streak, XP) were hard-coded at 0.
3. Stage 2 was perpetually locked because no Stage 2 lessons existed and `course-path.tsx` only marked Stage 1 as ready.

---

## 1. Issues Addressed & Implemented Solutions

### Issue 1: Dashboard Navigation to Landing Page
- Added explicit "Trang chủ" (`/`) link in `src/components/learning/learning-header.tsx` with `Home` icon.
- Maintained the Zhonglish brand logo linking to `/app` (app context).
- Mobile breakpoint (`<= 640px`): text is hidden via `.learning-nav-home-text { display: none; }`, preserving the icon button with `aria-label="Về trang chủ"`.

### Issue 2: Real Progress Persistence & Dashboard Dynamic Stats
- **Database Schema (`supabase/migrations/0003_learning_progress.sql`)**:
  - `public.lesson_progress`: Tracks `user_id`, `lesson_id`, `best_accuracy`, `completion_count`, `first_completed_at`, `last_completed_at`.
  - `public.learning_activity`: Append-only activity log tracking `user_id`, `lesson_id`, `learning_minutes`, `xp_awarded`, `completed_at`.
  - Row Level Security (RLS) enabled on both tables; authenticated users can only `SELECT` their own records.
  - Atomic RPC function `public.record_lesson_completion(...)`:
    - `SECURITY DEFINER` with fixed `search_path = ''`.
    - Enforces authentication (`auth.uid() = p_user_id`).
    - Awards **10 XP** on first completion, **0 XP** on replays (anti-farming protection).
    - Logs estimated learning minutes per completion into `learning_activity`.
- **Server API (`/api/lessons/complete`)**:
  - Validates user session and verifies lesson language matches `profile.learning_language`.
  - Re-evaluates all exercise submissions server-side using pure `evaluateExercise()` logic.
  - Calls `record_lesson_completion` RPC atomically.
- **Client & UI**:
  - `lesson-player.tsx`: Collects exercise submissions into `answersHistory`, calls `/api/lessons/complete` on lesson completion, manages `saving`, `saved`, and `error` states with retry capability.
  - `lesson-result.tsx`: Displays persistence status, real XP & minute rewards, and triggers `router.refresh()` when returning to Dashboard.
  - `src/lib/supabase/learning-progress.ts`: Queries `lesson_progress` and `learning_activity` to compute real today's minutes (UTC), total XP, and consecutive day streak.
  - `learning-stats.tsx`: Displays live dynamic stats with visual indicators (glowing flame for active streak).

### Issue 3: Stage 2 Unlocking & Lessons
- Added full Stage 2 lessons in `src/data/lessons.ts`:
  - `english-me-1`: Stage 2 ("Giới thiệu bản thân", order 2, 5 mins, 6 exercises).
  - `chinese-me-1`: Stage 2 ("Nói về mình", order 2, 5 mins, 6 exercises).
- Progression helpers:
  - `getLessonsForLanguage`, `getLessonsForStage`, `getNextLessonForUser`, `getStageStatus`.
- Dynamic UI:
  - `course-path.tsx`: Pure immutable stage rendering:
    - `completed`: Green checkmark, "Đã hoàn thành" badge, "Học lại" replay button.
    - `ready`: Active node, "Bắt đầu bài học" button.
    - `upcoming`: Lock icon, locked message.
  - `continue-learning-card.tsx`: Dynamically targets the next uncompleted lesson in the user's course. When all available lessons are finished, displays celebration message with an option to review from the beginning.

---

## 2. Supabase Migration Execution Instructions

The migration file is located at:
`supabase/migrations/0003_learning_progress.sql`

If you are applying migrations manually in the Supabase Dashboard:
1. Log in to [Supabase Console](https://supabase.com/dashboard).
2. Open your project -> **SQL Editor**.
3. Copy and run the contents of `supabase/migrations/0003_learning_progress.sql`.
4. Verify the creation of `public.lesson_progress`, `public.learning_activity`, and the `public.record_lesson_completion` function.

---

## 3. Verification & Quality Gates

- `npm run lint`: **0 errors, 0 warnings**
- `npm run typecheck`: **0 errors**
- `npm run build`: **Compiled successfully** with Next.js Turbopack
- `scratch/test-phase4-1.mjs`:
  - English & Chinese lessons loaded correctly
  - Progression progression transitions from Stage 1 -> Stage 2 -> All Completed
  - Exercise evaluation verified for all exercises in Stage 2

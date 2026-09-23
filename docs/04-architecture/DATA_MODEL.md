# Conceptual Data Model

This is a starting model, not a frozen DB schema.

## User
- id
- name
- email
- image
- createdAt

Phase 2 uses `auth.users` for credentials and email; there is no duplicate password/email in `public.profiles`.

## Profile (Phase 2 implemented schema)
- id: UUID primary key referencing `auth.users(id)`
- learning_language: `english | chinese`
- learning_goal: `communication | work | travel | study | other`
- daily_goal_minutes: `5 | 10 | 15`
- experience_level: `absolute_beginner | some_knowledge`
- onboarding_completed: boolean
- created_at, updated_at: timestamp with time zone

RLS permits each authenticated user to select, insert and update only their own row. See `supabase/migrations/20260923060231_create_profiles.sql`.

## Course
- id
- language
- title
- levelInternal

## Unit
- id
- courseId
- order
- title

## Lesson
- id
- unitId
- order
- title
- objective

## Exercise
- id
- lessonId
- type
- prompt
- payload
- answer
- explanation
- order

## Enrollment
- userId
- courseId
- startedAt

## LessonProgress (Phase 4.1 implemented schema: `public.lesson_progress`)
- id: UUID primary key default `gen_random_uuid()`
- user_id: UUID not null referencing `auth.users(id)` on delete cascade
- lesson_id: text not null
- best_accuracy: integer not null default 0 (0-100)
- completion_count: integer not null default 0
- first_completed_at: timestamptz not null default `now()`
- last_completed_at: timestamptz not null default `now()`
- Unique constraint: `(user_id, lesson_id)`

RLS: Authenticated users can only `SELECT` their own progress rows. Insertion/updates are managed through the atomic security definer function `record_lesson_completion`.

## LearningActivity (Phase 4.1 implemented schema: `public.learning_activity`)
- id: UUID primary key default `gen_random_uuid()`
- user_id: UUID not null referencing `auth.users(id)` on delete cascade
- lesson_id: text not null
- learning_minutes: integer not null default 5
- xp_awarded: integer not null default 0 (+10 on first completion, 0 on replay)
- completed_at: timestamptz not null default `now()`

RLS: Authenticated users can only `SELECT` their own activity rows. Insertion is managed through `record_lesson_completion`.

## Atomic Function (Phase 4.1 implemented RPC)
- `public.record_lesson_completion(p_lesson_id text, p_language text, p_stage_id text, p_correct_count integer, p_total_exercises integer, p_accuracy integer, p_learning_minutes integer)`:
  - `SECURITY DEFINER`, `search_path = ''`
  - Validates authenticated user via `v_user_id := auth.uid()`
  - Validates `p_language in ('english', 'chinese')`
  - Upserts `public.lesson_progress` (calculating `completion_count`, `best_accuracy`)
  - Determines `is_first_completion` and awards 10 XP on first completion or 0 XP on replay
  - Inserts activity log entry into `public.learning_activity`
  - Returns `json` with `{ is_first_completion, xp_awarded, learning_minutes }`

## UserStats
- userId
- xp
- streak
- lastLearningDate
- dailyGoalMinutes

## VocabularyItem
- id
- language
- term
- pronunciation
- meaning
- audioUrl

## ReviewState
- userId
- vocabularyItemId
- strength
- nextReviewAt

## Phase 5.1 deployed; production E2E pending

Migration history for the existing Phase 4.1 tables has been reconciled. The deployed migration adds `learning_activity.request_id` with a unique per-user retry index and `record_trusted_lesson_completion`, executable only by `service_role`. The server validates the authenticated user, canonical lesson and score before invoking it. Direct authenticated execution of both old and new RPCs has been revoked, and authenticated table grants are SELECT only. Production E2E is pending; see `docs/06-roadmap/PHASE_5_1_PRODUCTION_HARDENING.md`.

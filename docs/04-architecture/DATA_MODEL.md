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

RLS permits each authenticated user to select, insert and update only their own row. See `supabase/migrations/0001_create_profiles.sql`.

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

## LessonProgress
- userId
- lessonId
- status
- score
- completedAt

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

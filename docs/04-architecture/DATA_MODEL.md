# Conceptual Data Model

This is a starting model, not a frozen DB schema.

## User
- id
- name
- email
- image
- createdAt

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

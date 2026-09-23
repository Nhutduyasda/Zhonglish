-- Phase 4.1: Learning Progress Foundation
-- Tables: lesson_progress, learning_activity
-- Function: record_lesson_completion

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  language text not null check (language in ('english', 'chinese')),
  stage_id text not null,
  status text not null check (status in ('completed')),
  first_completed_at timestamptz not null default now(),
  last_completed_at timestamptz not null default now(),
  best_accuracy integer not null default 0,
  completion_count integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_user_lesson unique (user_id, lesson_id)
);

create table if not exists public.learning_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  language text not null check (language in ('english', 'chinese')),
  stage_id text not null,
  correct_count integer not null,
  total_exercises integer not null,
  accuracy integer not null,
  learning_minutes integer not null default 5,
  xp_awarded integer not null default 0,
  completed_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);
create index if not exists idx_learning_activity_user_date on public.learning_activity(user_id, completed_at);

-- Row Level Security
alter table public.lesson_progress enable row level security;
alter table public.learning_activity enable row level security;

revoke all on public.lesson_progress from anon;
revoke all on public.learning_activity from anon;

grant select on public.lesson_progress to authenticated;
grant select on public.learning_activity to authenticated;

create policy "Users select own lesson_progress" on public.lesson_progress
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users select own learning_activity" on public.learning_activity
  for select to authenticated using ((select auth.uid()) = user_id);

-- Atomic lesson completion function
create or replace function public.record_lesson_completion(
  p_lesson_id text,
  p_language text,
  p_stage_id text,
  p_correct_count integer,
  p_total_exercises integer,
  p_accuracy integer,
  p_learning_minutes integer
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_existing_id uuid;
  v_is_first boolean := false;
  v_xp_awarded integer := 0;
begin
  -- Validate caller authentication
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  -- Validate inputs
  if p_language not in ('english', 'chinese') then
    raise exception 'Invalid language';
  end if;

  -- Check if lesson was already completed by this user
  select id into v_existing_id
  from public.lesson_progress
  where user_id = v_user_id and lesson_id = p_lesson_id;

  if v_existing_id is null then
    -- First time completion: award 10 XP
    v_is_first := true;
    v_xp_awarded := 10;

    insert into public.lesson_progress (
      user_id,
      lesson_id,
      language,
      stage_id,
      status,
      first_completed_at,
      last_completed_at,
      best_accuracy,
      completion_count,
      created_at,
      updated_at
    ) values (
      v_user_id,
      p_lesson_id,
      p_language,
      p_stage_id,
      'completed',
      now(),
      now(),
      p_accuracy,
      1,
      now(),
      now()
    );
  else
    -- Replay: 0 XP, increment completion count and update best accuracy
    v_is_first := false;
    v_xp_awarded := 0;

    update public.lesson_progress
    set
      completion_count = completion_count + 1,
      last_completed_at = now(),
      best_accuracy = greatest(best_accuracy, p_accuracy),
      updated_at = now()
    where id = v_existing_id;
  end if;

  -- Always record an activity record for daily minutes and streak tracking
  insert into public.learning_activity (
    user_id,
    lesson_id,
    language,
    stage_id,
    correct_count,
    total_exercises,
    accuracy,
    learning_minutes,
    xp_awarded,
    completed_at
  ) values (
    v_user_id,
    p_lesson_id,
    p_language,
    p_stage_id,
    p_correct_count,
    p_total_exercises,
    p_accuracy,
    p_learning_minutes,
    v_xp_awarded,
    now()
  );

  return json_build_object(
    'is_first_completion', v_is_first,
    'xp_awarded', v_xp_awarded,
    'learning_minutes', p_learning_minutes
  );
end;
$$;

revoke all on function public.record_lesson_completion(text, text, text, integer, integer, integer, integer) from public;
revoke all on function public.record_lesson_completion(text, text, text, integer, integer, integer, integer) from anon;
grant execute on function public.record_lesson_completion(text, text, text, integer, integer, integer, integer) to authenticated;

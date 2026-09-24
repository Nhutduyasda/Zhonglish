-- Phase 7: private mistake review state and idempotent trusted mutations.

create table public.review_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  language text not null check (language in ('english', 'chinese')),
  source_lesson_id text not null,
  source_exercise_id text not null,
  review_type text not null default 'exercise',
  vocabulary_id text null,
  strength integer not null default 0 check (strength between 0 and 3),
  repetitions integer not null default 0,
  mistake_count integer not null default 1,
  correct_review_count integer not null default 0,
  last_result text null check (last_result in ('correct', 'incorrect')),
  last_reviewed_at timestamptz null,
  next_review_at timestamptz not null default now(),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint review_state_user_exercise_key
    unique (user_id, source_lesson_id, source_exercise_id)
);

create index review_state_user_due_idx
  on public.review_state (user_id, next_review_at)
  where is_active = true;

create table public.lesson_completion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  constraint lesson_completion_requests_user_request_key unique (user_id, request_id)
);

create table public.review_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  review_state_id uuid not null references public.review_state(id) on delete cascade,
  request_id uuid not null,
  was_correct boolean not null,
  previous_strength integer not null,
  new_strength integer not null,
  reviewed_at timestamptz not null default now(),
  result jsonb not null,
  constraint review_activity_user_request_key unique (user_id, request_id)
);

create index review_activity_user_reviewed_idx
  on public.review_activity (user_id, reviewed_at desc);
create index review_activity_state_idx
  on public.review_activity (review_state_id);

alter table public.review_state enable row level security;
alter table public.lesson_completion_requests enable row level security;
alter table public.review_activity enable row level security;

revoke all on public.review_state from anon, authenticated;
revoke all on public.lesson_completion_requests from anon, authenticated;
revoke all on public.review_activity from anon, authenticated;
grant select on public.review_state to authenticated;

create policy "Users select own review_state" on public.review_state
  for select to authenticated using ((select auth.uid()) = user_id);

create or replace function public.record_trusted_lesson_completion(
  p_user_id uuid,
  p_request_id uuid,
  p_lesson_id text,
  p_language text,
  p_stage_id text,
  p_correct_count integer,
  p_total_exercises integer,
  p_accuracy integer,
  p_learning_minutes integer,
  p_mistakes jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_existing_result jsonb;
  v_existing_id uuid;
  v_is_first boolean := false;
  v_xp_awarded integer := 0;
  v_mistake jsonb;
  v_result jsonb;
begin
  if p_user_id is null or p_request_id is null or p_lesson_id is null
    or p_language not in ('english', 'chinese') or p_stage_id is null
    or p_total_exercises is null or p_correct_count is null
    or p_accuracy is null or p_learning_minutes is null
    or p_total_exercises not between 1 and 100
    or p_correct_count not between 0 and p_total_exercises
    or p_accuracy <> round(p_correct_count::numeric * 100 / p_total_exercises)
    or p_learning_minutes not between 1 and 30
    or jsonb_typeof(p_mistakes) <> 'array'
    or jsonb_array_length(p_mistakes) > p_total_exercises then
    raise exception 'Invalid completion input';
  end if;

  -- Preserve Phase 5.1 concurrency behavior across different request IDs.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_user_id::text || ':' || p_lesson_id, 0)
  );

  select result into v_existing_result
  from public.lesson_completion_requests
  where user_id = p_user_id and request_id = p_request_id;
  if v_existing_result is not null then return v_existing_result; end if;

  select id into v_existing_id from public.lesson_progress
  where user_id = p_user_id and lesson_id = p_lesson_id for update;

  if v_existing_id is null then
    v_is_first := true;
    v_xp_awarded := 10;
    insert into public.lesson_progress
      (user_id, lesson_id, language, stage_id, status, best_accuracy, completion_count)
    values
      (p_user_id, p_lesson_id, p_language, p_stage_id, 'completed', p_accuracy, 1);
  else
    update public.lesson_progress set
      completion_count = completion_count + 1,
      last_completed_at = now(),
      best_accuracy = greatest(best_accuracy, p_accuracy),
      updated_at = now()
    where id = v_existing_id;
  end if;

  insert into public.learning_activity
    (user_id, request_id, lesson_id, language, stage_id, correct_count, total_exercises,
     accuracy, learning_minutes, xp_awarded)
  values
    (p_user_id, p_request_id, p_lesson_id, p_language, p_stage_id, p_correct_count,
     p_total_exercises, p_accuracy, p_learning_minutes, v_xp_awarded);

  for v_mistake in select value from jsonb_array_elements(p_mistakes)
  loop
    insert into public.review_state
      (user_id, language, source_lesson_id, source_exercise_id, vocabulary_id,
       strength, mistake_count, next_review_at, is_active)
    values
      (p_user_id, p_language, p_lesson_id, v_mistake->>'exerciseId',
       nullif(v_mistake->>'vocabularyId', ''), 0, 1, now(), true)
    on conflict (user_id, source_lesson_id, source_exercise_id) do update set
      mistake_count = public.review_state.mistake_count + 1,
      strength = greatest(public.review_state.strength - 1, 0),
      last_result = 'incorrect',
      next_review_at = now(),
      is_active = true,
      updated_at = now();
  end loop;

  v_result := jsonb_build_object(
    'is_first_completion', v_is_first,
    'xp_awarded', v_xp_awarded,
    'learning_minutes', p_learning_minutes,
    'mistakes_queued', jsonb_array_length(p_mistakes)
  );
  insert into public.lesson_completion_requests (user_id, request_id, result)
  values (p_user_id, p_request_id, v_result);
  return v_result;
end;
$$;

create or replace function public.record_trusted_review_answer(
  p_user_id uuid,
  p_review_id uuid,
  p_request_id uuid,
  p_was_correct boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.review_state%rowtype;
  v_existing jsonb;
  v_new_strength integer;
  v_next_review_at timestamptz;
  v_result jsonb;
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_user_id::text || ':' || p_request_id::text, 0)
  );
  select result into v_existing from public.review_activity
  where user_id = p_user_id and request_id = p_request_id;
  if v_existing is not null then return v_existing; end if;

  select * into v_row from public.review_state
  where id = p_review_id and user_id = p_user_id and is_active = true for update;
  if not found then raise exception 'Review item not found' using errcode = 'P0002'; end if;

  if p_was_correct then
    v_new_strength := least(v_row.strength + 1, 3);
    v_next_review_at := (
      date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh')
      + case v_new_strength when 1 then interval '3 days' when 2 then interval '7 days' else interval '14 days' end
    ) at time zone 'Asia/Ho_Chi_Minh';
  else
    v_new_strength := greatest(v_row.strength - 1, 0);
    v_next_review_at := (
      date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') + interval '1 day'
    ) at time zone 'Asia/Ho_Chi_Minh';
  end if;

  update public.review_state set
    strength = v_new_strength,
    repetitions = repetitions + 1,
    mistake_count = mistake_count + case when p_was_correct then 0 else 1 end,
    correct_review_count = correct_review_count + case when p_was_correct then 1 else 0 end,
    last_result = case when p_was_correct then 'correct' else 'incorrect' end,
    last_reviewed_at = now(),
    next_review_at = v_next_review_at,
    updated_at = now()
  where id = v_row.id;

  v_result := jsonb_build_object(
    'was_correct', p_was_correct,
    'previous_strength', v_row.strength,
    'new_strength', v_new_strength,
    'next_review_at', v_next_review_at
  );
  insert into public.review_activity
    (user_id, review_state_id, request_id, was_correct, previous_strength, new_strength, result)
  values
    (p_user_id, v_row.id, p_request_id, p_was_correct, v_row.strength, v_new_strength, v_result);
  return v_result;
end;
$$;

revoke all on function public.record_trusted_lesson_completion(uuid, uuid, text, text, text, integer, integer, integer, integer, jsonb) from public, anon, authenticated;
revoke all on function public.record_trusted_review_answer(uuid, uuid, uuid, boolean) from public, anon, authenticated;
grant execute on function public.record_trusted_lesson_completion(uuid, uuid, text, text, text, integer, integer, integer, integer, jsonb) to service_role;
grant execute on function public.record_trusted_review_answer(uuid, uuid, uuid, boolean) to service_role;

-- Add the trusted mutation before deploying the matching application.
-- The old RPC remains available until the application is deployed and verified.
-- A retry of the same lesson completion returns the original result without
-- creating another activity row or incrementing the completion counter.
alter table public.learning_activity add column request_id uuid;
create unique index learning_activity_user_request_unique
  on public.learning_activity(user_id, request_id)
  where request_id is not null;

create function public.record_trusted_lesson_completion(
  p_user_id uuid,
  p_request_id uuid,
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
  v_existing_id uuid;
  v_previous public.learning_activity%rowtype;
  v_xp_awarded integer := 0;
begin
  if p_user_id is null or p_request_id is null or p_lesson_id is null
    or p_language not in ('english', 'chinese') or p_stage_id is null
    or p_total_exercises is null or p_correct_count is null
    or p_accuracy is null or p_learning_minutes is null
    or p_total_exercises not between 1 and 100
    or p_correct_count not between 0 and p_total_exercises
    or p_accuracy <> round(p_correct_count::numeric * 100 / p_total_exercises)
    or p_learning_minutes not between 1 and 30 then
    raise exception 'Invalid completion input';
  end if;

  -- Serialize completions for this user and lesson, including concurrent first attempts.
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text || ':' || p_lesson_id, 0));

  select * into v_previous from public.learning_activity
    where user_id = p_user_id and request_id = p_request_id;
  if found then
    if v_previous.lesson_id <> p_lesson_id then
      raise exception 'Completion request already used';
    end if;
    return json_build_object('is_first_completion', v_previous.xp_awarded > 0,
      'xp_awarded', v_previous.xp_awarded,
      'learning_minutes', v_previous.learning_minutes);
  end if;

  select id into v_existing_id from public.lesson_progress
    where user_id = p_user_id and lesson_id = p_lesson_id;
  if v_existing_id is null then
    v_xp_awarded := 10;
    insert into public.lesson_progress
      (user_id, lesson_id, language, stage_id, status, best_accuracy)
    values (p_user_id, p_lesson_id, p_language, p_stage_id, 'completed', p_accuracy);
  else
    update public.lesson_progress
    set completion_count = completion_count + 1,
      last_completed_at = now(),
      best_accuracy = greatest(best_accuracy, p_accuracy),
      updated_at = now()
    where id = v_existing_id;
  end if;

  insert into public.learning_activity
    (user_id, request_id, lesson_id, language, stage_id,
     correct_count, total_exercises, accuracy, learning_minutes, xp_awarded)
  values (p_user_id, p_request_id, p_lesson_id, p_language, p_stage_id,
    p_correct_count, p_total_exercises, p_accuracy, p_learning_minutes, v_xp_awarded);

  return json_build_object('is_first_completion', v_xp_awarded > 0,
    'xp_awarded', v_xp_awarded, 'learning_minutes', p_learning_minutes);
end;
$$;

revoke all on function public.record_trusted_lesson_completion(uuid, uuid, text, text, text, integer, integer, integer, integer) from public, anon, authenticated;
grant execute on function public.record_trusted_lesson_completion(uuid, uuid, text, text, text, integer, integer, integer, integer) to service_role;

-- Phase 6: derive all learning rewards from authenticated, owner-scoped data.
-- A repeated lesson only contributes minutes once per Vietnam calendar day.
-- Badges are derived from lifetime progress and never mint extra XP.
create function public.get_learning_summary()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with recursive
  credited as (
    select distinct on ((a.completed_at at time zone 'Asia/Ho_Chi_Minh')::date, a.lesson_id)
      (a.completed_at at time zone 'Asia/Ho_Chi_Minh')::date as learning_day,
      a.lesson_id,
      a.learning_minutes
    from public.learning_activity a
    where a.user_id = (select auth.uid())
    order by (a.completed_at at time zone 'Asia/Ho_Chi_Minh')::date,
      a.lesson_id, a.completed_at, a.id
  ),
  days as (
    select learning_day, sum(learning_minutes)::integer as credited_minutes
    from credited group by learning_day
  ),
  today as (
    select (now() at time zone 'Asia/Ho_Chi_Minh')::date as learning_day
  ),
  anchor as (
    select case
      when exists (select 1 from days d where d.learning_day = t.learning_day)
        then t.learning_day
      when exists (select 1 from days d where d.learning_day = t.learning_day - 1)
        then t.learning_day - 1
      else null::date
    end as learning_day from today t
  ),
  streak_days(learning_day) as (
    select a.learning_day from anchor a where a.learning_day is not null
    union all
    select s.learning_day - 1 from streak_days s
    join days d on d.learning_day = s.learning_day - 1
  ),
  numbered_days as (
    select learning_day,
      learning_day - (row_number() over (order by learning_day))::integer as run_key
    from days
  ),
  runs as (
    select count(*)::integer as run_length
    from numbered_days group by run_key
  ),
  totals as (
    select
      (select coalesce(sum(a.xp_awarded), 0)::integer from public.learning_activity a
        where a.user_id = (select auth.uid())) as total_xp,
      (select count(*)::integer from public.lesson_progress p
        where p.user_id = (select auth.uid()) and p.status = 'completed') as completed_lessons,
      (select coalesce(d.credited_minutes, 0) from today t
        left join days d on d.learning_day = t.learning_day) as today_minutes,
      (select count(*)::integer from streak_days) as current_streak,
      (select coalesce(max(run_length), 0) from runs) as longest_streak
  )
  select jsonb_build_object(
    'today_learning_minutes', coalesce(t.today_minutes, 0),
    'total_xp', t.total_xp,
    'current_streak', t.current_streak,
    'longest_streak', t.longest_streak,
    'completed_lessons', t.completed_lessons,
    'achievements', jsonb_build_array(
      jsonb_build_object('id', 'first_lesson', 'earned', t.completed_lessons >= 1),
      jsonb_build_object('id', 'three_lessons', 'earned', t.completed_lessons >= 3),
      jsonb_build_object('id', 'three_day_streak', 'earned', t.longest_streak >= 3)
    )
  ) from totals t;
$$;

revoke all on function public.get_learning_summary() from public, anon;
grant execute on function public.get_learning_summary() to authenticated;

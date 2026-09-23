-- Apply immediately after the application using record_trusted_lesson_completion
-- is deployed and verified. The old RPC must no longer be callable by users.
revoke execute on function public.record_lesson_completion(text, text, text, integer, integer, integer, integer)
  from public, anon, authenticated;

-- RLS already limits reads; narrow grants to the operations intended by RLS.
revoke all on public.lesson_progress, public.learning_activity from authenticated;
grant select on public.lesson_progress, public.learning_activity to authenticated;

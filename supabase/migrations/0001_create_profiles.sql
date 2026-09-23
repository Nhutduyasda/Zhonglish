create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  learning_language text not null check (learning_language in ('english', 'chinese')),
  learning_goal text not null check (learning_goal in ('communication', 'work', 'travel', 'study', 'other')),
  daily_goal_minutes integer not null check (daily_goal_minutes in (5, 10, 15)),
  experience_level text not null check (experience_level in ('absolute_beginner', 'some_knowledge')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users select own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Users update own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.set_profile_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger set_profile_updated_at before update on public.profiles
  for each row execute function public.set_profile_updated_at();

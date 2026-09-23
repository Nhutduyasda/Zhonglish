-- Existing Supabase defaults can grant more table privileges than the app needs.
revoke all on public.profiles from anon;
revoke all on public.profiles from authenticated;
grant select, insert, update on public.profiles to authenticated;

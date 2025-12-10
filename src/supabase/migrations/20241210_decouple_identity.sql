-- Migration: 20241210_decouple_identity.sql

-- 1. Drop Foreign Keys to Staff
alter table public.nominations drop constraint if exists nominations_nominator_id_fkey;
alter table public.votes drop constraint if exists votes_voter_id_fkey;

-- 2. Add Foreign Keys to Auth.Users (Optional but good for integrity if users are deleted)
-- Note: 'auth.users' is in a different schema. Standard referencing is usually fine in Supabase.
-- However, since we might want to keep history even if user is deleted, we might skip ON DELETE CASCADE or just let it specific.
-- For now, let's just drop the Staff constraint to allow any ID (which will be auth.uid()).

-- 3. Add nominator_email to nominations table for display purposes
alter table public.nominations add column if not exists nominator_email text;

-- 4. Update References in Policies (if any existed - we disabled RLS so no need)

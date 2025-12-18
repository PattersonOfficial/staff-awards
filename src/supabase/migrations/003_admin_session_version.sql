-- ============================================
-- Add session_version column to admins table
-- This enables session invalidation when credentials change
-- ============================================

ALTER TABLE public.admins 
ADD COLUMN IF NOT EXISTS session_version integer DEFAULT 1;

COMMENT ON COLUMN public.admins.session_version IS 'Incremented when password changes to invalidate existing sessions';

-- Migration: Add is_finalist column to nominations table
-- This column marks which nominees have been shortlisted as finalists for voting

ALTER TABLE public.nominations 
ADD COLUMN IF NOT EXISTS is_finalist BOOLEAN DEFAULT FALSE;

-- Create index for faster queries when filtering finalists
CREATE INDEX IF NOT EXISTS idx_nominations_is_finalist 
ON public.nominations (is_finalist) 
WHERE is_finalist = TRUE;

-- Create index for category + finalist queries (useful for voting page)
CREATE INDEX IF NOT EXISTS idx_nominations_category_finalist 
ON public.nominations (category_id, is_finalist) 
WHERE is_finalist = TRUE;

COMMENT ON COLUMN public.nominations.is_finalist IS 'Indicates if this nominee has been shortlisted as a finalist for voting';

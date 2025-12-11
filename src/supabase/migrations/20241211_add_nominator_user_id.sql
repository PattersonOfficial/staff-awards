-- Migration: Consolidate nominator fields to use Auth UUID
-- This migration:
-- 1. Adds nominator_user_id column (references auth.users)
-- 2. Updates the duplicate nomination constraint to use nominator_user_id
-- 3. Drops the legacy nominator_id column (was referencing staff table)

-- Step 1: Add the new nominator_user_id column if not exists
ALTER TABLE public.nominations 
ADD COLUMN IF NOT EXISTS nominator_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Step 2: Create index for faster lookups by user ID
CREATE INDEX IF NOT EXISTS idx_nominations_nominator_user_id 
ON public.nominations(nominator_user_id);

-- Step 3: Drop the old unique constraint that used nominator_id
ALTER TABLE public.nominations 
DROP CONSTRAINT IF EXISTS nominations_nominator_category_nominee_unique;

-- Step 4: Create new unique constraint with nominator_user_id
-- This prevents the same user from nominating the same person for the same category
ALTER TABLE public.nominations 
ADD CONSTRAINT nominations_user_category_nominee_unique 
UNIQUE (nominator_user_id, category_id, nominee_id);

-- Step 5: Drop the legacy nominator_id column (was staff table reference)
ALTER TABLE public.nominations 
DROP COLUMN IF EXISTS nominator_id;

-- Note: nominator_email is kept for display purposes only

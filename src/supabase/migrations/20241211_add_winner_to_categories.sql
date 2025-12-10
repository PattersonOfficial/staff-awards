-- Add winner_id column to categories table
-- This stores the ID of the staff member who won the award

ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS winner_id uuid REFERENCES public.staff(id) ON DELETE SET NULL;

-- Add winner_published_at to track when the winner was announced
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS winner_published_at timestamp with time zone;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_winner_id ON public.categories(winner_id);

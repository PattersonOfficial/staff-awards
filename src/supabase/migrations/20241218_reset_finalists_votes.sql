-- Migration: Reset finalists and votes for testing
-- Run this in Supabase SQL Editor to clear all finalist flags and votes

-- Reset all finalists (set is_finalist to false)
UPDATE public.nominations 
SET is_finalist = false 
WHERE is_finalist = true;

-- Delete all votes
DELETE FROM public.votes;

-- Verify the changes
SELECT 
  (SELECT COUNT(*) FROM public.nominations WHERE is_finalist = true) as remaining_finalists,
  (SELECT COUNT(*) FROM public.votes) as remaining_votes;

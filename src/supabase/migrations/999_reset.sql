-- ============================================
-- DevOps Awards - Reset Data (Testing Only)
-- ============================================
-- Use this to reset test data. DO NOT RUN IN PRODUCTION.
-- ============================================

-- Reset all finalists
UPDATE public.nominations 
SET is_finalist = false 
WHERE is_finalist = true;

-- Delete all votes
DELETE FROM public.votes;

-- Verify
SELECT 
  (SELECT COUNT(*) FROM public.nominations WHERE is_finalist = true) as remaining_finalists,
  (SELECT COUNT(*) FROM public.votes) as remaining_votes;

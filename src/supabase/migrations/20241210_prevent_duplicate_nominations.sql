-- Add unique constraint to nominations table to prevent duplicate nominations
-- A user (nominator) cannot nominate the same person (nominee) for the same category more than once.

alter table public.nominations
add constraint nominations_nominator_category_nominee_unique 
unique (nominator_id, category_id, nominee_id);

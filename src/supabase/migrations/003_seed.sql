-- ============================================
-- DevOps Awards - Seed Data
-- ============================================
-- This file contains initial seed data for the application.
-- ============================================

-- Default Admin Account
INSERT INTO public.admins (email, password)
VALUES ('admin@devopsafricalimited.com', '@#admin@devopsafrica#')
ON CONFLICT (email) DO NOTHING;

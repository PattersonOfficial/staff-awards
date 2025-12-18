-- ============================================
-- DevOps Awards - Complete Database Schema
-- ============================================
-- This file contains the complete schema for the awards application.
-- Run this on a fresh Supabase database to set up everything.
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. DEPARTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 2. STAFF TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.staff (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  department text,
  position text,
  avatar text,
  role text DEFAULT 'staff',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 3. ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 4. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image text,
  type text DEFAULT 'Individual Award',
  department text,
  quantity integer DEFAULT 1,
  
  -- Timeline fields
  nomination_start timestamp with time zone,
  nomination_end timestamp with time zone,
  nomination_deadline timestamp with time zone, -- Alias for nomination_end
  shortlisting_start timestamp with time zone,
  shortlisting_end timestamp with time zone,
  voting_start timestamp with time zone,
  voting_end timestamp with time zone,
  
  -- Status
  status text CHECK (status IN ('draft', 'published', 'closed')) DEFAULT 'draft',
  
  -- Winner tracking
  winner_id uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  winner_published_at timestamp with time zone,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for winner lookups
CREATE INDEX IF NOT EXISTS idx_categories_winner_id ON public.categories(winner_id);

-- ============================================
-- 5. NOMINATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.nominations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  nominee_id uuid REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  
  -- Nominator tracking (uses Auth user ID, not staff ID)
  nominator_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  nominator_email text,
  
  -- Nomination details
  reason text,
  status text CHECK (status IN ('pending', 'approved', 'rejected', 'shortlisted')) DEFAULT 'pending',
  is_finalist boolean DEFAULT FALSE,
  
  submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Prevent duplicate nominations (same user, same category, same nominee)
ALTER TABLE public.nominations 
ADD CONSTRAINT nominations_user_category_nominee_unique 
UNIQUE (nominator_user_id, category_id, nominee_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_nominations_nominator_user_id ON public.nominations(nominator_user_id);
CREATE INDEX IF NOT EXISTS idx_nominations_is_finalist ON public.nominations(is_finalist) WHERE is_finalist = TRUE;
CREATE INDEX IF NOT EXISTS idx_nominations_category_finalist ON public.nominations(category_id, is_finalist) WHERE is_finalist = TRUE;

COMMENT ON COLUMN public.nominations.is_finalist IS 'Indicates if this nominee has been shortlisted as a finalist for voting';

-- ============================================
-- 6. VOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  voter_id uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  nominee_id uuid REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  voted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- One vote per voter per category
  UNIQUE(category_id, voter_id)
);

-- ============================================
-- 7. FEEDBACK TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text NOT NULL,
  user_name text,
  type text CHECK (type IN ('bug', 'feature', 'improvement', 'other')) DEFAULT 'other',
  message text NOT NULL,
  status text CHECK (status IN ('new', 'reviewed', 'resolved')) DEFAULT 'new',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- ============================================
-- DISABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.nominations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback DISABLE ROW LEVEL SECURITY;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Admins Table
create table if not exists public.admins (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Staff Table
create table if not exists public.staff (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  department text,
  position text,
  avatar text,
  role text default 'staff',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Categories Table
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image text,
  type text default 'Individual Award', -- Removed strict check constraint to allow any award type
  department text,
  quantity integer default 1,
  
  nomination_start timestamp with time zone,
  nomination_end timestamp with time zone,
  voting_start timestamp with time zone,
  voting_end timestamp with time zone,
  
  nomination_deadline timestamp with time zone, -- Included for compatibility
  
  status text check (status in ('draft', 'published', 'closed')) default 'draft',
  shortlisting_start timestamp with time zone,
  shortlisting_end timestamp with time zone,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Nominations Table
create table if not exists public.nominations (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories(id) on delete cascade not null,
  nominator_id uuid references public.staff(id) on delete set null,
  nominee_id uuid references public.staff(id) on delete cascade not null,
  reason text,
  status text check (status in ('pending', 'approved', 'rejected', 'shortlisted')) default 'pending',
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Votes Table
create table if not exists public.votes (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories(id) on delete cascade not null,
  voter_id uuid references public.staff(id) on delete set null,
  nominee_id uuid references public.staff(id) on delete cascade not null,
  voted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(category_id, voter_id)
);

-- DISABLE RLS as requested
alter table public.admins disable row level security;
alter table public.staff disable row level security;
alter table public.categories disable row level security;
alter table public.nominations disable row level security;
alter table public.votes disable row level security;

-- Setup Storage Bucket for Category Images
insert into storage.buckets (id, name, public) 
values ('category-images', 'category-images', true)
on conflict (id) do nothing;

-- Setup Storage Bucket for Staff Avatars
insert into storage.buckets (id, name, public) 
values ('staff-avatars', 'staff-avatars', true)
on conflict (id) do nothing;

-- Allow public access to storage buckets
create policy "Public Access Category Images"
on storage.objects for all
using ( bucket_id = 'category-images' )
with check ( bucket_id = 'category-images' );

create policy "Public Access Staff Avatars"
on storage.objects for all
using ( bucket_id = 'staff-avatars' )
with check ( bucket_id = 'staff-avatars' );

-- Insert Default Admin
insert into public.admins (email, password)
values ('admin@devopsafricalimited.com', '@#admin@devopsafrica#')
on conflict (email) do nothing;

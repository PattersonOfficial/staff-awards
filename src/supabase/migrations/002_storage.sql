-- ============================================
-- DevOps Awards - Storage Setup
-- ============================================
-- This file sets up storage buckets for the application.
-- ============================================

-- Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for staff avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('staff-avatars', 'staff-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to category images
CREATE POLICY "Public Access Category Images"
ON storage.objects FOR ALL
USING (bucket_id = 'category-images')
WITH CHECK (bucket_id = 'category-images');

-- Allow public access to staff avatars
CREATE POLICY "Public Access Staff Avatars"
ON storage.objects FOR ALL
USING (bucket_id = 'staff-avatars')
WITH CHECK (bucket_id = 'staff-avatars');

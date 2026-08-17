-- Storage Setup for DroneLink Admin
-- Run this in the Supabase Dashboard -> SQL Editor.
-- This creates the 'images' storage bucket (public read, authenticated write)
-- that the app uses to upload/show images.

-- 1) Create the public 'images' bucket (if it doesn't already exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2) Allow anyone (public/anonymous) to READ objects in the 'images' bucket
--    so uploaded images display on the public site via getPublicUrl().
DROP POLICY IF EXISTS "Public read access to images" ON storage.objects;
CREATE POLICY "Public read access to images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- 3) Allow only signed-in (authenticated) users to UPLOAD to 'images'
DROP POLICY IF EXISTS "Authenticated upload to images" ON storage.objects;
CREATE POLICY "Authenticated upload to images" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.uid() IS NOT NULL);

-- 4) Allow signed-in users to UPDATE objects in 'images'
DROP POLICY IF EXISTS "Authenticated update in images" ON storage.objects;
CREATE POLICY "Authenticated update in images" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'images' AND auth.uid() IS NOT NULL);

-- 5) Allow signed-in users to DELETE objects in 'images'
DROP POLICY IF EXISTS "Authenticated delete in images" ON storage.objects;
CREATE POLICY "Authenticated delete in images" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'images' AND auth.uid() IS NOT NULL);
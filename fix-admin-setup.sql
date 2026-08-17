-- =====================================================================
-- DroneLink Admin - ONE-TIME FIX
-- Run this ENTIRE file in: Supabase Dashboard -> SQL Editor -> Run
-- It fixes BOTH admin issues:
--   1) "new row violates row-level security policy" when adding an image
--   2) Image file uploads (creates the missing 'images' storage bucket)
-- =====================================================================

-- ---------------------------------------------------------------------
-- FIX 1: Allow logged-in admins to add/edit/delete project_meta rows
-- (This is the table the Image Management module saves to.)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow authenticated users to manage project_meta" ON project_meta;
CREATE POLICY "Allow authenticated users to manage project_meta" ON project_meta
  FOR ALL USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- FIX 2: Create the public 'images' storage bucket (if missing)
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view uploaded images (so they display on the site)
DROP POLICY IF EXISTS "Public read access to images" ON storage.objects;
CREATE POLICY "Public read access to images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- Allow only signed-in admins to upload / update / delete images
DROP POLICY IF EXISTS "Authenticated upload to images" ON storage.objects;
CREATE POLICY "Authenticated upload to images" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated update in images" ON storage.objects;
CREATE POLICY "Authenticated update in images" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated delete in images" ON storage.objects;
CREATE POLICY "Authenticated delete in images" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Done. You can re-run this file safely at any time.
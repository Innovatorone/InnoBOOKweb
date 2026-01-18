-- =====================================================
-- Storage Buckets Setup
-- Avatar, Book Images va Audio Files
-- =====================================================

-- NOTE: Buckets allaqachon Supabase Dashboard'da yaratilgan:
-- ✅ avatar
-- ✅ bookImage  
-- ✅ audios

-- Agar yaratilmagan bo'lsa, Dashboard -> Storage -> New Bucket orqali yarating:
-- 1. Bucket name: avatar (Public: true)
-- 2. Bucket name: bookImage (Public: true)
-- 3. Bucket name: audios (Public: true)

-- =====================================================
-- IMPORTANT: Storage Policies
-- =====================================================

-- Storage policies Supabase Dashboard orqali sozlash kerak:
-- Storage -> [Bucket name] -> Policies -> New Policy

-- Yoki quyidagi buyruqlar bilan:

-- 1. AVATAR BUCKET POLICIES
-- --------------------------

-- Public read for avatars (anyone can view)
CREATE POLICY "avatar_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatar');

-- Authenticated users can upload (their own folder)
CREATE POLICY "avatar_authenticated_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatar' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update own avatars
CREATE POLICY "avatar_authenticated_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatar' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete own avatars
CREATE POLICY "avatar_authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatar' AND
  (storage.foldername(name))[1] = auth.uid()::text
);


-- 2. BOOKIMAGE BUCKET POLICIES
-- ------------------------------

-- Public read for book images
CREATE POLICY "bookimage_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bookImage');

-- Only admins can upload book images
CREATE POLICY "bookimage_admin_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'bookImage' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND type = 'admin'
  )
);

-- Only admins can update book images
CREATE POLICY "bookimage_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'bookImage' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND type = 'admin'
  )
);

-- Only admins can delete book images
CREATE POLICY "bookimage_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'bookImage' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND type = 'admin'
  )
);


-- 3. AUDIOS BUCKET POLICIES
-- --------------------------

-- Public read for audios
CREATE POLICY "audios_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audios');

-- Only admins can upload audios
CREATE POLICY "audios_admin_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audios' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND type = 'admin'
  )
);

-- Only admins can update audios
CREATE POLICY "audios_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'audios' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND type = 'admin'
  )
);

-- Only admins can delete audios
CREATE POLICY "audios_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'audios' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND type = 'admin'
  )
);

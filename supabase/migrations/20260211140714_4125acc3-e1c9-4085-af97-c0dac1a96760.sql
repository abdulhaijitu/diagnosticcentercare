-- Allow admins/managers to upload to avatars bucket
CREATE POLICY "Admins can upload avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  public.is_admin_or_manager(auth.uid())
);

-- Allow admins/managers to update avatars
CREATE POLICY "Admins can update avatars"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  public.is_admin_or_manager(auth.uid())
);

-- Allow admins/managers to delete avatars
CREATE POLICY "Admins can delete avatars"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars' AND
  public.is_admin_or_manager(auth.uid())
);
-- Only staff may manage lesson video objects; students never read the bucket directly
CREATE POLICY "lesson_videos_staff_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'lesson-videos' AND private.is_staff(auth.uid()));
CREATE POLICY "lesson_videos_staff_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lesson-videos' AND private.is_staff(auth.uid()));
CREATE POLICY "lesson_videos_staff_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'lesson-videos' AND private.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'lesson-videos' AND private.is_staff(auth.uid()));
CREATE POLICY "lesson_videos_staff_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'lesson-videos' AND private.is_staff(auth.uid()));

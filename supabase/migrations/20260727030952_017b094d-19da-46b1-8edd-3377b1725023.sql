CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'::public.app_role
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO service_role;

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'profiles',
    'user_roles',
    'children',
    'guardians',
    'trainers',
    'dynamic_courses',
    'quiz_questions',
    'quiz_attempts',
    'course_bookings',
    'free_session_bookings',
    'attendance',
    'homework_submissions',
    'teacher_assignments',
    'teacher_evaluations',
    'learning_paths',
    'skill_scores',
    'student_intelligence',
    'student_projects',
    'students_showcase',
    'parent_reports',
    'parent_testimonials',
    'partners',
    'site_content',
    'site_sections',
    'community_posts',
    'community_comments',
    'community_likes',
    'content_reports',
    'chat_rooms',
    'chat_participants',
    'chat_messages',
    'ai_events',
    'feature_flags',
    'admin_audit_logs',
    'admin_sessions'
  ] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', tbl);
  END LOOP;
END $$;

DO $$
DECLARE
  tbl text;
  policy_name text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'profiles',
    'user_roles',
    'children',
    'guardians',
    'trainers',
    'dynamic_courses',
    'quiz_questions',
    'quiz_attempts',
    'course_bookings',
    'free_session_bookings',
    'attendance',
    'homework_submissions',
    'teacher_assignments',
    'teacher_evaluations',
    'learning_paths',
    'skill_scores',
    'student_intelligence',
    'student_projects',
    'students_showcase',
    'parent_reports',
    'parent_testimonials',
    'partners',
    'site_content',
    'site_sections',
    'community_posts',
    'community_comments',
    'community_likes',
    'content_reports',
    'chat_rooms',
    'chat_participants',
    'chat_messages',
    'ai_events',
    'feature_flags',
    'admin_audit_logs',
    'admin_sessions'
  ] LOOP
    policy_name := 'Admins can manage ' || tbl;
    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = tbl
        AND policyname = policy_name
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()))',
        policy_name,
        tbl
      );
    END IF;
  END LOOP;
END $$;

INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'admin'::public.app_role
FROM public.profiles p
WHERE lower(p.email) = lower('starnacademy.school@gmail.com')
  AND p.role = 'admin'::public.app_role
ON CONFLICT (user_id, role) DO NOTHING;
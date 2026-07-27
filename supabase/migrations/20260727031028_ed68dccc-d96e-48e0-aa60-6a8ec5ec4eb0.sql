CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON SCHEMA private FROM anon;
REVOKE ALL ON SCHEMA private FROM authenticated;

CREATE OR REPLACE FUNCTION private.is_admin(_user_id uuid DEFAULT auth.uid())
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

REVOKE ALL ON FUNCTION private.is_admin(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_admin(uuid) FROM anon;
REVOKE ALL ON FUNCTION private.is_admin(uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin(uuid) TO service_role;

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
    IF EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = tbl
        AND policyname = policy_name
    ) THEN
      EXECUTE format('DROP POLICY %I ON public.%I', policy_name, tbl);
    END IF;

    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (private.is_admin(auth.uid())) WITH CHECK (private.is_admin(auth.uid()))',
      policy_name,
      tbl
    );
  END LOOP;
END $$;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM authenticated;
DROP FUNCTION IF EXISTS public.is_admin(uuid);
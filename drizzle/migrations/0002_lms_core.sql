-- ============ helpers ============
CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin'::app_role,'super_admin'::app_role,'manager'::app_role,'trainer'::app_role)
  );
$$;
GRANT EXECUTE ON FUNCTION private.is_staff(uuid) TO authenticated;

-- ============ course modules ============
CREATE TABLE IF NOT EXISTS public.course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.dynamic_courses(id) ON DELETE CASCADE,
  title_ar text NOT NULL,
  title_en text,
  description_ar text,
  description_en text,
  display_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON public.course_modules(course_id, display_order);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_modules TO authenticated;
GRANT SELECT ON public.course_modules TO anon;
GRANT ALL ON public.course_modules TO service_role;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules_public_read" ON public.course_modules FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "modules_staff_all" ON public.course_modules FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE TRIGGER trg_course_modules_upd BEFORE UPDATE ON public.course_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ enrollments ============
CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.dynamic_courses(id) ON DELETE CASCADE,
  learning_mode text NOT NULL DEFAULT 'offline',
  status text NOT NULL DEFAULT 'active',
  started_on date NOT NULL DEFAULT CURRENT_DATE,
  ends_on date,
  source text NOT NULL DEFAULT 'admin',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id, status);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enrollments_select_scoped" ON public.enrollments FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR private.is_staff(auth.uid()) OR private.is_guardian_of(student_id));
CREATE POLICY "enrollments_staff_write" ON public.enrollments FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE TRIGGER trg_enrollments_upd BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION private.is_enrolled(_course_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE course_id = _course_id AND student_id = _user_id AND status = 'active'
  );
$$;
GRANT EXECUTE ON FUNCTION private.is_enrolled(uuid, uuid) TO authenticated;

-- ============ lessons ============
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.dynamic_courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES public.course_modules(id) ON DELETE SET NULL,
  lesson_number integer NOT NULL DEFAULT 1,
  title_ar text NOT NULL,
  title_en text,
  description_ar text,
  description_en text,
  objectives_ar text[] NOT NULL DEFAULT '{}',
  thumbnail_url text,
  instructor_id uuid,
  duration_minutes integer,
  content_kind text NOT NULL DEFAULT 'none',
  content_path text,
  status text NOT NULL DEFAULT 'draft',
  release_rule text NOT NULL DEFAULT 'manual',
  release_at timestamptz,
  is_preview boolean NOT NULL DEFAULT false,
  preview_summary_ar text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.lessons(course_id, display_order);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id, display_order);
CREATE INDEX IF NOT EXISTS idx_lessons_status ON public.lessons(status, release_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT SELECT ON public.lessons TO anon;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_lesson_released(_status text, _release_rule text, _release_at timestamptz)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT _status = 'published' AND (_release_at IS NULL OR _release_at <= now());
$$;
REVOKE ALL ON FUNCTION public.is_lesson_released(text, text, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_lesson_released(text, text, timestamptz) TO authenticated, anon, service_role;

-- visitors/non-enrolled: only preview lessons, and clients must not read content_path (enforced in app layer + signed url function)
CREATE POLICY "lessons_preview_read" ON public.lessons FOR SELECT TO anon, authenticated
  USING (is_preview = true AND status IN ('published','scheduled'));
CREATE POLICY "lessons_enrolled_read" ON public.lessons FOR SELECT TO authenticated
  USING (
    private.is_enrolled(course_id, auth.uid())
    AND status = 'published'
    AND (release_at IS NULL OR release_at <= now())
  );
CREATE POLICY "lessons_staff_all" ON public.lessons FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE TRIGGER trg_lessons_upd BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION private.can_access_lesson(_lesson_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.lessons l
    WHERE l.id = _lesson_id
      AND (
        private.is_staff(_user_id)
        OR (
          l.status = 'published'
          AND (l.release_at IS NULL OR l.release_at <= now())
          AND private.is_enrolled(l.course_id, _user_id)
        )
      )
  );
$$;
GRANT EXECUTE ON FUNCTION private.can_access_lesson(uuid, uuid) TO authenticated;

-- ============ lesson progress ============
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.dynamic_courses(id) ON DELETE CASCADE,
  state text NOT NULL DEFAULT 'in_progress',
  progress_percent numeric NOT NULL DEFAULT 0,
  last_position_seconds integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON public.lesson_progress(student_id, course_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_select_scoped" ON public.lesson_progress FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR private.is_staff(auth.uid()) OR private.is_guardian_of(student_id));
CREATE POLICY "progress_student_write" ON public.lesson_progress FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() AND private.can_access_lesson(lesson_id, auth.uid()));
CREATE POLICY "progress_student_update" ON public.lesson_progress FOR UPDATE TO authenticated
  USING (student_id = auth.uid() OR private.is_staff(auth.uid()))
  WITH CHECK (student_id = auth.uid() OR private.is_staff(auth.uid()));
CREATE POLICY "progress_staff_delete" ON public.lesson_progress FOR DELETE TO authenticated
  USING (private.is_staff(auth.uid()));
CREATE TRIGGER trg_lesson_progress_upd BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ lesson resources (teacher files) ============
CREATE TABLE IF NOT EXISTS public.lesson_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.dynamic_courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  kind text NOT NULL DEFAULT 'file',
  storage_path text,
  external_url text,
  mime_type text,
  size_bytes bigint,
  visibility text NOT NULL DEFAULT 'enrolled',
  version integer NOT NULL DEFAULT 1,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_lesson ON public.lesson_resources(lesson_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_resources TO authenticated;
GRANT ALL ON public.lesson_resources TO service_role;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resources_select_enrolled" ON public.lesson_resources FOR SELECT TO authenticated
  USING (private.can_access_lesson(lesson_id, auth.uid()));
CREATE POLICY "resources_staff_all" ON public.lesson_resources FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- ============ live sessions ============
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.dynamic_courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  instructor_id uuid,
  title text NOT NULL,
  description text,
  scheduled_date date,
  starts_at timestamptz,
  ends_at timestamptz,
  provider text NOT NULL DEFAULT 'none',
  meeting_url text,
  status text NOT NULL DEFAULT 'scheduled',
  recording_url text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_live_sessions_course ON public.live_sessions(course_id, starts_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_sessions TO authenticated;
GRANT ALL ON public.live_sessions TO service_role;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "live_select_enrolled" ON public.live_sessions FOR SELECT TO authenticated
  USING (private.is_enrolled(course_id, auth.uid()) OR private.is_staff(auth.uid()));
CREATE POLICY "live_staff_all" ON public.live_sessions FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE TRIGGER trg_live_sessions_upd BEFORE UPDATE ON public.live_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ assignments & submissions ============
CREATE TABLE IF NOT EXISTS public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.dynamic_courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_at timestamptz,
  max_score numeric NOT NULL DEFAULT 100,
  status text NOT NULL DEFAULT 'published',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON public.assignments(course_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignments TO authenticated;
GRANT ALL ON public.assignments TO service_role;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignments_select_enrolled" ON public.assignments FOR SELECT TO authenticated
  USING ((status = 'published' AND private.is_enrolled(course_id, auth.uid())) OR private.is_staff(auth.uid()));
CREATE POLICY "assignments_staff_all" ON public.assignments FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE TRIGGER trg_assignments_upd BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text,
  storage_path text,
  mime_type text,
  size_bytes bigint,
  status text NOT NULL DEFAULT 'submitted',
  score numeric,
  feedback text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions(student_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions_select_scoped" ON public.submissions FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR private.is_staff(auth.uid()) OR private.is_guardian_of(student_id));
CREATE POLICY "submissions_student_insert" ON public.submissions FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());
CREATE POLICY "submissions_update_scoped" ON public.submissions FOR UPDATE TO authenticated
  USING (student_id = auth.uid() OR private.is_staff(auth.uid()))
  WITH CHECK (student_id = auth.uid() OR private.is_staff(auth.uid()));
CREATE POLICY "submissions_staff_delete" ON public.submissions FOR DELETE TO authenticated
  USING (private.is_staff(auth.uid()));
CREATE TRIGGER trg_submissions_upd BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ lesson discussion ============
CREATE TABLE IF NOT EXISTS public.lesson_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.lesson_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  is_answered boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lesson_comments_lesson ON public.lesson_comments(lesson_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_comments TO authenticated;
GRANT ALL ON public.lesson_comments TO service_role;
ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select_enrolled" ON public.lesson_comments FOR SELECT TO authenticated
  USING (private.can_access_lesson(lesson_id, auth.uid()));
CREATE POLICY "comments_insert_own" ON public.lesson_comments FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND private.can_access_lesson(lesson_id, auth.uid()));
CREATE POLICY "comments_update_own_or_staff" ON public.lesson_comments FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR private.is_staff(auth.uid()))
  WITH CHECK (user_id = auth.uid() OR private.is_staff(auth.uid()));
CREATE POLICY "comments_delete_own_or_staff" ON public.lesson_comments FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR private.is_staff(auth.uid()));
CREATE TRIGGER trg_lesson_comments_upd BEFORE UPDATE ON public.lesson_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ notifications ============
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  link text,
  kind text NOT NULL DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.is_staff(auth.uid()));
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications_staff_write" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "notifications_staff_delete" ON public.notifications FOR DELETE TO authenticated
  USING (private.is_staff(auth.uid()) OR user_id = auth.uid());
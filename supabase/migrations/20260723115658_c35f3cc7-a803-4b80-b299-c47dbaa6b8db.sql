
-- Helper functions
CREATE OR REPLACE FUNCTION public.is_guardian_of(_child_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.children c
    JOIN public.guardians g
      ON g.id = c.primary_guardian_id OR g.id = c.backup_guardian_id
    WHERE c.user_id = _child_user_id AND g.user_id = auth.uid()
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_guardian_of(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_guardian_of(uuid) TO authenticated;

-- 1. teacher_assignments
CREATE TABLE public.teacher_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.dynamic_courses(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  assigned_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_assignments TO authenticated;
GRANT ALL ON public.teacher_assignments TO service_role;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage assignments" ON public.teacher_assignments
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers see own assignments" ON public.teacher_assignments
  FOR SELECT TO authenticated USING (teacher_id = auth.uid());
CREATE POLICY "Students see own assignments" ON public.teacher_assignments
  FOR SELECT TO authenticated USING (student_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_assigned_teacher(_student_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teacher_assignments
    WHERE teacher_id = auth.uid() AND student_id = _student_id AND is_active = true
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_assigned_teacher(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_assigned_teacher(uuid) TO authenticated;

-- 2. placement_assessments
CREATE TABLE public.placement_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  age int,
  prior_experience text,
  self_confidence int CHECK (self_confidence BETWEEN 1 AND 10),
  target_course text,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  dimension_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommended_level text,
  recommended_course_key text,
  recommended_course_id uuid REFERENCES public.dynamic_courses(id) ON DELETE SET NULL,
  roadmap jsonb NOT NULL DEFAULT '[]'::jsonb,
  strengths text[] NOT NULL DEFAULT '{}',
  weaknesses text[] NOT NULL DEFAULT '{}',
  prerequisites text[] NOT NULL DEFAULT '{}',
  expected_duration_weeks int,
  confidence numeric(4,2),
  reasoning text,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.placement_assessments TO authenticated;
GRANT ALL ON public.placement_assessments TO service_role;
ALTER TABLE public.placement_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own placements" ON public.placement_assessments
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());
CREATE POLICY "Guardians view child placements" ON public.placement_assessments
  FOR SELECT TO authenticated USING (public.is_guardian_of(student_id));
CREATE POLICY "Teachers view assigned placements" ON public.placement_assessments
  FOR SELECT TO authenticated USING (public.is_assigned_teacher(student_id));
CREATE POLICY "Admins manage all placements" ON public.placement_assessments
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 3. student_intelligence
CREATE TABLE public.student_intelligence (
  student_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_course_id uuid REFERENCES public.dynamic_courses(id) ON DELETE SET NULL,
  current_level text,
  completed_courses jsonb NOT NULL DEFAULT '[]'::jsonb,
  course_progress numeric(5,2) NOT NULL DEFAULT 0,
  logical_thinking_score numeric(5,2) NOT NULL DEFAULT 0,
  problem_solving_score numeric(5,2) NOT NULL DEFAULT 0,
  creativity_score numeric(5,2) NOT NULL DEFAULT 0,
  communication_score numeric(5,2) NOT NULL DEFAULT 0,
  teamwork_score numeric(5,2) NOT NULL DEFAULT 0,
  presentation_score numeric(5,2) NOT NULL DEFAULT 0,
  programming_score numeric(5,2) NOT NULL DEFAULT 0,
  ai_score numeric(5,2) NOT NULL DEFAULT 0,
  learning_speed numeric(5,2) NOT NULL DEFAULT 0,
  consistency_score numeric(5,2) NOT NULL DEFAULT 0,
  predicted_success_rate numeric(5,2) NOT NULL DEFAULT 0,
  risk_indicators text[] NOT NULL DEFAULT '{}',
  strengths text[] NOT NULL DEFAULT '{}',
  weaknesses text[] NOT NULL DEFAULT '{}',
  recommended_improvements text[] NOT NULL DEFAULT '{}',
  next_recommended_course_id uuid REFERENCES public.dynamic_courses(id) ON DELETE SET NULL,
  badges jsonb NOT NULL DEFAULT '[]'::jsonb,
  achievements jsonb NOT NULL DEFAULT '[]'::jsonb,
  milestones jsonb NOT NULL DEFAULT '[]'::jsonb,
  ai_narrative text,
  ai_narrative_updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_intelligence TO authenticated;
GRANT ALL ON public.student_intelligence TO service_role;
ALTER TABLE public.student_intelligence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own intelligence" ON public.student_intelligence
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Guardians view child intelligence" ON public.student_intelligence
  FOR SELECT TO authenticated USING (public.is_guardian_of(student_id));
CREATE POLICY "Teachers view assigned intelligence" ON public.student_intelligence
  FOR SELECT TO authenticated USING (public.is_assigned_teacher(student_id));
CREATE POLICY "Admins manage all intelligence" ON public.student_intelligence
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 4. skill_scores
CREATE TABLE public.skill_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill text NOT NULL,
  score numeric(5,2) NOT NULL,
  source text NOT NULL,
  source_id uuid,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX skill_scores_student_recorded_idx ON public.skill_scores (student_id, recorded_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_scores TO authenticated;
GRANT ALL ON public.skill_scores TO service_role;
ALTER TABLE public.skill_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own scores" ON public.skill_scores
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Guardians view child scores" ON public.skill_scores
  FOR SELECT TO authenticated USING (public.is_guardian_of(student_id));
CREATE POLICY "Teachers view assigned scores" ON public.skill_scores
  FOR SELECT TO authenticated USING (public.is_assigned_teacher(student_id));
CREATE POLICY "Teachers insert assigned scores" ON public.skill_scores
  FOR INSERT TO authenticated WITH CHECK (public.is_assigned_teacher(student_id));
CREATE POLICY "Admins manage all scores" ON public.skill_scores
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 5. learning_paths
CREATE TABLE public.learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.dynamic_courses(id) ON DELETE SET NULL,
  title text NOT NULL,
  stages jsonb NOT NULL DEFAULT '[]'::jsonb,
  current_stage_index int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  eta_weeks int,
  source text NOT NULL DEFAULT 'ai',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX learning_paths_student_idx ON public.learning_paths (student_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_paths TO authenticated;
GRANT ALL ON public.learning_paths TO service_role;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own paths" ON public.learning_paths
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Guardians view child paths" ON public.learning_paths
  FOR SELECT TO authenticated USING (public.is_guardian_of(student_id));
CREATE POLICY "Teachers view assigned paths" ON public.learning_paths
  FOR SELECT TO authenticated USING (public.is_assigned_teacher(student_id));
CREATE POLICY "Admins manage all paths" ON public.learning_paths
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 6. teacher_evaluations
CREATE TABLE public.teacher_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.dynamic_courses(id) ON DELETE SET NULL,
  overall_rating int CHECK (overall_rating BETWEEN 1 AND 10),
  skill_ratings jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  visible_to_parent boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX teacher_evaluations_student_idx ON public.teacher_evaluations (student_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_evaluations TO authenticated;
GRANT ALL ON public.teacher_evaluations TO service_role;
ALTER TABLE public.teacher_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own evaluations" ON public.teacher_evaluations
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Guardians view child evaluations" ON public.teacher_evaluations
  FOR SELECT TO authenticated USING (visible_to_parent = true AND public.is_guardian_of(student_id));
CREATE POLICY "Teachers manage own evaluations" ON public.teacher_evaluations
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid() AND public.is_assigned_teacher(student_id))
  WITH CHECK (teacher_id = auth.uid() AND public.is_assigned_teacher(student_id));
CREATE POLICY "Admins manage all evaluations" ON public.teacher_evaluations
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 7. attendance
CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.dynamic_courses(id) ON DELETE SET NULL,
  session_date date NOT NULL,
  status text NOT NULL DEFAULT 'present',
  notes text,
  recorded_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, session_date, course_id)
);
CREATE INDEX attendance_student_idx ON public.attendance (student_id, session_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own attendance" ON public.attendance
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Guardians view child attendance" ON public.attendance
  FOR SELECT TO authenticated USING (public.is_guardian_of(student_id));
CREATE POLICY "Teachers manage assigned attendance" ON public.attendance
  FOR ALL TO authenticated
  USING (public.is_assigned_teacher(student_id))
  WITH CHECK (public.is_assigned_teacher(student_id));
CREATE POLICY "Admins manage all attendance" ON public.attendance
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 8. homework_submissions
CREATE TABLE public.homework_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.dynamic_courses(id) ON DELETE SET NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'assigned',
  score numeric(5,2),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  feedback text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX homework_student_idx ON public.homework_submissions (student_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homework_submissions TO authenticated;
GRANT ALL ON public.homework_submissions TO service_role;
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own homework" ON public.homework_submissions
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Students update own homework" ON public.homework_submissions
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());
CREATE POLICY "Guardians view child homework" ON public.homework_submissions
  FOR SELECT TO authenticated USING (public.is_guardian_of(student_id));
CREATE POLICY "Teachers manage assigned homework" ON public.homework_submissions
  FOR ALL TO authenticated
  USING (public.is_assigned_teacher(student_id))
  WITH CHECK (public.is_assigned_teacher(student_id));
CREATE POLICY "Admins manage all homework" ON public.homework_submissions
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 9. parent_reports
CREATE TABLE public.parent_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  summary text NOT NULL,
  what_happened text,
  why_it_happened text,
  improvements text,
  support_areas text,
  home_actions text,
  next_milestone text,
  risk_alerts text[] NOT NULL DEFAULT '{}',
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX parent_reports_student_idx ON public.parent_reports (student_id, period_end DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parent_reports TO authenticated;
GRANT ALL ON public.parent_reports TO service_role;
ALTER TABLE public.parent_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own reports" ON public.parent_reports
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Guardians view child reports" ON public.parent_reports
  FOR SELECT TO authenticated USING (public.is_guardian_of(student_id));
CREATE POLICY "Teachers view assigned reports" ON public.parent_reports
  FOR SELECT TO authenticated USING (public.is_assigned_teacher(student_id));
CREATE POLICY "Admins manage all reports" ON public.parent_reports
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 10. ai_events
CREATE TABLE public.ai_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id),
  module text NOT NULL,
  action text NOT NULL,
  inputs jsonb NOT NULL DEFAULT '{}'::jsonb,
  output jsonb NOT NULL DEFAULT '{}'::jsonb,
  reasoning text,
  model text,
  overridden boolean NOT NULL DEFAULT false,
  override_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ai_events_student_idx ON public.ai_events (student_id, created_at DESC);
CREATE INDEX ai_events_module_idx ON public.ai_events (module, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_events TO authenticated;
GRANT ALL ON public.ai_events TO service_role;
ALTER TABLE public.ai_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own ai events" ON public.ai_events
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Guardians view child ai events" ON public.ai_events
  FOR SELECT TO authenticated USING (student_id IS NOT NULL AND public.is_guardian_of(student_id));
CREATE POLICY "Admins manage all ai events" ON public.ai_events
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- updated_at triggers
CREATE TRIGGER trg_teacher_assignments_upd BEFORE UPDATE ON public.teacher_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_placement_assessments_upd BEFORE UPDATE ON public.placement_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_student_intelligence_upd BEFORE UPDATE ON public.student_intelligence
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_learning_paths_upd BEFORE UPDATE ON public.learning_paths
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_teacher_evaluations_upd BEFORE UPDATE ON public.teacher_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_homework_submissions_upd BEFORE UPDATE ON public.homework_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add dimension tag to quiz_questions for placement AI
ALTER TABLE public.quiz_questions
  ADD COLUMN IF NOT EXISTS dimension text;

-- Auto-create empty student_intelligence row on new profile (children only)
CREATE OR REPLACE FUNCTION public.ensure_student_intelligence()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.role = 'child'::app_role THEN
    INSERT INTO public.student_intelligence (student_id)
    VALUES (NEW.id)
    ON CONFLICT (student_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.ensure_student_intelligence() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER trg_profiles_ensure_intelligence
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.ensure_student_intelligence();

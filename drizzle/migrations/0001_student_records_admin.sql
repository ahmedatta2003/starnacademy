-- Extra profile fields (all additive & nullable)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS governorate text,
  ADD COLUMN IF NOT EXISTS school_name text,
  ADD COLUMN IF NOT EXISTS grade_level text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- Link showcase projects to real student accounts
ALTER TABLE public.student_projects
  ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_student_projects_profile ON public.student_projects(profile_id);

-- Grades
CREATE TABLE IF NOT EXISTS public.student_grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.dynamic_courses(id) ON DELETE SET NULL,
  title text NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  max_score numeric NOT NULL DEFAULT 100,
  graded_on date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_student_grades_student ON public.student_grades(student_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_grades TO authenticated;
GRANT ALL ON public.student_grades TO service_role;

ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "grades_select_own_or_staff" ON public.student_grades
  FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR private.is_admin(auth.uid())
    OR private.has_role(auth.uid(), 'manager'::app_role)
    OR private.has_role(auth.uid(), 'trainer'::app_role)
    OR private.is_guardian_of(student_id)
  );

CREATE POLICY "grades_insert_staff" ON public.student_grades
  FOR INSERT TO authenticated
  WITH CHECK (
    private.is_admin(auth.uid())
    OR private.has_role(auth.uid(), 'manager'::app_role)
    OR private.has_role(auth.uid(), 'trainer'::app_role)
  );

CREATE POLICY "grades_update_staff" ON public.student_grades
  FOR UPDATE TO authenticated
  USING (
    private.is_admin(auth.uid())
    OR private.has_role(auth.uid(), 'manager'::app_role)
    OR private.has_role(auth.uid(), 'trainer'::app_role)
  );

CREATE POLICY "grades_delete_staff" ON public.student_grades
  FOR DELETE TO authenticated
  USING (
    private.is_admin(auth.uid())
    OR private.has_role(auth.uid(), 'manager'::app_role)
  );

CREATE TRIGGER trg_student_grades_upd BEFORE UPDATE ON public.student_grades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
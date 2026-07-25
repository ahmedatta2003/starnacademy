
-- Move SECURITY DEFINER helpers out of the exposed public API schema into private
CREATE OR REPLACE FUNCTION private.is_guardian_of(_child_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.children c
    JOIN public.guardians g ON g.id = c.primary_guardian_id OR g.id = c.backup_guardian_id
    WHERE c.user_id = _child_user_id AND g.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION private.is_assigned_teacher(_student_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teacher_assignments
    WHERE teacher_id = auth.uid() AND student_id = _student_id AND is_active = true
  );
$$;

REVOKE ALL ON FUNCTION private.is_guardian_of(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_assigned_teacher(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_guardian_of(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_assigned_teacher(uuid) TO authenticated, service_role;

-- Recreate policies to use private.* helpers
DROP POLICY IF EXISTS "Teachers view assigned scores" ON public.skill_scores;
DROP POLICY IF EXISTS "Teachers insert assigned scores" ON public.skill_scores;
DROP POLICY IF EXISTS "Guardians view child scores" ON public.skill_scores;
CREATE POLICY "Teachers view assigned scores" ON public.skill_scores FOR SELECT USING (private.is_assigned_teacher(student_id));
CREATE POLICY "Teachers insert assigned scores" ON public.skill_scores FOR INSERT WITH CHECK (private.is_assigned_teacher(student_id));
CREATE POLICY "Guardians view child scores" ON public.skill_scores FOR SELECT USING (private.is_guardian_of(student_id));

DROP POLICY IF EXISTS "Guardians view child paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Teachers view assigned paths" ON public.learning_paths;
CREATE POLICY "Guardians view child paths" ON public.learning_paths FOR SELECT USING (private.is_guardian_of(student_id));
CREATE POLICY "Teachers view assigned paths" ON public.learning_paths FOR SELECT USING (private.is_assigned_teacher(student_id));

DROP POLICY IF EXISTS "Guardians view child evaluations" ON public.teacher_evaluations;
DROP POLICY IF EXISTS "Teachers manage own evaluations" ON public.teacher_evaluations;
CREATE POLICY "Guardians view child evaluations" ON public.teacher_evaluations FOR SELECT USING (visible_to_parent = true AND private.is_guardian_of(student_id));
CREATE POLICY "Teachers manage own evaluations" ON public.teacher_evaluations FOR ALL USING (teacher_id = auth.uid() AND private.is_assigned_teacher(student_id)) WITH CHECK (teacher_id = auth.uid() AND private.is_assigned_teacher(student_id));

DROP POLICY IF EXISTS "Guardians view child attendance" ON public.attendance;
DROP POLICY IF EXISTS "Teachers manage assigned attendance" ON public.attendance;
CREATE POLICY "Guardians view child attendance" ON public.attendance FOR SELECT USING (private.is_guardian_of(student_id));
CREATE POLICY "Teachers manage assigned attendance" ON public.attendance FOR ALL USING (private.is_assigned_teacher(student_id)) WITH CHECK (private.is_assigned_teacher(student_id));

DROP POLICY IF EXISTS "Guardians view child placements" ON public.placement_assessments;
DROP POLICY IF EXISTS "Teachers view assigned placements" ON public.placement_assessments;
CREATE POLICY "Guardians view child placements" ON public.placement_assessments FOR SELECT USING (private.is_guardian_of(student_id));
CREATE POLICY "Teachers view assigned placements" ON public.placement_assessments FOR SELECT USING (private.is_assigned_teacher(student_id));

DROP POLICY IF EXISTS "Guardians view child intelligence" ON public.student_intelligence;
DROP POLICY IF EXISTS "Teachers view assigned intelligence" ON public.student_intelligence;
CREATE POLICY "Guardians view child intelligence" ON public.student_intelligence FOR SELECT USING (private.is_guardian_of(student_id));
CREATE POLICY "Teachers view assigned intelligence" ON public.student_intelligence FOR SELECT USING (private.is_assigned_teacher(student_id));

DROP POLICY IF EXISTS "Guardians view child homework" ON public.homework_submissions;
DROP POLICY IF EXISTS "Teachers manage assigned homework" ON public.homework_submissions;
CREATE POLICY "Guardians view child homework" ON public.homework_submissions FOR SELECT USING (private.is_guardian_of(student_id));
CREATE POLICY "Teachers manage assigned homework" ON public.homework_submissions FOR ALL USING (private.is_assigned_teacher(student_id)) WITH CHECK (private.is_assigned_teacher(student_id));

DROP POLICY IF EXISTS "Guardians view child reports" ON public.parent_reports;
DROP POLICY IF EXISTS "Teachers view assigned reports" ON public.parent_reports;
CREATE POLICY "Guardians view child reports" ON public.parent_reports FOR SELECT USING (private.is_guardian_of(student_id));
CREATE POLICY "Teachers view assigned reports" ON public.parent_reports FOR SELECT USING (private.is_assigned_teacher(student_id));

DROP POLICY IF EXISTS "Guardians view child ai events" ON public.ai_events;
CREATE POLICY "Guardians view child ai events" ON public.ai_events FOR SELECT USING (student_id IS NOT NULL AND private.is_guardian_of(student_id));

-- Drop the public copies now that nothing references them
DROP FUNCTION IF EXISTS public.is_guardian_of(uuid);
DROP FUNCTION IF EXISTS public.is_assigned_teacher(uuid);

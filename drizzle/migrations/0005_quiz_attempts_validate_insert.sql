DROP POLICY IF EXISTS "Anyone can create attempts" ON public.quiz_attempts;
CREATE POLICY "Anyone can create attempts" ON public.quiz_attempts
  FOR INSERT TO anon, authenticated WITH CHECK (
    length(btrim(examinee_name)) BETWEEN 1 AND 120
    AND examinee_age BETWEEN 4 AND 25
    AND length(chosen_course) BETWEEN 1 AND 100
    AND total_questions BETWEEN 1 AND 100
    AND score BETWEEN 0 AND total_questions
    AND (final_level IS NULL OR length(final_level) <= 50)
    AND (recommended_course IS NULL OR length(recommended_course) <= 100)
  );
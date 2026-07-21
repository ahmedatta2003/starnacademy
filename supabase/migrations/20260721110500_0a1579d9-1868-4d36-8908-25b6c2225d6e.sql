-- 1) Lock down SECURITY DEFINER function EXECUTE grants
-- handle_new_user is a trigger function; nobody should call it via API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- check_quiz_answer: revoke from anon; students (authenticated) still need it
REVOKE ALL ON FUNCTION public.check_quiz_answer(uuid, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_quiz_answer(uuid, integer) TO authenticated;

-- 2) Column-level revoke on quiz_questions answer key + explanations
-- Defense-in-depth: even if a future GRANT is added to anon/authenticated,
-- the answer key columns remain inaccessible via direct table queries.
REVOKE SELECT (correct_option, explanation_ar, explanation_en)
  ON public.quiz_questions FROM PUBLIC, anon, authenticated;
-- Revoke EXECUTE on SECURITY DEFINER function from exposed roles.
-- Answer checking is now performed via the check-quiz-answer edge function
-- which uses the service role.
REVOKE EXECUTE ON FUNCTION public.check_quiz_answer(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_quiz_answer(uuid, integer) TO service_role;

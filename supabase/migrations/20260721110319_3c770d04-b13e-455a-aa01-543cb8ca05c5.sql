-- 1) Signup role escalation: hardcode safe default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
  requested_role text;
  super_admin_email text := 'starnacademy.school@gmail.com';
BEGIN
  requested_role := NEW.raw_user_meta_data->>'role';

  IF lower(NEW.email) = lower(super_admin_email) THEN
    user_role := 'admin'::app_role;
  ELSIF requested_role = 'guardian' THEN
    -- Only allow non-privileged self-selection between child/guardian
    user_role := 'guardian'::app_role;
  ELSE
    user_role := 'child'::app_role;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    user_role
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);

  RETURN NEW;
END;
$function$;

-- 2) Chat policies: use SECURITY DEFINER helper to avoid recursion + broken correlation
CREATE OR REPLACE FUNCTION private.is_room_participant(_room uuid, _user uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_participants
    WHERE room_id = _room AND user_id = _user
  );
$$;

DROP POLICY IF EXISTS "Participants can view their rooms" ON public.chat_rooms;
CREATE POLICY "Participants can view their rooms"
ON public.chat_rooms
FOR SELECT
USING (private.is_room_participant(id, auth.uid()));

DROP POLICY IF EXISTS "Participants can view room members" ON public.chat_participants;
CREATE POLICY "Participants can view room members"
ON public.chat_participants
FOR SELECT
USING (private.is_room_participant(room_id, auth.uid()));

-- 3) Quiz answer key exposure: remove public SELECT on base table.
-- Public reads go through the quiz_questions_public view; answer checking via check_quiz_answer RPC.
DROP POLICY IF EXISTS "Anyone can view visible questions" ON public.quiz_questions;
CREATE POLICY "Admins can view all questions"
ON public.quiz_questions
FOR SELECT
USING (private.has_role(auth.uid(), 'admin'::app_role));
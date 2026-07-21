
-- 1. Fix chat_participants SELECT policy
DROP POLICY IF EXISTS "Participants can view room members" ON public.chat_participants;
CREATE POLICY "Participants can view room members"
ON public.chat_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_participants cp
    WHERE cp.room_id = chat_participants.room_id AND cp.user_id = auth.uid()
  )
);

-- 2. Fix chat_rooms SELECT policy
DROP POLICY IF EXISTS "Participants can view their rooms" ON public.chat_rooms;
CREATE POLICY "Participants can view their rooms"
ON public.chat_rooms FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_participants cp
    WHERE cp.room_id = chat_rooms.id AND cp.user_id = auth.uid()
  )
);

-- 3. Restrict chat_participants INSERT
ALTER TABLE public.chat_rooms ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.chat_rooms ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

DROP POLICY IF EXISTS "Users can join rooms" ON public.chat_participants;
CREATE POLICY "Users can join public rooms"
ON public.chat_participants FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.chat_rooms r
    WHERE r.id = chat_participants.room_id
      AND (r.is_public = true OR r.created_by = auth.uid())
  )
);

CREATE POLICY "Room creators can add participants"
ON public.chat_participants FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_rooms r
    WHERE r.id = chat_participants.room_id AND r.created_by = auth.uid()
  )
);

-- 4. community_comments UPDATE
CREATE POLICY "Users can update their own comments"
ON public.community_comments FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. profiles UPDATE: prevent role self-escalation
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- 6. quiz_questions: hide sensitive columns
CREATE OR REPLACE VIEW public.quiz_questions_public
WITH (security_invoker = true)
AS
SELECT id, course, difficulty, min_age, max_age, is_visible, display_order,
       question_ar, question_en,
       option_1_ar, option_2_ar, option_3_ar, option_4_ar,
       option_1_en, option_2_en, option_3_en, option_4_en,
       created_at, updated_at
FROM public.quiz_questions;

GRANT SELECT ON public.quiz_questions_public TO anon, authenticated;

REVOKE SELECT (correct_option, explanation_ar, explanation_en) ON public.quiz_questions FROM authenticated;
REVOKE SELECT (correct_option, explanation_ar, explanation_en) ON public.quiz_questions FROM anon;

CREATE OR REPLACE FUNCTION public.check_quiz_answer(_question_id uuid, _chosen integer)
RETURNS TABLE(is_correct boolean, correct_option integer, explanation_ar text, explanation_en text)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT (q.correct_option = _chosen) AS is_correct,
         q.correct_option,
         q.explanation_ar,
         q.explanation_en
  FROM public.quiz_questions q
  WHERE q.id = _question_id AND q.is_visible = true;
$$;

GRANT EXECUTE ON FUNCTION public.check_quiz_answer(uuid, integer) TO anon, authenticated;

-- 7. Realtime: remove chat_messages from public realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.chat_messages;

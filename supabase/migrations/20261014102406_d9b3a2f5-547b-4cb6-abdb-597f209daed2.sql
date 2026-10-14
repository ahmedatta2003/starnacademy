CREATE TABLE public.lesson_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL DEFAULT auth.uid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 8000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX lesson_chat_messages_owner_idx ON public.lesson_chat_messages (student_id, lesson_id, created_at);
ALTER TABLE public.lesson_chat_messages ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON public.lesson_chat_messages TO authenticated;
CREATE POLICY "Students read own lesson chat" ON public.lesson_chat_messages FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Students add own lesson chat" ON public.lesson_chat_messages FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students clear own lesson chat" ON public.lesson_chat_messages FOR DELETE TO authenticated USING (student_id = auth.uid());
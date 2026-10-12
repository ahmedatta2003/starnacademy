ALTER TABLE public.chat_rooms ALTER COLUMN created_by SET DEFAULT auth.uid();
DROP POLICY IF EXISTS "Authenticated users can create rooms" ON public.chat_rooms;
CREATE POLICY "Authenticated users can create rooms" ON public.chat_rooms
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
DROP POLICY IF EXISTS "flags readable" ON public.feature_flags;
CREATE POLICY "flags readable by authenticated" ON public.feature_flags FOR SELECT TO authenticated USING (true);
REVOKE ALL ON public.feature_flags FROM anon;
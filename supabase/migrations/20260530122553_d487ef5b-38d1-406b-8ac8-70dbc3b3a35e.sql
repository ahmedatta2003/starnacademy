
-- 1) Tighten profiles SELECT: own profile + admins only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view own or admin profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Add DELETE policies
CREATE POLICY "Users can delete own profile"
ON public.profiles FOR DELETE
TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Guardians can delete own data"
ON public.guardians FOR DELETE
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Guardians or admins can delete children"
ON public.children FOR DELETE
TO authenticated
USING (
  primary_guardian_id IN (SELECT id FROM public.guardians WHERE user_id = auth.uid())
  OR backup_guardian_id IN (SELECT id FROM public.guardians WHERE user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- 3) Create course_bookings table for the Booking page (replaces user-configurable webhook)
CREATE TABLE public.course_bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_name text NOT NULL,
  child_name text NOT NULL,
  phone text NOT NULL,
  email text,
  region text NOT NULL,
  child_age integer NOT NULL,
  school_type text NOT NULL,
  course text NOT NULL,
  preferred_time text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.course_bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.course_bookings TO authenticated;
GRANT ALL ON public.course_bookings TO service_role;

ALTER TABLE public.course_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create course bookings"
ON public.course_bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view course bookings"
ON public.course_bookings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update course bookings"
ON public.course_bookings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete course bookings"
ON public.course_bookings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_course_bookings_updated_at
BEFORE UPDATE ON public.course_bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

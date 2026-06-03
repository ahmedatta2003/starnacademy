
-- 1. Create private schema not exposed by PostgREST
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, anon, service_role;

-- 2. Recreate has_role in private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon, service_role;

-- 3. Recreate all policies to reference private.has_role
-- public.children
DROP POLICY IF EXISTS "Guardians or admins can delete children" ON public.children;
CREATE POLICY "Guardians or admins can delete children" ON public.children
FOR DELETE TO authenticated
USING ((primary_guardian_id IN (SELECT guardians.id FROM guardians WHERE guardians.user_id = auth.uid()))
   OR (backup_guardian_id IN (SELECT guardians.id FROM guardians WHERE guardians.user_id = auth.uid()))
   OR private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Children and their guardians can view child data" ON public.children;
CREATE POLICY "Children and their guardians can view child data" ON public.children
FOR SELECT TO authenticated
USING ((user_id = auth.uid())
   OR (primary_guardian_id IN (SELECT guardians.id FROM guardians WHERE guardians.user_id = auth.uid()))
   OR (backup_guardian_id IN (SELECT guardians.id FROM guardians WHERE guardians.user_id = auth.uid()))
   OR private.has_role(auth.uid(), 'admin'::app_role));

-- public.community_comments
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.community_comments;
CREATE POLICY "Users can delete their own comments" ON public.community_comments
FOR DELETE TO public
USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::app_role));

-- public.community_posts
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.community_posts;
CREATE POLICY "Users can delete their own posts" ON public.community_posts
FOR DELETE TO public
USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::app_role));

-- public.content_reports
DROP POLICY IF EXISTS "Admins can manage all reports" ON public.content_reports;
CREATE POLICY "Admins can manage all reports" ON public.content_reports
FOR ALL TO public
USING (private.has_role(auth.uid(), 'admin'::app_role));

-- public.course_bookings
DROP POLICY IF EXISTS "Admins can update course bookings" ON public.course_bookings;
CREATE POLICY "Admins can update course bookings" ON public.course_bookings
FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete course bookings" ON public.course_bookings;
CREATE POLICY "Admins can delete course bookings" ON public.course_bookings
FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view course bookings" ON public.course_bookings;
CREATE POLICY "Admins can view course bookings" ON public.course_bookings
FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- public.dynamic_courses
DROP POLICY IF EXISTS "Admins can manage courses" ON public.dynamic_courses;
CREATE POLICY "Admins can manage courses" ON public.dynamic_courses
FOR ALL TO public
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Anyone can view visible courses" ON public.dynamic_courses;
CREATE POLICY "Anyone can view visible courses" ON public.dynamic_courses
FOR SELECT TO public USING ((is_visible = true) OR private.has_role(auth.uid(), 'admin'::app_role));

-- public.free_session_bookings
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.free_session_bookings;
CREATE POLICY "Admins can view all bookings" ON public.free_session_bookings
FOR SELECT TO public USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update bookings" ON public.free_session_bookings;
CREATE POLICY "Admins can update bookings" ON public.free_session_bookings
FOR UPDATE TO public USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.free_session_bookings;
CREATE POLICY "Admins can delete bookings" ON public.free_session_bookings
FOR DELETE TO public USING (private.has_role(auth.uid(), 'admin'::app_role));

-- public.guardians
DROP POLICY IF EXISTS "Guardians can delete own data" ON public.guardians;
CREATE POLICY "Guardians can delete own data" ON public.guardians
FOR DELETE TO authenticated USING ((user_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Guardians can view their own data" ON public.guardians;
CREATE POLICY "Guardians can view their own data" ON public.guardians
FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::app_role));

-- public.parent_testimonials
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.parent_testimonials;
CREATE POLICY "Admins can manage testimonials" ON public.parent_testimonials
FOR ALL TO public
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Anyone can view visible testimonials" ON public.parent_testimonials;
CREATE POLICY "Anyone can view visible testimonials" ON public.parent_testimonials
FOR SELECT TO public USING ((is_visible = true) OR private.has_role(auth.uid(), 'admin'::app_role));

-- public.partners
DROP POLICY IF EXISTS "Admins can manage partners" ON public.partners;
CREATE POLICY "Admins can manage partners" ON public.partners
FOR ALL TO public USING (private.has_role(auth.uid(), 'admin'::app_role));

-- public.profiles
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile" ON public.profiles
FOR DELETE TO authenticated USING ((auth.uid() = id) OR private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Users can view own or admin profiles" ON public.profiles;
CREATE POLICY "Users can view own or admin profiles" ON public.profiles
FOR SELECT TO authenticated USING ((auth.uid() = id) OR private.has_role(auth.uid(), 'admin'::app_role));

-- public.quiz_attempts
DROP POLICY IF EXISTS "Admins can manage attempts" ON public.quiz_attempts;
CREATE POLICY "Admins can manage attempts" ON public.quiz_attempts
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view attempts" ON public.quiz_attempts;
CREATE POLICY "Admins can view attempts" ON public.quiz_attempts
FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- public.quiz_questions
DROP POLICY IF EXISTS "Anyone can view visible questions" ON public.quiz_questions;
CREATE POLICY "Anyone can view visible questions" ON public.quiz_questions
FOR SELECT TO public USING ((is_visible = true) OR private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage quiz questions" ON public.quiz_questions;
CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions
FOR ALL TO public
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- public.site_content
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;
CREATE POLICY "Admins can manage site content" ON public.site_content
FOR ALL TO public
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- public.site_sections
DROP POLICY IF EXISTS "Admins can manage sections" ON public.site_sections;
CREATE POLICY "Admins can manage sections" ON public.site_sections
FOR ALL TO public
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- public.student_projects
DROP POLICY IF EXISTS "Admins can manage student projects" ON public.student_projects;
CREATE POLICY "Admins can manage student projects" ON public.student_projects
FOR ALL TO public USING (private.has_role(auth.uid(), 'admin'::app_role));

-- public.students_showcase
DROP POLICY IF EXISTS "Admins can manage students showcase" ON public.students_showcase;
CREATE POLICY "Admins can manage students showcase" ON public.students_showcase
FOR ALL TO public USING (private.has_role(auth.uid(), 'admin'::app_role));

-- public.trainers
DROP POLICY IF EXISTS "Admins can manage trainers" ON public.trainers;
CREATE POLICY "Admins can manage trainers" ON public.trainers
FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- public.user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- storage.objects
DROP POLICY IF EXISTS "Admins can upload files" ON storage.objects;
CREATE POLICY "Admins can upload files" ON storage.objects
FOR INSERT TO public
WITH CHECK ((bucket_id = 'uploads'::text) AND private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update files" ON storage.objects;
CREATE POLICY "Admins can update files" ON storage.objects
FOR UPDATE TO public
USING ((bucket_id = 'uploads'::text) AND private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;
CREATE POLICY "Admins can delete files" ON storage.objects
FOR DELETE TO public
USING ((bucket_id = 'uploads'::text) AND private.has_role(auth.uid(), 'admin'::app_role));

-- 4. Drop old public.has_role
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 5. Lock down public.handle_new_user (trigger function, not user-callable)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 6. Remove broad SELECT policy on storage.objects for the public uploads bucket.
-- The bucket is public so direct file URLs still serve files via the CDN,
-- but clients can no longer enumerate the file list through the storage API.
DROP POLICY IF EXISTS "Anyone can view uploads" ON storage.objects;


-- ============== CMS TABLES ==============

-- 1. Site content (key/value text content per section)
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  content_key TEXT NOT NULL,
  value_ar TEXT,
  value_en TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID,
  UNIQUE(section, content_key)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site content"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site content"
  ON public.site_content FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Section visibility toggles
CREATE TABLE public.site_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  label_ar TEXT NOT NULL,
  label_en TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sections"
  ON public.site_sections FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage sections"
  ON public.site_sections FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_sections_updated_at
  BEFORE UPDATE ON public.site_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Parent testimonials (CMS-managed)
CREATE TABLE public.parent_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_name TEXT NOT NULL,
  child_name TEXT,
  testimonial_ar TEXT,
  testimonial_en TEXT,
  rating INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.parent_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible testimonials"
  ON public.parent_testimonials FOR SELECT
  USING (is_visible = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage testimonials"
  ON public.parent_testimonials FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_parent_testimonials_updated_at
  BEFORE UPDATE ON public.parent_testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Dynamic courses (CMS-managed)
CREATE TABLE public.dynamic_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  age_range TEXT,
  level TEXT,
  duration TEXT,
  price TEXT,
  icon TEXT,
  features_ar TEXT[],
  features_en TEXT[],
  image_url TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dynamic_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible courses"
  ON public.dynamic_courses FOR SELECT
  USING (is_visible = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage courses"
  ON public.dynamic_courses FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_dynamic_courses_updated_at
  BEFORE UPDATE ON public.dynamic_courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============== AUTO-PROMOTE SUPER ADMIN ==============
-- Replace handle_new_user to auto-promote the configured super admin email

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
  super_admin_email TEXT := 'starnacademy.school@gmail.com';
BEGIN
  -- Auto-promote the super admin email
  IF lower(NEW.email) = lower(super_admin_email) THEN
    user_role := 'admin'::app_role;
  ELSE
    user_role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::app_role,
      'child'::app_role
    );
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

-- Make sure the trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- If the super admin already exists, promote them now
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users
  WHERE lower(email) = lower('starnacademy.school@gmail.com')
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    UPDATE public.profiles SET role = 'admin' WHERE id = v_user_id;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============== SEED DEFAULT SECTIONS ==============
INSERT INTO public.site_sections (section_key, label_ar, label_en, display_order) VALUES
  ('hero',         'القسم الرئيسي',     'Hero',         1),
  ('about',        'من نحن',            'About',        2),
  ('courses',      'الكورسات',          'Courses',      3),
  ('benefits',     'المميزات',          'Benefits',     4),
  ('results',      'النتائج والمشاريع', 'Results',      5),
  ('testimonials', 'آراء أولياء الأمور','Testimonials', 6),
  ('faq',          'الأسئلة الشائعة',   'FAQ',          7),
  ('contact',      'تواصل معنا',        'Contact',      8)
ON CONFLICT (section_key) DO NOTHING;

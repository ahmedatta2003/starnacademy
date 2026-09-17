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
    user_role := 'guardian'::app_role;
  ELSE
    user_role := 'child'::app_role;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    user_role
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$function$;
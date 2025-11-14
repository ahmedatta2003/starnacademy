-- Fix search_path for security function using ALTER
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
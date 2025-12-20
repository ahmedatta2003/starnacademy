-- Create free session bookings table
CREATE TABLE public.free_session_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  session_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.free_session_bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can create a booking (public form)
CREATE POLICY "Anyone can create a booking"
ON public.free_session_bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.free_session_bookings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update bookings
CREATE POLICY "Admins can update bookings"
ON public.free_session_bookings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete bookings
CREATE POLICY "Admins can delete bookings"
ON public.free_session_bookings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_free_session_bookings_updated_at
BEFORE UPDATE ON public.free_session_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
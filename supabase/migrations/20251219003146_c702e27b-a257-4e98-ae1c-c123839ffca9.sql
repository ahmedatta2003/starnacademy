-- Create partners table for dynamic partner management
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Anyone can view active partners
CREATE POLICY "Anyone can view active partners" 
ON public.partners 
FOR SELECT 
USING (is_active = true);

-- Admins can manage partners
CREATE POLICY "Admins can manage partners" 
ON public.partners 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads', 
  'uploads', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Storage policies for uploads bucket
CREATE POLICY "Anyone can view uploads" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'uploads');

CREATE POLICY "Admins can upload files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'uploads' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'uploads' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'uploads' AND has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at on partners
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
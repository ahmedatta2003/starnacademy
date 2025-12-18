-- Create students_showcase table for student showcase management
CREATE TABLE public.students_showcase (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    grade_level TEXT,
    avatar_url TEXT,
    bio TEXT,
    achievements TEXT[],
    stickers_count INTEGER DEFAULT 0,
    projects_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_projects table for student projects
CREATE TABLE public.student_projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students_showcase(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    project_type TEXT,
    image_url TEXT,
    video_url TEXT,
    technologies TEXT[],
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students_showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;

-- Public read access for showcase
CREATE POLICY "Anyone can view students showcase" 
ON public.students_showcase 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view student projects" 
ON public.student_projects 
FOR SELECT 
USING (true);

-- Admin can manage students showcase
CREATE POLICY "Admins can manage students showcase" 
ON public.students_showcase 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage student projects" 
ON public.student_projects 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_students_showcase_updated_at
BEFORE UPDATE ON public.students_showcase
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_projects_updated_at
BEFORE UPDATE ON public.student_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
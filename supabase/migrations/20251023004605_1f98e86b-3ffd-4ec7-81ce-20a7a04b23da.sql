-- Create table for episode subtitles
CREATE TABLE public.episode_subtitles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for course categories
CREATE TABLE public.course_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update course_episodes to reference episode_subtitles
ALTER TABLE public.course_episodes 
  DROP COLUMN IF EXISTS subtitle,
  ADD COLUMN subtitle_id UUID REFERENCES public.episode_subtitles(id);

-- Update courses to reference course_categories
ALTER TABLE public.courses
  ADD COLUMN category_id UUID REFERENCES public.course_categories(id);

-- Create storage bucket for course thumbnails
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-thumbnails', 'course-thumbnails', true);

-- RLS policies for episode_subtitles
ALTER TABLE public.episode_subtitles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view subtitles"
  ON public.episode_subtitles
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage subtitles"
  ON public.episode_subtitles
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for course_categories
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view categories"
  ON public.course_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.course_categories
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for course thumbnails storage
CREATE POLICY "Anyone can view course thumbnails"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Admins can upload course thumbnails"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'course-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update course thumbnails"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'course-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete course thumbnails"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'course-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));

-- Insert some default categories
INSERT INTO public.course_categories (name, slug) VALUES
  ('Programming', 'programming'),
  ('Design', 'design'),
  ('Business', 'business'),
  ('Marketing', 'marketing'),
  ('Personal Development', 'personal-development');

-- Insert some default subtitles
INSERT INTO public.episode_subtitles (name) VALUES
  ('Pengenalan'),
  ('Teori Dasar'),
  ('Praktik'),
  ('Studi Kasus'),
  ('Latihan'),
  ('Kesimpulan');
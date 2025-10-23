-- Add course_id to episode_subtitles table
ALTER TABLE public.episode_subtitles
ADD COLUMN course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_episode_subtitles_course_id ON public.episode_subtitles(course_id);
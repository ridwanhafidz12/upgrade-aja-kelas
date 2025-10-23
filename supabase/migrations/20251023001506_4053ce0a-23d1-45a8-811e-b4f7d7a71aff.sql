-- Add subtitle field to course_episodes table
ALTER TABLE public.course_episodes 
ADD COLUMN subtitle text;
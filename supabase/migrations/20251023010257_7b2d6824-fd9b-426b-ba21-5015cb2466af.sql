-- Add certificate template URL to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS certificate_template_url TEXT;

-- Create episode progress tracking table
CREATE TABLE IF NOT EXISTS episode_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES course_episodes(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, episode_id)
);

-- Enable RLS on episode_progress
ALTER TABLE episode_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view their own progress"
  ON episode_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert their own progress"
  ON episode_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update their own progress"
  ON episode_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create storage bucket for certificate templates
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-templates', 'certificate-templates', false)
ON CONFLICT (id) DO NOTHING;

-- Allow admins to upload certificate templates
CREATE POLICY "Admins can upload certificate templates"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'certificate-templates' AND
    (SELECT has_role(auth.uid(), 'admin'::app_role))
  );

-- Allow admins to view certificate templates
CREATE POLICY "Admins can view certificate templates"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'certificate-templates' AND
    (SELECT has_role(auth.uid(), 'admin'::app_role))
  );

-- Allow admins to delete certificate templates
CREATE POLICY "Admins can delete certificate templates"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'certificate-templates' AND
    (SELECT has_role(auth.uid(), 'admin'::app_role))
  );

-- Create storage bucket for generated certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Allow users to view certificates
CREATE POLICY "Users can view certificates"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'certificates');

-- System can upload certificates (via service role)
CREATE POLICY "System can upload certificates"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'certificates');
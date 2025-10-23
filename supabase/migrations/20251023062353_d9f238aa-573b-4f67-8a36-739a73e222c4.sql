-- Storage policies for private 'certificate-templates' bucket
-- Allow only admins to manage objects in this bucket
CREATE POLICY "Admins manage certificate templates"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'certificate-templates' AND has_role(auth.uid(), 'admin'::app_role)
  )
  WITH CHECK (
    bucket_id = 'certificate-templates' AND has_role(auth.uid(), 'admin'::app_role)
  );
-- Create storage bucket for annual report PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('annual-reports', 'annual-reports', false, 52428800) -- 50MB limit
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to the bucket
CREATE POLICY "Users can upload annual reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'annual-reports');

-- Allow authenticated users to read their uploads (using the same session)
CREATE POLICY "Users can read annual reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'annual-reports');

-- Allow users to delete their uploads
CREATE POLICY "Users can delete annual reports"
ON storage.objects FOR DELETE
USING (bucket_id = 'annual-reports');
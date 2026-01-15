-- Increase max upload size for the annual-reports storage bucket to 150MB
-- 150 * 1024 * 1024 = 157286400 bytes
UPDATE storage.buckets
SET file_size_limit = 157286400
WHERE id = 'annual-reports';

-- If the bucket doesn't exist yet, create it with the desired limit (non-public by default)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
SELECT 'annual-reports', 'annual-reports', false, 157286400
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'annual-reports');

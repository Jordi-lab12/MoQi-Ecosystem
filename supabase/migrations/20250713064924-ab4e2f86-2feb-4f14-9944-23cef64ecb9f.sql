-- Update storage policies for startup image uploads to fix RLS issues
DROP POLICY IF EXISTS "Authenticated users can upload startup images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own startup images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own startup images" ON storage.objects;

-- Create more permissive policies for startup images
CREATE POLICY "Anyone can upload startup images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'startup-images');

CREATE POLICY "Anyone can update startup images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'startup-images');

CREATE POLICY "Anyone can delete startup images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'startup-images');
-- Create storage bucket for startup images
INSERT INTO storage.buckets (id, name, public) VALUES ('startup-images', 'startup-images', true);

-- Create storage policies for startup image uploads
CREATE POLICY "Anyone can view startup images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'startup-images');

CREATE POLICY "Authenticated users can upload startup images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'startup-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own startup images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'startup-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own startup images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'startup-images' AND auth.role() = 'authenticated');
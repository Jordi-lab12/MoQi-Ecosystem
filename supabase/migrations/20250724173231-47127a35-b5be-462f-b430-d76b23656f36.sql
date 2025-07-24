-- Add a table to track which updates each swiper has read
CREATE TABLE public.startup_update_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID NOT NULL,
  startup_id UUID NOT NULL,
  update_id UUID NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique reads per swiper per update
  UNIQUE(swiper_id, update_id)
);

-- Enable RLS
ALTER TABLE public.startup_update_reads ENABLE ROW LEVEL SECURITY;

-- Create policies for the reads table
CREATE POLICY "Swipers can insert their own reads" 
ON public.startup_update_reads 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = startup_update_reads.swiper_id 
  AND profiles.user_id = auth.uid() 
  AND profiles.role = 'swiper'
));

CREATE POLICY "Swipers can view their own reads" 
ON public.startup_update_reads 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = startup_update_reads.swiper_id 
  AND profiles.user_id = auth.uid()
));

-- Create index for better performance
CREATE INDEX idx_startup_update_reads_swiper_startup ON public.startup_update_reads (swiper_id, startup_id);
CREATE INDEX idx_startup_update_reads_update ON public.startup_update_reads (update_id);
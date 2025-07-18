-- Create startup_updates table for weekly updates
CREATE TABLE public.startup_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID NOT NULL,
  title TEXT NOT NULL,
  week_ending DATE NOT NULL,
  key_achievements TEXT,
  challenges_faced TEXT,
  metrics_update TEXT,
  upcoming_goals TEXT,
  team_highlights TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.startup_updates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Startups can view their own updates" 
ON public.startup_updates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = startup_updates.startup_id 
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Startups can create their own updates" 
ON public.startup_updates 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = startup_updates.startup_id 
    AND profiles.user_id = auth.uid() 
    AND profiles.role = 'startup'
  )
);

CREATE POLICY "Startups can update their own updates" 
ON public.startup_updates 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = startup_updates.startup_id 
    AND profiles.user_id = auth.uid()
  )
);

-- Swipers can view published updates from startups they liked
CREATE POLICY "Swipers can view published updates from liked startups" 
ON public.startup_updates 
FOR SELECT 
USING (
  is_published = true 
  AND EXISTS (
    SELECT 1 FROM public.swiper_interactions si
    JOIN public.profiles p ON p.id = si.swiper_id
    WHERE si.startup_id = startup_updates.startup_id
    AND si.has_liked = true
    AND p.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_startup_updates_updated_at
BEFORE UPDATE ON public.startup_updates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
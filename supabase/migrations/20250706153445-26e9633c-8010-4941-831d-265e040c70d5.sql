-- Create profiles table for both swipers and startups
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('swiper', 'startup')),
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  
  -- Swiper specific fields
  age TEXT,
  study TEXT,
  gender TEXT,
  
  -- Startup specific fields  
  tagline TEXT,
  description TEXT,
  usp TEXT,
  mission TEXT,
  vision TEXT,
  industry TEXT,
  founded TEXT,
  employees TEXT,
  logo TEXT DEFAULT '🚀',
  image TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create swiper interactions table
CREATE TABLE public.swiper_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  startup_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  has_liked BOOLEAN NOT NULL,
  coin_allocation INTEGER NOT NULL DEFAULT 0,
  feedback_preference TEXT NOT NULL CHECK (feedback_preference IN ('no', 'group', 'all')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(swiper_id, startup_id)
);

-- Create feedback requests table
CREATE TABLE public.feedback_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  swiper_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  feedback_type TEXT NOT NULL DEFAULT 'meeting',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  teams_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swiper_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for swiper_interactions
CREATE POLICY "Users can view their own interactions" ON public.swiper_interactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = swiper_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = startup_id AND user_id = auth.uid())
);
CREATE POLICY "Swipers can insert their interactions" ON public.swiper_interactions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = swiper_id AND user_id = auth.uid() AND role = 'swiper')
);
CREATE POLICY "Swipers can update their interactions" ON public.swiper_interactions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = swiper_id AND user_id = auth.uid() AND role = 'swiper')
);

-- RLS Policies for feedback_requests
CREATE POLICY "Users can view their feedback requests" ON public.feedback_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = swiper_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = startup_id AND user_id = auth.uid())
);
CREATE POLICY "Startups can create feedback requests" ON public.feedback_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = startup_id AND user_id = auth.uid() AND role = 'startup')
);
CREATE POLICY "Users can update their feedback requests" ON public.feedback_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = swiper_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = startup_id AND user_id = auth.uid())
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_requests_updated_at
  BEFORE UPDATE ON public.feedback_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
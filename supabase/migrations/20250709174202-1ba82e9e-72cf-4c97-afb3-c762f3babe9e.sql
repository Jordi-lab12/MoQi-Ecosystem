-- Add feedback_session_type column to support 1-to-1 vs group feedback
ALTER TABLE public.feedback_requests 
ADD COLUMN feedback_session_type TEXT NOT NULL DEFAULT 'individual' CHECK (feedback_session_type IN ('individual', 'group'));

-- Update feedback_type to include 'individual' and 'group' options
ALTER TABLE public.feedback_requests 
ALTER COLUMN feedback_type TYPE TEXT,
ALTER COLUMN feedback_type SET DEFAULT 'individual',
ADD CONSTRAINT feedback_type_check CHECK (feedback_type IN ('individual', 'group', 'call', 'meeting'));

-- Update swiper_interactions feedback_preference to match new system
ALTER TABLE public.swiper_interactions 
ALTER COLUMN feedback_preference TYPE TEXT,
ADD CONSTRAINT feedback_preference_check CHECK (feedback_preference IN ('no', 'individual', 'group', 'all'));

-- Update existing data to use new values
UPDATE public.swiper_interactions SET feedback_preference = 'all' WHERE feedback_preference = 'group';
UPDATE public.feedback_requests SET feedback_session_type = 'individual' WHERE feedback_session_type IS NULL;
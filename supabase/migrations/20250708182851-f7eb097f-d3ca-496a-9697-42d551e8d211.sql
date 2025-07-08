-- Update the handle_new_user function to use the role from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, name, username, age, study, gender, tagline, description, usp, mission, vision, industry, founded, employees, logo, image)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'swiper'), -- Use role from metadata or default to swiper
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'age',
    NEW.raw_user_meta_data->>'study', 
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'tagline',
    NEW.raw_user_meta_data->>'description',
    NEW.raw_user_meta_data->>'usp',
    NEW.raw_user_meta_data->>'mission',
    NEW.raw_user_meta_data->>'vision',
    NEW.raw_user_meta_data->>'industry',
    NEW.raw_user_meta_data->>'founded',
    NEW.raw_user_meta_data->>'employees',
    COALESCE(NEW.raw_user_meta_data->>'logo', '🚀'),
    NEW.raw_user_meta_data->>'image'
  );
  RETURN NEW;
END;
$$;
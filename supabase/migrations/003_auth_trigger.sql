-- =====================================================
-- Auth Trigger for Automatic User Profile Creation
-- Supabase Auth bilan integratsiya
-- =====================================================

-- First, make password_hash nullable since Supabase Auth manages passwords
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Function to create user profile automatically when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    avatar,
    plan,
    type,
    password_hash
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar', '👤'),
    'FREE',
    'user',
    'managed_by_supabase_auth'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Update existing demo users
-- =====================================================
UPDATE users 
SET password_hash = 'managed_by_supabase_auth' 
WHERE password_hash IS NULL OR password_hash = '';

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a user profile in public.users when a new auth user is created';

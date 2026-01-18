-- =====================================================
-- Simple Phone-based Authentication
-- Supabase Auth o'rniga oddiy table authentication
-- =====================================================

-- Add phone column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) UNIQUE;

-- Make email nullable (phone asosiy bo'ladi)
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Update password_hash to be required again
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;

-- Add index for fast phone lookup
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Update existing users with demo phones
UPDATE users 
SET phone = '+998901234567', 
    password_hash = crypt('demo123', gen_salt('bf'))
WHERE email = 'demo@bookbites.com';

UPDATE users 
SET phone = '+998901234568',
    password_hash = crypt('demo123', gen_salt('bf'))
WHERE email = 'admin@bookbites.com';

-- Function to authenticate user with phone and password
CREATE OR REPLACE FUNCTION authenticate_user(
  p_phone VARCHAR(20),
  p_password TEXT
)
RETURNS TABLE (
  user_id UUID,
  user_name VARCHAR(255),
  user_avatar VARCHAR(50),
  user_type VARCHAR(20),
  user_plan VARCHAR(20),
  user_email VARCHAR(255),
  user_phone VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    name,
    avatar,
    type,
    plan,
    email,
    phone
  FROM users
  WHERE phone = p_phone 
    AND password_hash = crypt(p_password, password_hash)
    AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create new user with phone
CREATE OR REPLACE FUNCTION create_user_with_phone(
  p_phone VARCHAR(20),
  p_password TEXT,
  p_name VARCHAR(255),
  p_avatar VARCHAR(50) DEFAULT '👤'
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Check if phone already exists
  IF EXISTS (SELECT 1 FROM users WHERE phone = p_phone) THEN
    RAISE EXCEPTION 'Bu telefon raqam allaqachon ro''yxatdan o''tgan';
  END IF;
  
  -- Create user
  INSERT INTO users (
    phone,
    password_hash,
    name,
    avatar,
    plan,
    type
  ) VALUES (
    p_phone,
    crypt(p_password, gen_salt('bf')),
    p_name,
    p_avatar,
    'FREE',
    'user'
  )
  RETURNING id INTO new_user_id;
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user password
CREATE OR REPLACE FUNCTION update_user_password(
  p_user_id UUID,
  p_old_password TEXT,
  p_new_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  password_valid BOOLEAN;
BEGIN
  -- Verify old password
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = p_user_id 
      AND password_hash = crypt(p_old_password, password_hash)
  ) INTO password_valid;
  
  IF NOT password_valid THEN
    RAISE EXCEPTION 'Eski parol noto''g''ri';
  END IF;
  
  -- Update password
  UPDATE users 
  SET password_hash = crypt(p_new_password, gen_salt('bf')),
      updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

COMMENT ON FUNCTION authenticate_user IS 'Authenticate user with phone number and password';
COMMENT ON FUNCTION create_user_with_phone IS 'Create new user with phone number';
COMMENT ON FUNCTION update_user_password IS 'Update user password with verification';
COMMENT ON COLUMN users.phone IS 'User phone number for authentication (+998XXXXXXXXX format)';

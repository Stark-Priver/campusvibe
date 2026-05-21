-- ================================================================
-- Create Missing Profiles for Existing Users
-- Run this in Supabase SQL Editor after users exist
-- ================================================================

-- Insert profiles for all users that don't have one yet
INSERT INTO public.profiles (id, email, full_name, university, roles, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.university,
  u.roles,
  NOW(),
  NOW()
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Verify: Check how many profiles were created
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT COUNT(*) as total_users FROM public.users;

-- Done!
-- Now all users should have corresponding profiles

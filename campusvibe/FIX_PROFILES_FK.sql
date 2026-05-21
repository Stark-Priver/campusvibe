-- ================================================================
-- Remove problematic FK constraint from profiles table
-- This allows profiles to exist independently of the users table
-- ================================================================

-- Drop the foreign key constraint on profiles.id
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Now profiles can be created without requiring a corresponding users entry
-- Verify the change
SELECT constraint_name, table_name, column_name 
FROM information_schema.key_column_usage 
WHERE table_name = 'profiles';

-- Done!
-- Now you can create profiles independently

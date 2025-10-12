-- Fix profiles RLS policy to prevent user_type privilege escalation
-- Drop the vulnerable policy
DROP POLICY IF EXISTS "Users can update own profile (restricted)" ON public.profiles;

-- Create a secure policy that prevents user_type changes
CREATE POLICY "Users can update own profile fields"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Ensure user_type cannot be changed by comparing with current value
  user_type = (SELECT user_type FROM profiles WHERE id = auth.uid())
);

-- Add comment explaining the security measure
COMMENT ON POLICY "Users can update own profile fields" ON public.profiles IS 
'Allows users to update their own profile but prevents changes to user_type field to prevent privilege escalation. User roles are managed through the user_roles table.';
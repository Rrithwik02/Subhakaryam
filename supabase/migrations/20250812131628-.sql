-- Alternative approach: Remove SECURITY DEFINER from admin functions
-- and rely on proper RLS policies instead

-- For is_admin() function, we can make it work without SECURITY DEFINER
-- by ensuring the profiles table has an RLS policy that allows users to read their own data
DROP FUNCTION IF EXISTS public.is_admin();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  -- Check if current user is admin by querying their own profile
  -- This works because RLS policy allows users to read their own profile
  SELECT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  );
$$;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- For is_user_admin(), we need to keep SECURITY DEFINER because it checks OTHER users
-- But let's mark it clearly as needed for system use only
COMMENT ON FUNCTION public.is_user_admin(uuid) IS 
'SECURITY DEFINER required: System function that needs to check admin status of any user ID for RLS policy evaluation. Used internally by RLS policies.';

-- For get_provider_payment_details_for_admin(), this should remain SECURITY DEFINER
-- but let's see if we can restructure it to be safer
COMMENT ON FUNCTION public.get_provider_payment_details_for_admin(uuid) IS 
'SECURITY DEFINER required: Admin-only function that bypasses RLS to access and mask sensitive payment data. Should only be called by verified admin users.';

-- Add a function that doesn't need SECURITY DEFINER for basic admin checks
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  -- Simple admin check for current user only
  SELECT user_type = 'admin' 
  FROM profiles 
  WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.current_user_is_admin() TO authenticated;
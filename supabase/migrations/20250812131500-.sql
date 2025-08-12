-- Fix remaining unnecessary SECURITY DEFINER functions
-- Keep SECURITY DEFINER only for functions that truly need elevated privileges

-- Fix is_provider_owner - this function only checks ownership and doesn't need elevated privileges
DROP FUNCTION IF EXISTS public.is_provider_owner(uuid);

CREATE OR REPLACE FUNCTION public.is_provider_owner(provider_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  -- Check if current user owns the provider profile
  -- No SECURITY DEFINER needed as this just compares auth.uid() with parameter
  SELECT provider_profile_id = auth.uid();
$$;

-- Grant appropriate access
GRANT EXECUTE ON FUNCTION public.is_provider_owner(uuid) TO authenticated;

-- The following functions SHOULD keep SECURITY DEFINER because they need elevated privileges:
-- 1. is_admin() - needs to query profiles table for admin check
-- 2. is_user_admin() - needs to query profiles table 
-- 3. handle_new_user() - trigger that creates profiles on user signup
-- 4. notify_provider_approval() - trigger that updates user_type and creates notifications
-- 5. audit_payment_details_access() - trigger for audit logging
-- 6. handle_approved_deletion_request() - deletes across multiple tables
-- 7. get_provider_payment_details_for_admin() - admin function for sensitive data

-- However, let's add SET search_path to those that don't have it to fix the search path warnings
ALTER FUNCTION public.is_admin() SET search_path TO 'public';
ALTER FUNCTION public.is_user_admin(uuid) SET search_path TO 'public';
ALTER FUNCTION public.audit_payment_details_access() SET search_path TO 'public';
ALTER FUNCTION public.get_provider_payment_details_for_admin(uuid) SET search_path TO 'public';

-- Add comments explaining why these functions need SECURITY DEFINER
COMMENT ON FUNCTION public.is_admin() IS 
'SECURITY DEFINER required: Function needs to access profiles table to check admin status regardless of RLS policies.';

COMMENT ON FUNCTION public.is_user_admin(uuid) IS 
'SECURITY DEFINER required: Function needs to access profiles table to check admin status for any user ID.';

COMMENT ON FUNCTION public.handle_new_user() IS 
'SECURITY DEFINER required: Trigger function needs elevated privileges to create profile records during user signup.';

COMMENT ON FUNCTION public.notify_provider_approval() IS 
'SECURITY DEFINER required: Trigger function needs to update user_type and create notifications with elevated privileges.';
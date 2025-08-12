-- Fix Security Definer functions that don't need elevated privileges
-- Only keep SECURITY DEFINER for functions that truly need it

-- Fix get_public_service_providers - this should NOT be security definer 
-- since it's meant to be publicly accessible and doesn't need elevated privileges
DROP FUNCTION IF EXISTS public.get_public_service_providers();

CREATE OR REPLACE FUNCTION public.get_public_service_providers()
RETURNS TABLE(id uuid, full_name text, profile_image text)
LANGUAGE sql
STABLE
AS $$
  -- Return basic info for approved service providers
  -- No SECURITY DEFINER needed as this is public data with proper WHERE filtering
  SELECT 
    p.id,
    p.full_name,
    p.profile_image
  FROM public.profiles p
  INNER JOIN public.service_providers sp ON p.id = sp.profile_id
  WHERE sp.status = 'approved'
    AND p.full_name IS NOT NULL;  -- Only show profiles with names
$$;

-- Grant public access since this is meant to be publicly accessible
GRANT EXECUTE ON FUNCTION public.get_public_service_providers() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_service_providers() TO authenticated;

-- Fix get_current_user_type - this should NOT be security definer
-- since it only accesses the current user's own data
DROP FUNCTION IF EXISTS public.get_current_user_type();

CREATE OR REPLACE FUNCTION public.get_current_user_type()
RETURNS text
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  -- Get current user's type - no SECURITY DEFINER needed 
  -- as RLS will ensure users only see their own data
  SELECT user_type FROM public.profiles WHERE id = auth.uid();
$$;

-- Grant access to authenticated users only (since it requires auth.uid())
GRANT EXECUTE ON FUNCTION public.get_current_user_type() TO authenticated;

-- Keep SECURITY DEFINER for functions that truly need elevated privileges:
-- 1. audit_payment_details_access - needs to insert notifications
-- 2. get_provider_payment_details_for_admin - needs admin access to sensitive data
-- 3. handle_approved_deletion_request - needs to delete across multiple tables
-- 4. Other admin/system functions

-- Add comments to explain why certain functions keep SECURITY DEFINER
COMMENT ON FUNCTION public.audit_payment_details_access() IS 
'SECURITY DEFINER required: Function needs elevated privileges to insert notifications for any user during payment operations.';

COMMENT ON FUNCTION public.get_provider_payment_details_for_admin(uuid) IS 
'SECURITY DEFINER required: Function needs elevated privileges to access and mask sensitive payment data for admin use only.';

COMMENT ON FUNCTION public.handle_approved_deletion_request() IS 
'SECURITY DEFINER required: Function needs elevated privileges to delete user data across multiple tables and auth.users.';
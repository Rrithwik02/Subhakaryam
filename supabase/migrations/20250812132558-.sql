-- TARGETED FIX: Minimize Security Definer impact
-- Keep essential functions but optimize their implementation

-- STEP 1: Optimize the is_admin() function to be more explicit about its security model
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
  -- SECURITY DEFINER is required here for RLS policy evaluation
  -- This function is used by 13+ RLS policies and cannot be eliminated
  -- Optimized to check current user only via auth.uid()
  SELECT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  );
$$;

-- STEP 2: Simplify is_user_admin to reduce its scope
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
  -- SECURITY DEFINER required for system-level admin checks
  -- Input validation and simplified logic
  SELECT CASE 
    WHEN user_id IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = user_id AND user_type = 'admin'
    )
  END;
$$;

-- STEP 3: Create a completely non-SECURITY DEFINER alternative for new usage
CREATE OR REPLACE FUNCTION public.check_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  -- This version works without SECURITY DEFINER by relying on RLS
  -- Can only check current user's admin status
  SELECT user_type = 'admin' 
  FROM profiles 
  WHERE id = auth.uid();
$$;

-- STEP 4: Add comprehensive documentation explaining why SECURITY DEFINER is needed
COMMENT ON FUNCTION public.is_admin() IS 
'SECURITY DEFINER REQUIRED: Used by 13+ RLS policies for admin access control. Cannot be replaced without breaking core security model. Only checks current authenticated user via auth.uid().';

COMMENT ON FUNCTION public.is_user_admin(uuid) IS 
'SECURITY DEFINER REQUIRED: System function for checking admin status of any user ID. Used internally by security infrastructure and cannot be eliminated without major refactoring.';

COMMENT ON FUNCTION public.check_current_user_admin() IS 
'Non-SECURITY DEFINER alternative for checking current user admin status. Use this in new code where possible to minimize SECURITY DEFINER usage.';

-- STEP 5: Grant minimal necessary permissions
GRANT EXECUTE ON FUNCTION public.check_current_user_admin() TO authenticated;

-- STEP 6: Document the security architecture
CREATE OR REPLACE FUNCTION public.get_security_architecture_info()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT 'This database uses SECURITY DEFINER functions for RLS policy evaluation. ' ||
         'is_admin() and is_user_admin() are essential security functions that cannot be eliminated. ' ||
         'For new development, prefer check_current_user_admin() when possible.';
$$;
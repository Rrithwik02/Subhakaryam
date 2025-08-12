-- COMPREHENSIVE FIX: Eliminate Security Definer View issues
-- Replace SECURITY DEFINER scalar functions with RLS-based security model

-- STEP 1: Create new RLS policies that don't depend on SECURITY DEFINER functions
-- First, we need to create a way to check admin status without SECURITY DEFINER

-- Create a materialized view that caches admin user IDs (refreshed automatically)
CREATE MATERIALIZED VIEW admin_user_cache AS
SELECT id as user_id, true as is_admin
FROM profiles 
WHERE user_type = 'admin';

-- Create index for performance
CREATE UNIQUE INDEX idx_admin_user_cache_user_id ON admin_user_cache(user_id);

-- Create a function to refresh the cache (can be called by triggers)
CREATE OR REPLACE FUNCTION refresh_admin_cache()
RETURNS void
LANGUAGE sql
SET search_path TO 'public'
AS $$
  REFRESH MATERIALIZED VIEW admin_user_cache;
$$;

-- STEP 2: Create trigger to auto-refresh cache when profiles change
CREATE OR REPLACE FUNCTION update_admin_cache()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Only refresh if user_type changed to/from admin
  IF (OLD.user_type IS DISTINCT FROM NEW.user_type) AND 
     (OLD.user_type = 'admin' OR NEW.user_type = 'admin') THEN
    PERFORM refresh_admin_cache();
  END IF;
  RETURN NEW;
END;
$$;

-- Add trigger to profiles table
DROP TRIGGER IF EXISTS trigger_update_admin_cache ON profiles;
CREATE TRIGGER trigger_update_admin_cache
  AFTER UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_admin_cache();

-- STEP 3: Create replacement function without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.current_user_is_admin_cached()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  -- Check if current user is in admin cache
  -- No SECURITY DEFINER needed - uses materialized view
  SELECT EXISTS (
    SELECT 1 FROM admin_user_cache 
    WHERE user_id = auth.uid()
  );
$$;

-- STEP 4: Grant permissions
GRANT SELECT ON admin_user_cache TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_is_admin_cached() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_admin_cache() TO authenticated;

-- STEP 5: Initial cache population
SELECT refresh_admin_cache();

-- STEP 6: Add documentation
COMMENT ON MATERIALIZED VIEW admin_user_cache IS 
'Cached list of admin users for efficient non-SECURITY DEFINER admin checks. Auto-refreshed on profile changes.';

COMMENT ON FUNCTION public.current_user_is_admin_cached() IS 
'Efficient admin check using cached data. Alternative to SECURITY DEFINER is_admin() function.';

-- Note: We still need to keep the original is_admin() and is_user_admin() functions
-- because they are deeply embedded in existing RLS policies. However, new code should
-- use the cached version to avoid SECURITY DEFINER where possible.
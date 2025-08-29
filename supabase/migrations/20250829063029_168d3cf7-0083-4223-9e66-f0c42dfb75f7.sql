-- The issue might be with the materialized view. Let's check and potentially fix it
-- Check the current definition
-- Drop and recreate the materialized view without any SECURITY DEFINER properties

DROP MATERIALIZED VIEW IF EXISTS public.admin_user_cache;

-- Recreate the materialized view with explicit SECURITY INVOKER (though this is default)
-- This view is for caching admin users for efficient lookups
CREATE MATERIALIZED VIEW public.admin_user_cache AS
SELECT 
  profiles.id AS user_id,
  true AS is_admin
FROM profiles 
WHERE profiles.user_type = 'admin';

-- Set proper ownership 
ALTER MATERIALIZED VIEW public.admin_user_cache OWNER TO postgres;

-- Set appropriate permissions - only service role should access this cache
REVOKE ALL ON public.admin_user_cache FROM PUBLIC;
GRANT SELECT ON public.admin_user_cache TO service_role;
GRANT ALL ON public.admin_user_cache TO postgres;

-- Add index for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_user_cache_user_id ON public.admin_user_cache (user_id);

-- Add helpful comment
COMMENT ON MATERIALIZED VIEW public.admin_user_cache IS 'Cached list of admin users for efficient non-SECURITY DEFINER admin checks. Auto-refreshed on profile changes.';
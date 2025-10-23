-- Fix Materialized View in API warning
-- Remove admin_user_cache from the PostgREST API schema
-- This prevents the materialized view from being accessible via the Data API

-- Revoke all public access to admin_user_cache
REVOKE ALL ON public.admin_user_cache FROM anon;
REVOKE ALL ON public.admin_user_cache FROM authenticated;

-- Grant access only to postgres role for internal functions to use
GRANT SELECT ON public.admin_user_cache TO postgres;

-- The materialized view will still be usable by database functions
-- but won't be exposed via the PostgREST API

COMMENT ON MATERIALIZED VIEW public.admin_user_cache IS 
'Internal cache of admin users. Not exposed via API - used only by database functions for efficient admin checks.';
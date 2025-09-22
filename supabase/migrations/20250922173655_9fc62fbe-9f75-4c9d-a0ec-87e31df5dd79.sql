-- Fix Security Definer View Issue
--
-- The linter detected that the admin_user_cache materialized view
-- is owned by 'postgres' (superuser), which creates a security definer-like
-- behavior where the view operates with elevated privileges.
--
-- Solution: Change ownership to 'authenticated' role to ensure proper RLS enforcement

-- Change ownership of the materialized view to authenticated role
ALTER MATERIALIZED VIEW admin_user_cache OWNER TO authenticated;

-- Refresh the materialized view to ensure it's up to date
REFRESH MATERIALIZED VIEW admin_user_cache;
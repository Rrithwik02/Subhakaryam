-- Fix Security Definer View Issue
--
-- The linter detected that the admin_user_cache materialized view
-- is owned by 'postgres' (superuser), which creates a security definer-like
-- behavior where the view operates with elevated privileges.
--
-- Solution: Drop and recreate the materialized view with proper ownership

-- Drop the existing materialized view
DROP MATERIALIZED VIEW IF EXISTS admin_user_cache;

-- Recreate the materialized view (it will be owned by the current role)
CREATE MATERIALIZED VIEW admin_user_cache AS
SELECT 
  profiles.id AS user_id,
  true AS is_admin
FROM profiles
WHERE profiles.user_type = 'admin';

-- Create an index for performance
CREATE UNIQUE INDEX idx_admin_user_cache_user_id ON admin_user_cache (user_id);

-- Grant appropriate permissions
GRANT SELECT ON admin_user_cache TO authenticated;
GRANT SELECT ON admin_user_cache TO anon;
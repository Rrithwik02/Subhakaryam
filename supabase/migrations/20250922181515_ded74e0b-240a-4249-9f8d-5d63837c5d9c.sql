-- Final fix for Security Definer and Materialized View issues
--
-- 1. The "Security Definer View" error is actually about SECURITY DEFINER functions
--    We need to keep the 5 remaining functions that require SECURITY DEFINER for security
--    These are: is_admin, is_user_admin, handle_new_user, handle_approved_deletion_request, get_secure_payment_details_for_admin
--
-- 2. For the materialized view API exposure, we need to revoke API access
--    by revoking permissions from api-related roles

-- Fix materialized view API exposure
-- Revoke permissions from API roles to prevent API access
REVOKE ALL ON admin_user_cache FROM anon;
REVOKE ALL ON admin_user_cache FROM authenticated;

-- Only grant to specific database roles that need internal access
GRANT SELECT ON admin_user_cache TO postgres;

-- Add a comment explaining why SECURITY DEFINER functions are needed
COMMENT ON FUNCTION is_admin() IS 'SECURITY DEFINER required: Used in RLS policies, needs elevated privileges to check admin status';
COMMENT ON FUNCTION is_user_admin(uuid) IS 'SECURITY DEFINER required: Used for system-level admin checks, needs elevated privileges';
COMMENT ON FUNCTION handle_new_user() IS 'SECURITY DEFINER required: Auth trigger function, needs elevated privileges to create profiles';
COMMENT ON FUNCTION handle_approved_deletion_request() IS 'SECURITY DEFINER required: Needs to delete from auth.users table, requires elevated privileges';
COMMENT ON FUNCTION get_secure_payment_details_for_admin(uuid) IS 'SECURITY DEFINER required: Intentionally designed for admin access to sensitive payment data';
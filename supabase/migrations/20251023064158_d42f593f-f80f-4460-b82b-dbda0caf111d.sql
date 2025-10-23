-- Fix Security Definer View Issue
-- Drop and recreate views to remove security definer behavior
-- Views will use the permissions of the calling user instead of the creator

-- Drop existing views
DROP VIEW IF EXISTS public.public_reviews CASCADE;
DROP VIEW IF EXISTS public.public_service_provider_profiles CASCADE;
DROP VIEW IF EXISTS public.public_service_providers CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.admin_user_cache CASCADE;

-- Recreate public_reviews view
CREATE VIEW public.public_reviews 
WITH (security_invoker = true) AS
SELECT 
  r.id,
  r.provider_id,
  r.rating,
  r.created_at,
  r.comment,
  'user_'::text || SUBSTRING(r.user_id::text FROM 1 FOR 8) AS anonymous_user_id
FROM reviews r
WHERE r.status = 'approved'::text;

-- Recreate public_service_provider_profiles view
CREATE VIEW public.public_service_provider_profiles
WITH (security_invoker = true) AS
SELECT 
  p.id,
  p.full_name,
  p.profile_image,
  p.created_at
FROM profiles p
INNER JOIN service_providers sp ON p.id = sp.profile_id
WHERE sp.status = 'approved'::text;

-- Recreate public_service_providers view
CREATE VIEW public.public_service_providers
WITH (security_invoker = true) AS
SELECT 
  sp.id,
  sp.base_price,
  sp.rating,
  sp.is_premium,
  sp.created_at,
  sp.service_type,
  sp.business_name AS display_name,
  sp.description,
  sp.city,
  sp.portfolio_images,
  sp.specializations,
  sp.subcategory,
  sp.portfolio_link
FROM service_providers sp
WHERE sp.status = 'approved'::text;

-- Recreate admin_user_cache materialized view
-- Materialized views don't support security_invoker option
-- But they don't have the same security definer concerns as regular views
CREATE MATERIALIZED VIEW public.admin_user_cache AS
SELECT 
  profiles.id AS user_id,
  true AS is_admin
FROM profiles
WHERE profiles.user_type = 'admin'::text;

-- Create index for performance
CREATE UNIQUE INDEX idx_admin_user_cache_user_id ON public.admin_user_cache(user_id);

-- Grant necessary permissions
GRANT SELECT ON public.public_reviews TO anon, authenticated;
GRANT SELECT ON public.public_service_provider_profiles TO anon, authenticated;
GRANT SELECT ON public.public_service_providers TO anon, authenticated;
GRANT SELECT ON public.admin_user_cache TO anon, authenticated;

-- Add helpful comments
COMMENT ON VIEW public.public_reviews IS 'Public view of approved reviews with SECURITY INVOKER to use caller permissions.';
COMMENT ON VIEW public.public_service_provider_profiles IS 'Public view of approved service provider profiles with SECURITY INVOKER to use caller permissions.';
COMMENT ON VIEW public.public_service_providers IS 'Public view of approved service providers with SECURITY INVOKER to use caller permissions.';
COMMENT ON MATERIALIZED VIEW public.admin_user_cache IS 'Cached list of admin users for efficient queries.';
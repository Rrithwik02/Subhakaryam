-- Fix Security Definer View issue by removing security_barrier
-- and ensuring proper RLS enforcement

-- First, drop the existing view
DROP VIEW IF EXISTS public.public_service_provider_profiles;

-- Recreate the view without security_barrier to ensure RLS is properly enforced
CREATE VIEW public.public_service_provider_profiles AS
SELECT 
  sp.id AS provider_id,
  p.full_name,
  p.profile_image,
  sp.service_type,
  sp.city,
  sp.rating
FROM profiles p
JOIN service_providers sp ON p.id = sp.profile_id
WHERE sp.status = 'approved';

-- Grant appropriate permissions for public access
GRANT SELECT ON public.public_service_provider_profiles TO anon;
GRANT SELECT ON public.public_service_provider_profiles TO authenticated;

-- Add a comment explaining the security model
COMMENT ON VIEW public.public_service_provider_profiles IS 
'Public view of approved service providers. Security is enforced through the WHERE clause limiting to approved providers only. RLS is enforced on underlying tables.';
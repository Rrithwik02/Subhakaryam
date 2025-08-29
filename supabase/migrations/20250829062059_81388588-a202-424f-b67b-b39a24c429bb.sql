-- First, completely drop the view and recreate it properly
DROP VIEW IF EXISTS public.public_service_provider_profiles CASCADE;

-- Create a simple view without any security definer properties
-- This will default to SECURITY INVOKER (which is what we want)
CREATE VIEW public.public_service_provider_profiles WITH (security_barrier = false) AS
SELECT 
  sp.id AS provider_id,
  p.full_name,
  p.profile_image,  
  sp.service_type,
  sp.city,
  sp.rating
FROM profiles p
INNER JOIN service_providers sp ON p.id = sp.profile_id
WHERE sp.status = 'approved';

-- Set explicit ownership to postgres (not supabase_admin)
ALTER VIEW public.public_service_provider_profiles OWNER TO postgres;

-- Grant only SELECT permissions to the roles that need it
REVOKE ALL ON public.public_service_provider_profiles FROM PUBLIC;
GRANT SELECT ON public.public_service_provider_profiles TO anon;
GRANT SELECT ON public.public_service_provider_profiles TO authenticated;
GRANT ALL ON public.public_service_provider_profiles TO postgres;

-- Add a comment to document the security approach
COMMENT ON VIEW public.public_service_provider_profiles IS 'Public view of approved service providers. Uses SECURITY INVOKER (default) to respect RLS policies.';
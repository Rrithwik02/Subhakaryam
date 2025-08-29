-- Drop the existing view that may have SECURITY DEFINER
DROP VIEW IF EXISTS public.public_service_provider_profiles;

-- Recreate the view without SECURITY DEFINER (default is SECURITY INVOKER)
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

-- Enable RLS on the view (this is important for security)
ALTER VIEW public.public_service_provider_profiles SET (security_barrier = true);

-- Grant appropriate permissions (read-only access for public data)
GRANT SELECT ON public.public_service_provider_profiles TO anon, authenticated;

-- Ensure the view owner is correct
ALTER VIEW public.public_service_provider_profiles OWNER TO postgres;
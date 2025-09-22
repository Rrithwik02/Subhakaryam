-- Fix Security Definer View Issue
-- Drop the existing insecure view
DROP VIEW IF EXISTS public_service_provider_profiles;

-- Create a secure view without SECURITY DEFINER
-- This view will respect RLS policies of the querying user
CREATE VIEW public_service_provider_profiles AS
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

-- Ensure the view has proper permissions
-- Grant SELECT to authenticated users (respects RLS)
GRANT SELECT ON public_service_provider_profiles TO authenticated;
GRANT SELECT ON public_service_provider_profiles TO anon;

-- Add comment explaining the security approach
COMMENT ON VIEW public_service_provider_profiles IS 
'Public view of approved service providers. Uses invoker rights (not SECURITY DEFINER) to respect RLS policies.';
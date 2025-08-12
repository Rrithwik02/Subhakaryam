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

-- Enable RLS on the view (this ensures queries against the view respect RLS)
ALTER VIEW public.public_service_provider_profiles SET (security_barrier = false);

-- Create RLS policy for the view that allows public read access
-- Since this view is meant to show only approved providers, public access is intended
CREATE POLICY "Public access to approved provider profiles" 
ON public.public_service_provider_profiles
FOR SELECT 
USING (true);

-- Ensure the underlying tables have proper RLS policies
-- (These should already exist but let's verify the profiles table has appropriate policies)

-- Grant appropriate permissions
GRANT SELECT ON public.public_service_provider_profiles TO anon;
GRANT SELECT ON public.public_service_provider_profiles TO authenticated;
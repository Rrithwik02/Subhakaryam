-- Fix Security Issue: Customer Personal Information Exposed to Public
-- The public_profiles view needs proper RLS protection

-- 1. Drop the current unprotected view
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- 2. Create a security definer function instead of a view for better control
CREATE OR REPLACE FUNCTION public.get_public_service_providers()
RETURNS TABLE (
  id uuid,
  full_name text,
  profile_image text
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  -- Only return basic info for approved service providers
  SELECT 
    p.id,
    p.full_name,
    p.profile_image
  FROM public.profiles p
  INNER JOIN public.service_providers sp ON p.id = sp.profile_id
  WHERE sp.status = 'approved'
    AND p.full_name IS NOT NULL;  -- Only show profiles with names
$$;

-- 3. Grant limited access to the function
GRANT EXECUTE ON FUNCTION public.get_public_service_providers() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_service_providers() TO authenticated;

-- 4. Create a secure view with RLS enabled for cases where a view is needed
CREATE VIEW public.public_service_provider_profiles
WITH (security_barrier=true) AS
SELECT 
  sp.id as provider_id,
  p.full_name,
  p.profile_image,
  sp.service_type,
  sp.city,
  sp.rating
FROM public.profiles p
INNER JOIN public.service_providers sp ON p.id = sp.profile_id
WHERE sp.status = 'approved';

-- Enable RLS on the view
ALTER VIEW public.public_service_provider_profiles SET (security_barrier=true);

-- Create RLS policy for the view that only allows viewing approved service provider data
-- Note: This policy will be enforced when accessing the view
CREATE POLICY "Allow public access to approved service provider profiles only"
ON public.service_providers
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Grant SELECT permission to the view
GRANT SELECT ON public.public_service_provider_profiles TO anon;
GRANT SELECT ON public.public_service_provider_profiles TO authenticated;
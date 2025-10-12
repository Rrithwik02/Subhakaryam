-- Fix Security Definer View Warning
-- The linter flagged our public_service_provider_profiles view
-- We'll recreate it without security definer to use the calling user's permissions

-- Drop the existing view
DROP VIEW IF EXISTS public.public_service_provider_profiles;

-- Recreate as a standard view (no security definer)
-- RLS will be enforced based on the querying user's permissions
CREATE VIEW public.public_service_provider_profiles AS
SELECT 
  p.id,
  p.full_name,
  p.profile_image,
  p.created_at
FROM public.profiles p
INNER JOIN public.service_providers sp ON p.id = sp.profile_id
WHERE sp.status = 'approved';

-- Ensure public access is granted
GRANT SELECT ON public.public_service_provider_profiles TO anon;
GRANT SELECT ON public.public_service_provider_profiles TO authenticated;
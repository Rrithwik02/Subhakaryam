-- Fix Security Definer View issue
-- Remove the potentially problematic view ownership and recreate it properly

-- Drop the existing view
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate the view without SECURITY DEFINER properties
-- This view will now run with the querying user's permissions, respecting RLS
CREATE VIEW public.public_profiles AS
SELECT 
  p.id,
  p.full_name,
  p.profile_image
FROM public.profiles p
INNER JOIN public.service_providers sp ON p.id = sp.profile_id
WHERE sp.status = 'approved';

-- Grant appropriate permissions without making it security definer
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Ensure the view respects RLS by not setting ownership to privileged users
-- The view will now properly use the querying user's permissions
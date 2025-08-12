-- Fix Security Definer View by recreating it without privileged ownership
-- Drop and recreate the view to ensure it's not owned by postgres

DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- Recreate the view with proper security settings
-- This view will run with the permissions of the user executing the query
CREATE VIEW public.public_profiles 
WITH (security_barrier=false, security_invoker=true) AS
SELECT 
  p.id,
  p.full_name,
  p.profile_image
FROM public.profiles p
INNER JOIN public.service_providers sp ON p.id = sp.profile_id
WHERE sp.status = 'approved';

-- Grant necessary permissions
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;
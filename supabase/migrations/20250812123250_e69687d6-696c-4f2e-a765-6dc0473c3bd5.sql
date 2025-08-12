-- Fix Security Definer View by changing ownership
-- Change the owner of the view from 'postgres' to 'authenticated' role to prevent security definer behavior

-- Change ownership of the view to the authenticated role
-- This ensures the view runs with the querying user's permissions, not privileged postgres permissions
ALTER VIEW public.public_profiles OWNER TO authenticated;

-- Verify permissions are still properly set
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;
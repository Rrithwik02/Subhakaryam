-- Fix critical security vulnerability: Function Search Path Mutable
-- Update get_public_service_providers() function to include SET search_path = public
-- This prevents search path injection attacks

CREATE OR REPLACE FUNCTION public.get_public_service_providers()
 RETURNS TABLE(id uuid, full_name text, profile_image text)
 LANGUAGE sql
 STABLE
 SET search_path = public
AS $function$
  -- Return basic info for approved service providers
  -- Fixed search path to prevent injection attacks
  SELECT 
    p.id,
    p.full_name,
    p.profile_image
  FROM public.profiles p
  INNER JOIN public.service_providers sp ON p.id = sp.profile_id
  WHERE sp.status = 'approved'
    AND p.full_name IS NOT NULL;  -- Only show profiles with names
$function$;
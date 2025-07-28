-- First, let's create the safe is_user_admin function if it doesn't exist
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = user_id
    AND user_type = 'admin'
  );
END;
$$;

-- Create a new safe is_admin function with a different name first
CREATE OR REPLACE FUNCTION public.is_admin_safe()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT public.is_user_admin(auth.uid());
$$;

-- Update all policies to use the new safe function
-- Additional services
DROP POLICY IF EXISTS "Admins can manage all additional services" ON public.additional_services;
CREATE POLICY "Admins can manage all additional services" 
ON public.additional_services 
FOR ALL 
USING (public.is_admin_safe());

-- Bookings
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
CREATE POLICY "Admins can manage all bookings" 
ON public.bookings 
FOR ALL 
USING (public.is_admin_safe());

-- Reviews
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
CREATE POLICY "Admins can manage all reviews" 
ON public.reviews 
FOR ALL 
USING (public.is_admin_safe());

-- Service providers
DROP POLICY IF EXISTS "Admins can manage all service providers" ON public.service_providers;
CREATE POLICY "Admins can manage all service providers" 
ON public.service_providers 
FOR ALL 
USING (public.is_admin_safe());

-- Service requests
DROP POLICY IF EXISTS "Admins can manage all service requests" ON public.service_requests;
CREATE POLICY "Admins can manage all service requests" 
ON public.service_requests 
FOR ALL 
USING (public.is_admin_safe());

-- Service suggestions
DROP POLICY IF EXISTS "Admins can manage all suggestions" ON public.service_suggestions;
CREATE POLICY "Admins can manage all suggestions" 
ON public.service_suggestions 
FOR ALL 
USING (public.is_admin_safe());

-- Contact submissions
DROP POLICY IF EXISTS "Admins can manage contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can manage contact submissions" 
ON public.contact_submissions 
FOR ALL 
USING (public.is_admin_safe());

-- Account deletion requests
DROP POLICY IF EXISTS "Admins can manage deletion requests" ON public.account_deletion_requests;
CREATE POLICY "Admins can manage deletion requests" 
ON public.account_deletion_requests 
FOR ALL 
USING (public.is_admin_safe());
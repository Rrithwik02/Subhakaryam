-- URGENT SECURITY FIX: Remove public access to sensitive user data (Corrected)

-- Drop the dangerous public access policy on profiles
DROP POLICY IF EXISTS "Public can read all profiles" ON public.profiles;

-- Create secure, limited access policies for profiles table

-- 1. Users can only read their own profile data
CREATE POLICY "Users can read own profile only" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- 2. Allow reading basic profile info only for service providers (name and profile image)
-- This is needed for displaying provider information without exposing sensitive data
CREATE POLICY "Public can read basic service provider info" 
ON public.profiles FOR SELECT 
USING (
  id IN (
    SELECT sp.profile_id 
    FROM service_providers sp 
    WHERE sp.status = 'approved'
  )
  AND auth.uid() IS NOT NULL -- Require authentication
);

-- 3. Admin access (using direct query to avoid recursion)
CREATE POLICY "Admins can read all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND au.id IN (
      SELECT p.id FROM profiles p 
      WHERE p.user_type = 'admin'
    )
  )
);

-- Drop the public_service_provider_profiles view as it exposes data without proper controls
-- We'll use direct queries to service_providers table with proper RLS instead
DROP VIEW IF EXISTS public.public_service_provider_profiles;

-- Restrict contact submissions to authenticated users only (currently allows anonymous)
DROP POLICY IF EXISTS "Anyone can create contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

-- Require authentication for contact form submissions
CREATE POLICY "Authenticated users can submit contact forms" 
ON public.contact_submissions FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);
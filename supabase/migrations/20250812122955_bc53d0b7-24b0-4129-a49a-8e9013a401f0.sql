-- CRITICAL SECURITY FIX: Remove public access to profiles and implement secure RLS policies

-- 1. Drop the dangerous public read access policy
DROP POLICY IF EXISTS "Public read access to profiles" ON public.profiles;

-- 2. Drop existing conflicting policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Drop existing policies on profiles that may conflict
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- 3. Create new secure RLS policies for profiles table
-- Users can only view their own complete profile
CREATE POLICY "Users can view their own profile securely"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile securely"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile securely"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Admins can manage all profiles using the existing is_admin() function
CREATE POLICY "Admins can manage all profiles securely"
ON public.profiles
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 4. Create a secure public view for service provider basic info only
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  p.id,
  p.full_name,
  p.profile_image
FROM public.profiles p
INNER JOIN public.service_providers sp ON p.id = sp.profile_id
WHERE sp.status = 'approved';

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- 5. Tighten service_providers table policies - remove overly broad public access
DROP POLICY IF EXISTS "Public read access" ON public.service_providers;
DROP POLICY IF EXISTS "Read all service providers" ON public.service_providers;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.service_providers;
DROP POLICY IF EXISTS "Enable read access to service providers" ON public.service_providers;
DROP POLICY IF EXISTS "Service providers are viewable by everyone" ON public.service_providers;

-- Create more secure policy for service providers - only approved providers visible to public
CREATE POLICY "Only approved service providers are publicly viewable"
ON public.service_providers
FOR SELECT
TO anon, authenticated
USING (status = 'approved');
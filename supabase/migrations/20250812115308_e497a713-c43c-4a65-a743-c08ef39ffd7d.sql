-- CRITICAL SECURITY FIX: Remove public access to profiles and implement secure RLS policies

-- 1. Drop the dangerous public read access policy
DROP POLICY IF EXISTS "Public read access to profiles" ON public.profiles;

-- 2. Create secure RLS policies for profiles table
-- Users can only view their own complete profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Admins can manage all profiles (keep existing functionality)
CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.user_type = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.user_type = 'admin'
  )
);

-- 3. Create a secure public view for service provider basic info only
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  p.id,
  p.full_name,
  p.profile_image
FROM public.profiles p
INNER JOIN public.service_providers sp ON p.id = sp.profile_id
WHERE sp.status = 'approved';

-- Enable RLS on the view and allow public read access to minimal data
ALTER VIEW public.public_profiles OWNER TO postgres;
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- 4. Tighten service_providers table policies - remove overly broad public access
DROP POLICY IF EXISTS "Public read access" ON public.service_providers;
DROP POLICY IF EXISTS "Read all service providers" ON public.service_providers;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.service_providers;
DROP POLICY IF EXISTS "Enable read access to service providers" ON public.service_providers;
DROP POLICY IF EXISTS "Service providers are viewable by everyone" ON public.service_providers;

-- Create more secure policy for service providers - only approved providers visible to public
CREATE POLICY "Approved service providers are publicly viewable"
ON public.service_providers
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Service providers can view and update their own profile (keep existing functionality)
CREATE POLICY "Service providers can manage their own profile"
ON public.service_providers
FOR ALL
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- Admins can manage all service providers (keep existing functionality)
CREATE POLICY "Admins can manage all service providers"
ON public.service_providers
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.user_type = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.user_type = 'admin'
  )
);
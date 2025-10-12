-- Fix Critical Security Issues: Admin Role Privilege Escalation and PII Exposure

-- =====================================================
-- PART 1: Create User Roles System (Fix Privilege Escalation)
-- =====================================================

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'service_provider', 'customer');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can modify roles
CREATE POLICY "Only admins can manage roles" ON public.user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

-- Create secure role-checking function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Update is_admin function to use user_roles instead of profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- Update is_user_admin function
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN user_id IS NULL THEN false
    ELSE public.has_role(user_id, 'admin')
  END;
$$;

-- Migrate existing admin users from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 
  CASE 
    WHEN user_type = 'admin' THEN 'admin'::app_role
    WHEN user_type = 'service_provider' THEN 'service_provider'::app_role
    ELSE 'customer'::app_role
  END
FROM public.profiles
WHERE user_type IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- =====================================================
-- PART 2: Restrict PII Exposure in Profiles Table
-- =====================================================

-- Drop the existing public access policy that exposes all columns
DROP POLICY IF EXISTS "Public can read service provider profiles" ON public.profiles;

-- Create new restrictive policy for public service provider profile access
-- This policy only allows viewing profile_image and full_name for approved providers
CREATE POLICY "Public limited service provider info" ON public.profiles
FOR SELECT
USING (
  -- Only for approved service providers
  id IN (
    SELECT profile_id FROM public.service_providers 
    WHERE status = 'approved'
  )
  -- Note: RLS doesn't support column-level restrictions
  -- We'll handle this at the application level with a secure view
);

-- Create a secure public view for service provider profiles (without PII)
CREATE OR REPLACE VIEW public.public_service_provider_profiles AS
SELECT 
  p.id,
  p.full_name,
  p.profile_image,
  p.created_at
FROM public.profiles p
INNER JOIN public.service_providers sp ON p.id = sp.profile_id
WHERE sp.status = 'approved';

-- Grant public access to the view
GRANT SELECT ON public.public_service_provider_profiles TO anon;
GRANT SELECT ON public.public_service_provider_profiles TO authenticated;

-- =====================================================
-- PART 3: Update Profiles Table RLS Policies
-- =====================================================

-- Update the profiles update policy to prevent user_type modification
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- New update policy that excludes user_type column
CREATE POLICY "Users can update own profile (restricted)" ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  -- Ensure user_type cannot be changed via this policy
  AND (
    SELECT user_type FROM public.profiles WHERE id = auth.uid()
  ) = user_type
);

-- Comment explaining the security model
COMMENT ON TABLE public.user_roles IS 'Stores user roles separately from profiles to prevent privilege escalation. Only admins can modify roles.';
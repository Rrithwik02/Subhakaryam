-- Fix infinite recursion in profiles table RLS policies

-- First create a security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get user role directly from auth.users raw_user_meta_data
  SELECT (raw_user_meta_data->>'user_type')::TEXT INTO user_role
  FROM auth.users 
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role = 'admin', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Drop all existing RLS policies on profiles table to start fresh
DROP POLICY IF EXISTS "Admins can manage all profiles securely" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public access to approved service provider profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can read basic service provider info" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile securely" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile securely" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile securely" ON public.profiles;

-- Create new non-recursive RLS policies for profiles
CREATE POLICY "Users can read own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Public can read service provider profiles" ON public.profiles
FOR SELECT USING (
  id IN (
    SELECT profile_id FROM service_providers 
    WHERE status = 'approved'
  )
);
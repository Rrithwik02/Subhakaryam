-- Fix infinite recursion in profiles RLS policies

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are visible to everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Allow public read access to profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Also ensure service_providers policies don't cause recursion
DROP POLICY IF EXISTS "Service providers are publicly visible when approved" ON public.service_providers;
DROP POLICY IF EXISTS "Users can view their own provider profile" ON public.service_providers;
DROP POLICY IF EXISTS "Users can update their own provider profile" ON public.service_providers;
DROP POLICY IF EXISTS "Users can insert their own provider profile" ON public.service_providers;

-- Create simple service_providers policies
CREATE POLICY "Public read access to approved service providers" 
ON public.service_providers FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can view their own service provider profile" 
ON public.service_providers FOR SELECT 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own service provider profile" 
ON public.service_providers FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own service provider profile" 
ON public.service_providers FOR UPDATE 
USING (auth.uid() = profile_id);
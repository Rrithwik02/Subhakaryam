-- Final fix for infinite recursion in profiles and service_providers policies

-- First, drop ALL existing policies on profiles to start fresh
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Drop ALL existing policies on service_providers to start fresh
DROP POLICY IF EXISTS "Public read access to approved service providers" ON public.service_providers;
DROP POLICY IF EXISTS "Users can view their own service provider profile" ON public.service_providers;
DROP POLICY IF EXISTS "Users can insert their own service provider profile" ON public.service_providers;
DROP POLICY IF EXISTS "Users can update their own service provider profile" ON public.service_providers;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Public can read all profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create simple, non-recursive policies for service_providers
CREATE POLICY "Public can read approved service providers" 
ON public.service_providers FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Authenticated users can read own service provider profile" 
ON public.service_providers FOR SELECT 
USING (auth.uid() = profile_id);

CREATE POLICY "Authenticated users can insert own service provider profile" 
ON public.service_providers FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Authenticated users can update own service provider profile" 
ON public.service_providers FOR UPDATE 
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- Admin policies (using direct comparison, no function calls)
CREATE POLICY "Admins can manage profiles" 
ON public.profiles FOR ALL 
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

CREATE POLICY "Admins can manage service providers" 
ON public.service_providers FOR ALL 
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
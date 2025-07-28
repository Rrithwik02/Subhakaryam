-- Now clean up the profiles table policies
DROP POLICY IF EXISTS "Admin full access" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read their own profile and admins to read all" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for everyone" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for service providers" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile image" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Now we can safely drop the old is_admin functions
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_admin(user_id uuid);

-- Rename the safe function to is_admin
ALTER FUNCTION public.is_admin_safe() RENAME TO is_admin;

-- Create clean, minimal RLS policies for profiles table
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Admins can manage all profiles (using safe function)
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Public read access for basic profile info
CREATE POLICY "Public read access to profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Update all other policies to use the renamed function
-- Additional services
DROP POLICY IF EXISTS "Admins can manage all additional services" ON public.additional_services;
CREATE POLICY "Admins can manage all additional services" 
ON public.additional_services 
FOR ALL 
USING (public.is_admin());

-- Bookings
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
CREATE POLICY "Admins can manage all bookings" 
ON public.bookings 
FOR ALL 
USING (public.is_admin());

-- Reviews
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
CREATE POLICY "Admins can manage all reviews" 
ON public.reviews 
FOR ALL 
USING (public.is_admin());

-- Service providers
DROP POLICY IF EXISTS "Admins can manage all service providers" ON public.service_providers;
CREATE POLICY "Admins can manage all service providers" 
ON public.service_providers 
FOR ALL 
USING (public.is_admin());

-- Service requests
DROP POLICY IF EXISTS "Admins can manage all service requests" ON public.service_requests;
CREATE POLICY "Admins can manage all service requests" 
ON public.service_requests 
FOR ALL 
USING (public.is_admin());

-- Service suggestions
DROP POLICY IF EXISTS "Admins can manage all suggestions" ON public.service_suggestions;
CREATE POLICY "Admins can manage all suggestions" 
ON public.service_suggestions 
FOR ALL 
USING (public.is_admin());

-- Contact submissions
DROP POLICY IF EXISTS "Admins can manage contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can manage contact submissions" 
ON public.contact_submissions 
FOR ALL 
USING (public.is_admin());

-- Account deletion requests
DROP POLICY IF EXISTS "Admins can manage deletion requests" ON public.account_deletion_requests;
CREATE POLICY "Admins can manage deletion requests" 
ON public.account_deletion_requests 
FOR ALL 
USING (public.is_admin());
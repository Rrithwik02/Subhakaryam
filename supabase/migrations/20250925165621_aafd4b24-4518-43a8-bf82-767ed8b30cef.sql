-- Fix SECURITY DEFINER views by removing SECURITY DEFINER and ensuring proper RLS policies

-- First, let's check what the current views look like
-- We'll drop and recreate them without SECURITY DEFINER

-- 1. Drop existing SECURITY DEFINER views
DROP VIEW IF EXISTS public.public_service_provider_profiles;
DROP VIEW IF EXISTS public.public_reviews;  
DROP VIEW IF EXISTS public.public_service_providers;

-- 2. Create new views WITHOUT SECURITY DEFINER that rely on RLS policies

-- Public Service Provider Profiles View
-- This exposes basic provider profile information for public consumption
CREATE OR REPLACE VIEW public.public_service_provider_profiles AS
SELECT 
    sp.id as provider_id,
    sp.rating,
    p.full_name,
    p.profile_image,
    sp.service_type,
    sp.city
FROM service_providers sp
INNER JOIN profiles p ON sp.profile_id = p.id
WHERE sp.status = 'approved';

-- Public Reviews View  
-- This exposes approved reviews with anonymized user information
CREATE OR REPLACE VIEW public.public_reviews AS
SELECT 
    r.id,
    r.provider_id,
    r.rating,
    r.created_at,
    r.comment,
    -- Generate anonymous user identifier
    'user_' || substring(r.user_id::text from 1 for 8) as anonymous_user_id
FROM reviews r
WHERE r.status = 'approved';

-- Public Service Providers View
-- This exposes approved service provider business information
CREATE OR REPLACE VIEW public.public_service_providers AS
SELECT 
    sp.id,
    sp.base_price,
    sp.rating,
    sp.is_premium,
    sp.created_at,
    sp.service_type,
    sp.business_name as display_name,
    sp.description,
    sp.city,
    sp.portfolio_images,
    sp.specializations,
    sp.subcategory,
    sp.portfolio_link
FROM service_providers sp
WHERE sp.status = 'approved';

-- 3. Ensure proper RLS policies exist for public access
-- Enable RLS on the views (views inherit RLS from underlying tables)

-- Make sure service_providers table allows public read access for approved providers
-- (This policy should already exist based on the schema, but let's ensure it's correct)
DO $$ 
BEGIN
    -- Check if the policy exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'service_providers' 
        AND policyname = 'Public access to approved providers'
    ) THEN
        CREATE POLICY "Public access to approved providers" 
        ON service_providers 
        FOR SELECT 
        USING (status = 'approved');
    END IF;
END $$;

-- Make sure reviews table allows public read access for approved reviews  
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' 
        AND policyname = 'Public access to approved reviews'
    ) THEN
        CREATE POLICY "Public access to approved reviews" 
        ON reviews 
        FOR SELECT 
        USING (status = 'approved');
    END IF;
END $$;

-- Make sure profiles table allows public read access for basic info
-- (Only for service providers who are approved)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Public access to approved service provider profiles'
    ) THEN
        CREATE POLICY "Public access to approved service provider profiles" 
        ON profiles 
        FOR SELECT 
        USING (
            id IN (
                SELECT profile_id 
                FROM service_providers 
                WHERE status = 'approved'
            )
        );
    END IF;
END $$;

-- 4. Grant necessary permissions for public access to views
GRANT SELECT ON public.public_service_provider_profiles TO anon, authenticated;
GRANT SELECT ON public.public_reviews TO anon, authenticated;  
GRANT SELECT ON public.public_service_providers TO anon, authenticated;

-- 5. Add comments for documentation
COMMENT ON VIEW public.public_service_provider_profiles IS 'Public view of approved service provider profile information';
COMMENT ON VIEW public.public_reviews IS 'Public view of approved reviews with anonymized user data';
COMMENT ON VIEW public.public_service_providers IS 'Public view of approved service provider business information';
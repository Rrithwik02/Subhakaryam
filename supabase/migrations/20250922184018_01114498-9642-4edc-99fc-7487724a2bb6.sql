-- Security Enhancement Migration: Fix Critical Data Exposure Issues
-- This migration addresses multiple security vulnerabilities identified in the security review

-- 1. Create secure public view for reviews (masks user_id)
CREATE OR REPLACE VIEW public.public_reviews AS
SELECT 
    r.id,
    r.provider_id,
    r.rating,
    r.comment,
    r.created_at,
    -- Mask user identity with anonymous identifier
    'user_' || substring(r.user_id::text from 1 for 8) as anonymous_user_id
FROM reviews r
WHERE r.status = 'approved';

-- 2. Create secure public view for service providers (masks profile_id and sensitive data)
CREATE OR REPLACE VIEW public.public_service_providers AS
SELECT 
    sp.id,
    sp.service_type,
    sp.base_price,
    sp.rating,
    sp.is_premium,
    sp.created_at,
    -- Mask business name partially for privacy
    CASE 
        WHEN length(sp.business_name) > 10 
        THEN left(sp.business_name, 8) || '***'
        ELSE sp.business_name
    END as display_name,
    sp.description,
    -- Mask exact location, show only city
    sp.city,
    sp.portfolio_images,
    sp.specializations,
    sp.subcategory,
    -- Remove sensitive fields: profile_id, exact business_name, secondary_city
    sp.portfolio_link
FROM service_providers sp
WHERE sp.status = 'approved';

-- 3. Update service_provider_availability RLS policies to be more restrictive
DROP POLICY IF EXISTS "Anyone can view availability" ON service_provider_availability;

-- New restrictive policy: Only allow viewing availability for specific provider queries
CREATE POLICY "Restricted availability access" 
ON service_provider_availability 
FOR SELECT 
USING (
    -- Allow authenticated users to view availability when specifically querying for a provider
    auth.uid() IS NOT NULL 
    AND (
        -- Provider can see their own availability
        provider_id IN (
            SELECT sp.id 
            FROM service_providers sp 
            WHERE sp.profile_id = auth.uid()
        )
        OR
        -- Users can see availability only for approved providers
        provider_id IN (
            SELECT sp.id 
            FROM service_providers sp 
            WHERE sp.status = 'approved'
        )
    )
);

-- 4. Create function to get secure provider details with controlled access
CREATE OR REPLACE FUNCTION public.get_secure_provider_details(provider_id_param uuid)
RETURNS TABLE(
    id uuid,
    service_type text,
    base_price numeric,
    rating numeric,
    display_name text,
    description text,
    city text,
    portfolio_images text[],
    specializations text[],
    subcategory text,
    portfolio_link text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- Return masked provider details for public consumption
    SELECT 
        sp.id,
        sp.service_type,
        sp.base_price,
        sp.rating,
        CASE 
            WHEN length(sp.business_name) > 10 
            THEN left(sp.business_name, 8) || '***'
            ELSE sp.business_name
        END as display_name,
        sp.description,
        sp.city,
        sp.portfolio_images,
        sp.specializations,
        sp.subcategory,
        sp.portfolio_link
    FROM service_providers sp
    WHERE sp.id = provider_id_param 
    AND sp.status = 'approved';
$$;

-- 5. Create function to get secure reviews for a provider
CREATE OR REPLACE FUNCTION public.get_secure_provider_reviews(provider_id_param uuid)
RETURNS TABLE(
    id uuid,
    rating integer,
    comment text,
    created_at timestamptz,
    anonymous_user_id text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- Return reviews with masked user identities
    SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        'user_' || substring(r.user_id::text from 1 for 8) as anonymous_user_id
    FROM reviews r
    WHERE r.provider_id = provider_id_param 
    AND r.status = 'approved'
    ORDER BY r.created_at DESC;
$$;

-- 6. Update RLS policy for reviews to prevent direct user_id exposure
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;

-- Create more restrictive policy - only allow access through secure functions
CREATE POLICY "Secure review access only" 
ON reviews 
FOR SELECT 
USING (
    -- Only allow access for the review owner, provider, or admin
    auth.uid() = user_id 
    OR provider_id IN (
        SELECT sp.id 
        FROM service_providers sp 
        WHERE sp.profile_id = auth.uid()
    )
    OR is_admin()
);

-- 7. Grant necessary permissions for the secure views and functions
GRANT SELECT ON public.public_reviews TO anon, authenticated;
GRANT SELECT ON public.public_service_providers TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_secure_provider_details(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_secure_provider_reviews(uuid) TO anon, authenticated;
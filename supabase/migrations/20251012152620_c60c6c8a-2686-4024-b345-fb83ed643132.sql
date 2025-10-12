-- Document the security design of public_service_providers view
-- Views automatically inherit RLS from their underlying base tables
-- This migration adds explicit documentation for security review purposes

-- Add comment documenting the view's intentional public access and security design
COMMENT ON VIEW public.public_service_providers 
  IS 'Public view of approved service providers. Intentionally exposes limited, non-sensitive data (id, full_name, profile_image, created_at). Does not expose PII like email or phone numbers. RLS is enforced through the underlying profiles and service_providers tables. Any changes to this view definition should be carefully reviewed to prevent accidental exposure of sensitive information.';
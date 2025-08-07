-- Enable leaked password protection for security
-- This addresses the WARN security issue from the linter

-- Note: This migration is intentionally empty as leaked password protection
-- is an Auth configuration setting that must be enabled in the Supabase dashboard
-- under Authentication > Settings > Password Protection

-- The user needs to:
-- 1. Go to: https://supabase.com/dashboard/project/eldgizccualhhhaczooa/auth/providers
-- 2. Scroll to "Password Protection" section  
-- 3. Enable "Leaked Password Protection"
-- 4. Save the settings

-- This SQL file serves as documentation of this required manual step
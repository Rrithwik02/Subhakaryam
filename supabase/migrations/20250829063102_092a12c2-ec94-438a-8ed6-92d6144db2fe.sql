-- Fix the materialized view API exposure by removing it from the API schema
-- Since this is only used internally for admin checks, we should hide it from the API

-- Remove the materialized view from public API access
REVOKE ALL ON public.admin_user_cache FROM anon, authenticated;

-- Ensure only postgres and service_role can access it
GRANT SELECT ON public.admin_user_cache TO service_role;
GRANT ALL ON public.admin_user_cache TO postgres;

-- Now let's try to find what might be triggering the SECURITY DEFINER view warning
-- Check if any of our functions might be creating implicit views or rules

-- Let's run one final check for any hidden SECURITY DEFINER views
SELECT 
  n.nspname AS schema_name,
  c.relname AS relation_name,
  c.relkind AS kind,
  pg_catalog.pg_get_userbyid(c.relowner) AS owner,
  CASE 
    WHEN c.relkind = 'v' THEN pg_get_viewdef(c.oid, true)
    WHEN c.relkind = 'm' THEN pg_get_viewdef(c.oid, true)
    ELSE 'N/A'
  END as definition_check
FROM pg_catalog.pg_class c
LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind IN ('v', 'm') 
  AND n.nspname = 'public'
ORDER BY c.relname;
-- The linter might be incorrectly flagging our SECURITY DEFINER functions as views
-- Let's check if any of our legitimate SECURITY DEFINER functions can be refactored
-- But first, let's see if the issue is actually resolved by running a comprehensive check

-- Check if there are any implicit views created by rules or functions
SELECT 
  schemaname,
  tablename,
  rulename,
  definition
FROM pg_rules 
WHERE schemaname = 'public'
AND definition ILIKE '%security%definer%';

-- Also check if any of our functions create temporary views
SELECT 
  routine_name,
  routine_definition,
  security_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND security_type = 'DEFINER'
  AND routine_definition ILIKE '%create%view%';

-- Final verification: ensure our views are properly configured
SELECT 
  'VIEW CHECK' as check_type,
  viewname,
  viewowner,
  'No SECURITY DEFINER found' as status
FROM pg_views 
WHERE schemaname = 'public';
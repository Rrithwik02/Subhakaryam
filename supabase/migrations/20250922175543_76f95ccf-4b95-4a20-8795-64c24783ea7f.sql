-- Fix materialized view API exposure issue
-- The materialized view should not be accessible via the API

-- Enable RLS on the materialized view to restrict access
ALTER TABLE admin_user_cache ENABLE ROW LEVEL SECURITY;

-- Create a policy that only allows the functions that need it to access it
CREATE POLICY "Function access only for admin cache" ON admin_user_cache
  FOR SELECT
  USING (false); -- No direct access via API

-- Grant usage to specific functions that need it
-- The functions will access it programmatically, not via API
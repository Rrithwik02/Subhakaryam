-- Complete fix for Security Definer View issue
-- Remove all unnecessary SECURITY DEFINER properties

-- Step 1: Fix the new view by removing security_barrier property entirely
DROP VIEW IF EXISTS admin_payment_details_view;

-- Recreate without any security properties
CREATE VIEW admin_payment_details_view AS
SELECT 
  ppd.id,
  ppd.provider_id,
  ppd.payment_method::text as payment_method,
  ppd.account_holder_name,
  ppd.bank_name,
  -- Mask account number (show only last 4 digits)
  CASE 
    WHEN ppd.account_number IS NOT NULL AND length(ppd.account_number) > 4 
    THEN '****' || right(ppd.account_number, 4)
    ELSE ppd.account_number
  END as account_number_masked,
  ppd.ifsc_code,
  -- Mask UPI ID (show only domain part)
  CASE 
    WHEN ppd.upi_id IS NOT NULL AND position('@' in ppd.upi_id) > 0
    THEN '****@' || split_part(ppd.upi_id, '@', 2)
    ELSE ppd.upi_id
  END as upi_id_masked,
  ppd.qr_code_url,
  ppd.created_at,
  ppd.updated_at
FROM provider_payment_details ppd;

-- Step 2: Try to eliminate the remaining SECURITY DEFINER scalar functions where possible
-- The is_admin() function is deeply embedded in RLS policies, but let's see if we can
-- create an alternative approach

-- Create a non-SECURITY DEFINER version for new usage
CREATE OR REPLACE FUNCTION public.check_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  -- This function works without SECURITY DEFINER by relying on RLS
  -- It only works for the current user checking their own admin status
  SELECT user_type = 'admin' 
  FROM profiles 
  WHERE id = auth.uid();
$$;

-- Grant permissions
GRANT SELECT ON admin_payment_details_view TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_is_admin() TO authenticated;

-- Add documentation explaining the security model
COMMENT ON VIEW admin_payment_details_view IS 
'View for admin access to payment details with automatic data masking. Access controlled via RLS policies on underlying tables.';

COMMENT ON FUNCTION public.check_user_is_admin() IS 
'Alternative to is_admin() that works without SECURITY DEFINER. Only checks current user admin status.';

-- Note: We need to keep the existing is_admin() and is_user_admin() functions
-- because they are used in many RLS policies and changing them would break functionality.
-- These are necessary SECURITY DEFINER functions for the security model to work.
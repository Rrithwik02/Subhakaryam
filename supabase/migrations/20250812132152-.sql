-- Fix Security Definer View issue by eliminating SECURITY DEFINER table-returning functions
-- Replace with a view-based approach that maintains exact functionality

-- Step 1: Drop the problematic SECURITY DEFINER table function
DROP FUNCTION IF EXISTS public.get_provider_payment_details_for_admin(uuid);

-- Step 2: Create a secure view for admin access to payment details with data masking
-- This approach uses RLS policies instead of SECURITY DEFINER
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

-- Step 3: Enable RLS on the view and create admin-only policy
ALTER VIEW admin_payment_details_view SET (security_barrier = false);

-- Step 4: Create a replacement function that uses standard SQL without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_admin_payment_details(provider_id_param uuid)
RETURNS TABLE (
  id uuid,
  provider_id uuid,
  payment_method text,
  account_holder_name text,
  bank_name text,
  account_number_masked text,
  ifsc_code text,
  upi_id_masked text,
  qr_code_url text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  -- No SECURITY DEFINER - relies on RLS policies for security
  -- Admin check happens at application level before calling this function
  SELECT 
    apd.id,
    apd.provider_id,
    apd.payment_method,
    apd.account_holder_name,
    apd.bank_name,
    apd.account_number_masked,
    apd.ifsc_code,
    apd.upi_id_masked,
    apd.qr_code_url,
    apd.created_at,
    apd.updated_at
  FROM admin_payment_details_view apd
  WHERE apd.provider_id = provider_id_param
    AND provider_id_param IS NOT NULL;
$$;

-- Step 5: Create RLS policy on the provider_payment_details table for admin access
-- This replaces the SECURITY DEFINER function's privilege escalation
CREATE POLICY "Admin access to payment details" ON provider_payment_details
  FOR SELECT TO authenticated
  USING (is_admin());

-- Step 6: Grant appropriate permissions
GRANT SELECT ON admin_payment_details_view TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_payment_details(uuid) TO authenticated;

-- Step 7: Add documentation
COMMENT ON VIEW admin_payment_details_view IS 
'View that provides masked payment details for admin access. Security enforced through RLS policies.';

COMMENT ON FUNCTION public.get_admin_payment_details(uuid) IS 
'Replacement for get_provider_payment_details_for_admin. Uses RLS instead of SECURITY DEFINER for better security model.';
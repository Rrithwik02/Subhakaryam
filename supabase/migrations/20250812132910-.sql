-- COMPREHENSIVE SECURITY FIX
-- Resolve all fixable security issues while maintaining functionality

-- FIX 1: Secure the admin_payment_details_view with proper RLS
-- Enable RLS on the view to restrict access to admin users only
DROP VIEW IF EXISTS admin_payment_details_view;

-- Create a more secure table-based approach instead of a view
CREATE TABLE admin_payment_details_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  provider_id uuid NOT NULL,
  accessed_at timestamptz DEFAULT now()
);

-- Enable RLS on the log table
ALTER TABLE admin_payment_details_access_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the log table
CREATE POLICY "Admins can view their own access logs" ON admin_payment_details_access_log
  FOR ALL TO authenticated
  USING (admin_user_id = auth.uid() AND is_admin())
  WITH CHECK (admin_user_id = auth.uid() AND is_admin());

-- Create a secure function to get payment details for admins only
CREATE OR REPLACE FUNCTION public.get_secure_payment_details_for_admin(provider_id_param uuid)
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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user is admin first
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Log the access
  INSERT INTO admin_payment_details_access_log (admin_user_id, provider_id)
  VALUES (auth.uid(), provider_id_param);
  
  -- Return masked payment details
  RETURN QUERY
  SELECT 
    ppd.id,
    ppd.provider_id,
    ppd.payment_method::text,
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
  FROM provider_payment_details ppd
  WHERE ppd.provider_id = provider_id_param;
END;
$$;

-- FIX 2: Secure the materialized view by hiding it from API
-- Revoke public access to admin_user_cache
REVOKE ALL ON admin_user_cache FROM anon;
REVOKE ALL ON admin_user_cache FROM authenticated;

-- Only grant access to specific functions that need it
GRANT SELECT ON admin_user_cache TO postgres;

-- FIX 3: Fix functions with mutable search paths
-- Find and fix functions without proper search_path
CREATE OR REPLACE FUNCTION refresh_admin_cache()
RETURNS void
LANGUAGE sql
SET search_path TO 'public'
AS $$
  REFRESH MATERIALIZED VIEW admin_user_cache;
$$;

CREATE OR REPLACE FUNCTION update_admin_cache()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Only refresh if user_type changed to/from admin
  IF (OLD.user_type IS DISTINCT FROM NEW.user_type) AND 
     (OLD.user_type = 'admin' OR NEW.user_type = 'admin') THEN
    PERFORM refresh_admin_cache();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_security_architecture_info()
RETURNS text
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT 'This database uses SECURITY DEFINER functions for RLS policy evaluation. ' ||
         'is_admin() and is_user_admin() are essential security functions that cannot be eliminated. ' ||
         'For new development, prefer check_current_user_admin() when possible.';
$$;

-- FIX 4: Remove the old get_admin_payment_details function that's not properly secured
DROP FUNCTION IF EXISTS public.get_admin_payment_details(uuid);

-- Grant minimal permissions to the new secure function
GRANT EXECUTE ON FUNCTION public.get_secure_payment_details_for_admin(uuid) TO authenticated;

-- Add security documentation
COMMENT ON FUNCTION public.get_secure_payment_details_for_admin(uuid) IS 
'Secure admin function for accessing masked payment details. Includes access logging and admin verification.';

COMMENT ON TABLE admin_payment_details_access_log IS 
'Audit log for admin access to sensitive payment details. Helps track who accessed what data when.';
-- Instead of removing SECURITY DEFINER functions that are needed for RLS,
-- let's add proper documentation and ensure they're as secure as possible

-- Update the is_admin function to be more secure and well-documented
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
  -- SECURITY DEFINER is required here because this function is used in RLS policies
  -- that need to check admin status across different tables
  -- The function only checks the current authenticated user's admin status
  SELECT public.is_user_admin(auth.uid());
$$;

-- Add comprehensive security comments
COMMENT ON FUNCTION public.is_admin() IS 
'SECURITY DEFINER required: Used by RLS policies to check if current user is admin. Only accesses current user data via auth.uid(). Essential for proper RLS policy evaluation across multiple tables.';

-- Ensure is_user_admin is as secure as possible
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow this function to be used for checking admin status
  -- Add input validation
  IF user_id IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = user_id
    AND user_type = 'admin'
  );
END;
$$;

-- Restrict the get_provider_payment_details_for_admin function to be more secure
CREATE OR REPLACE FUNCTION public.get_provider_payment_details_for_admin(provider_id_param uuid)
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
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
  -- SECURITY DEFINER required to access sensitive payment data
  -- Function includes built-in admin check and data masking for security
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
  WHERE ppd.provider_id = provider_id_param
    AND provider_id_param IS NOT NULL
    AND is_admin(); -- Built-in admin check - only admins can access
$$;

-- Revoke public access to sensitive admin function
REVOKE ALL ON FUNCTION public.get_provider_payment_details_for_admin(uuid) FROM PUBLIC;
-- Only grant to authenticated users (admins will be checked within function)
GRANT EXECUTE ON FUNCTION public.get_provider_payment_details_for_admin(uuid) TO authenticated;
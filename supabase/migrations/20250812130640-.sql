-- Create a security definer function to safely retrieve payment details for admin use
-- This function masks sensitive financial data and only returns it to authorized admins
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
AS $$
  -- Only allow admins to access this function
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
    AND is_admin(); -- Only admins can access this function
$$;

-- Drop existing policies to recreate with stronger security
DROP POLICY IF EXISTS "Service providers can insert their own payment details" ON provider_payment_details;
DROP POLICY IF EXISTS "Service providers can update their own payment details" ON provider_payment_details;
DROP POLICY IF EXISTS "Service providers can view their own payment details" ON provider_payment_details;

-- Create stronger RLS policies with explicit checks
CREATE POLICY "Providers can insert own payment details only" ON provider_payment_details
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    provider_id IN (
      SELECT sp.id 
      FROM service_providers sp 
      WHERE sp.profile_id = auth.uid() AND sp.status = 'approved'
    )
  );

CREATE POLICY "Providers can update own payment details only" ON provider_payment_details
  FOR UPDATE TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    provider_id IN (
      SELECT sp.id 
      FROM service_providers sp 
      WHERE sp.profile_id = auth.uid() AND sp.status = 'approved'
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    provider_id IN (
      SELECT sp.id 
      FROM service_providers sp 
      WHERE sp.profile_id = auth.uid() AND sp.status = 'approved'
    )
  );

CREATE POLICY "Providers can view own payment details only" ON provider_payment_details
  FOR SELECT TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    provider_id IN (
      SELECT sp.id 
      FROM service_providers sp 
      WHERE sp.profile_id = auth.uid() AND sp.status = 'approved'
    )
  );

-- Create audit trigger for payment details access
CREATE OR REPLACE FUNCTION public.audit_payment_details_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log sensitive operations on payment details
  IF TG_OP = 'INSERT' THEN
    INSERT INTO notifications (user_id, title, message, type)
    SELECT 
      sp.profile_id,
      'Payment Details Added',
      'Payment details have been securely stored for your account.',
      'security'
    FROM service_providers sp
    WHERE sp.id = NEW.provider_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO notifications (user_id, title, message, type)
    SELECT 
      sp.profile_id,
      'Payment Details Updated',
      'Your payment details have been updated.',
      'security'
    FROM service_providers sp
    WHERE sp.id = NEW.provider_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO notifications (user_id, title, message, type)
    SELECT 
      sp.profile_id,
      'Payment Details Removed',
      'Your payment details have been removed from our system.',
      'security'
    FROM service_providers sp
    WHERE sp.id = OLD.provider_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit trigger for DML operations only
DROP TRIGGER IF EXISTS audit_provider_payment_details ON provider_payment_details;
CREATE TRIGGER audit_provider_payment_details
  AFTER INSERT OR UPDATE OR DELETE ON provider_payment_details
  FOR EACH ROW EXECUTE FUNCTION audit_payment_details_access();
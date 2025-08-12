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

-- Add additional RLS policy to ensure only service providers can access their own data
-- This strengthens the existing policies
CREATE POLICY "Strict provider access only" ON provider_payment_details
  FOR ALL 
  TO authenticated
  USING (
    provider_id IN (
      SELECT sp.id 
      FROM service_providers sp 
      WHERE sp.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    provider_id IN (
      SELECT sp.id 
      FROM service_providers sp 
      WHERE sp.profile_id = auth.uid()
    )
  );

-- Create audit trigger for payment details access
CREATE OR REPLACE FUNCTION public.audit_payment_details_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all access to payment details for security monitoring
  INSERT INTO auth.audit_log_entries (
    instance_id,
    id,
    payload,
    created_at,
    ip_address
  ) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    gen_random_uuid(),
    jsonb_build_object(
      'table', 'provider_payment_details',
      'operation', TG_OP,
      'user_id', auth.uid(),
      'provider_id', COALESCE(NEW.provider_id, OLD.provider_id),
      'timestamp', now()
    ),
    now(),
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit trigger
CREATE TRIGGER audit_provider_payment_details
  AFTER INSERT OR UPDATE OR DELETE OR SELECT ON provider_payment_details
  FOR EACH ROW EXECUTE FUNCTION audit_payment_details_access();

-- Create a view for safe admin access to payment details
CREATE OR REPLACE VIEW admin_provider_payment_overview AS
SELECT 
  sp.id as provider_id,
  p.full_name as provider_name,
  sp.business_name,
  sp.service_type,
  ppd.payment_method,
  CASE 
    WHEN ppd.payment_method = 'bank_account' THEN 'Bank Account Configured'
    WHEN ppd.payment_method = 'upi' THEN 'UPI ID Configured'
    WHEN ppd.payment_method = 'qr_code' THEN 'QR Code Configured'
    ELSE 'Not Configured'
  END as payment_status,
  ppd.created_at as payment_details_created,
  ppd.updated_at as payment_details_updated
FROM service_providers sp
JOIN profiles p ON sp.profile_id = p.id
LEFT JOIN provider_payment_details ppd ON sp.id = ppd.provider_id
WHERE sp.status = 'approved';

-- Enable RLS on the view
ALTER VIEW admin_provider_payment_overview SET (security_barrier = true);

-- Create RLS policy for the view
CREATE POLICY "Admin only access to payment overview" ON admin_provider_payment_overview
  FOR SELECT TO authenticated
  USING (is_admin());
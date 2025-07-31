-- Remove commission system entirely and prepare for Razorpay integration
-- First, drop triggers and then functions to avoid dependency issues

-- 1. Drop triggers that depend on commission functions
DROP TRIGGER IF EXISTS calculate_payment_commission_trigger ON public.payments;
DROP TRIGGER IF EXISTS update_provider_commission_totals_trigger ON public.payments;

-- 2. Now drop the commission-related functions
DROP FUNCTION IF EXISTS public.get_commission_rate(text);
DROP FUNCTION IF EXISTS public.calculate_payment_commission() CASCADE;
DROP FUNCTION IF EXISTS public.update_provider_commission_totals() CASCADE;

-- 3. Drop commission-related tables
DROP TABLE IF EXISTS public.service_provider_commissions CASCADE;
DROP TABLE IF EXISTS public.payment_verification_logs CASCADE;

-- 4. Remove commission-related columns from payments table
ALTER TABLE public.payments 
DROP COLUMN IF EXISTS commission_rate,
DROP COLUMN IF EXISTS commission_amount,
DROP COLUMN IF EXISTS net_amount,
DROP COLUMN IF EXISTS fraud_score,
DROP COLUMN IF EXISTS verification_status;

-- 5. Add Razorpay-specific columns to payments table
ALTER TABLE public.payments 
ADD COLUMN razorpay_order_id TEXT,
ADD COLUMN razorpay_payment_id TEXT;

-- 6. Remove Stripe columns from payments table
ALTER TABLE public.payments 
DROP COLUMN IF EXISTS stripe_session_id,
DROP COLUMN IF EXISTS stripe_payment_intent_id;

-- 7. Remove commission-related columns from payouts table
ALTER TABLE public.payouts 
DROP COLUMN IF EXISTS commission_amount;

-- 8. Update net_amount to just be amount (no commission deduction)
UPDATE public.payouts SET net_amount = amount WHERE net_amount IS NULL OR net_amount = 0;

-- 9. Update payment notification functions to remove commission references
CREATE OR REPLACE FUNCTION public.notify_provider_payment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.admin_verified = true AND OLD.admin_verified = false THEN
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type
    )
    SELECT 
      sp.profile_id,
      'Payment Verified',
      CASE 
        WHEN NEW.payment_type = 'advance' 
        THEN format('Advance payment of ₹%s has been verified for booking %s', NEW.amount::text, NEW.booking_id::text)
        ELSE format('Final payment of ₹%s has been verified for booking %s', NEW.amount::text, NEW.booking_id::text)
      END,
      'payment'
    FROM bookings b
    JOIN service_providers sp ON b.provider_id = sp.id
    WHERE b.id = NEW.booking_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 10. Update admin payment notification function
CREATE OR REPLACE FUNCTION public.notify_admin_payment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type
  )
  SELECT 
    id,
    'New Payment Received',
    CASE 
      WHEN NEW.payment_type = 'advance' 
      THEN format('Advance payment of ₹%s received for booking %s', NEW.amount::text, NEW.booking_id::text)
      ELSE format('Final payment of ₹%s received for booking %s', NEW.amount::text, NEW.booking_id::text)
    END,
    'payment'
  FROM profiles 
  WHERE user_type = 'admin';
  
  RETURN NEW;
END;
$function$;
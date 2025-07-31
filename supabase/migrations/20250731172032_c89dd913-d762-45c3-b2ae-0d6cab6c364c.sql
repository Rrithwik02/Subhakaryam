-- Remove commission system entirely and prepare for Razorpay integration

-- 1. Remove commission-related columns from payments table
ALTER TABLE public.payments 
DROP COLUMN IF EXISTS commission_rate,
DROP COLUMN IF EXISTS commission_amount,
DROP COLUMN IF EXISTS net_amount,
DROP COLUMN IF EXISTS fraud_score,
DROP COLUMN IF EXISTS verification_status;

-- 2. Add Razorpay-specific columns to payments table
ALTER TABLE public.payments 
ADD COLUMN razorpay_order_id TEXT,
ADD COLUMN razorpay_payment_id TEXT,
DROP COLUMN IF EXISTS stripe_session_id,
DROP COLUMN IF EXISTS stripe_payment_intent_id;

-- 3. Remove commission-related columns from payouts table
ALTER TABLE public.payouts 
DROP COLUMN IF EXISTS commission_amount;

-- Update net_amount to just be amount (no commission deduction)
UPDATE public.payouts SET net_amount = amount WHERE net_amount IS NULL;

-- 4. Drop commission-related tables
DROP TABLE IF EXISTS public.service_provider_commissions;
DROP TABLE IF EXISTS public.payment_verification_logs;

-- 5. Remove commission-related database functions
DROP FUNCTION IF EXISTS public.get_commission_rate(text);
DROP FUNCTION IF EXISTS public.calculate_payment_commission();
DROP FUNCTION IF EXISTS public.update_provider_commission_totals();

-- 6. Remove commission-related triggers
DROP TRIGGER IF EXISTS calculate_payment_commission_trigger ON public.payments;
DROP TRIGGER IF EXISTS update_provider_commission_totals_trigger ON public.payments;

-- 7. Update payment notification functions to remove commission references
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
        THEN format('Advance payment of $%s has been verified for booking %s', NEW.amount::text, NEW.booking_id::text)
        ELSE format('Final payment of $%s has been verified for booking %s', NEW.amount::text, NEW.booking_id::text)
      END,
      'payment'
    FROM bookings b
    JOIN service_providers sp ON b.provider_id = sp.id
    WHERE b.id = NEW.booking_id;
  END IF;
  
  RETURN NEW;
END;
$function$;
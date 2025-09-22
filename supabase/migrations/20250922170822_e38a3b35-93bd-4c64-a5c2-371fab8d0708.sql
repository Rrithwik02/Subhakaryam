-- Fix Security Definer Functions Issue
-- 
-- The security linter flagged SECURITY DEFINER functions as a risk.
-- We need to review each function and determine if SECURITY DEFINER is necessary.
-- 
-- Functions that NEED SECURITY DEFINER (for RLS bypass - keep as is):
-- - is_admin() - Used in RLS policies, must have elevated privileges
-- - is_user_admin() - Used for admin checks, must have elevated privileges  
-- - handle_new_user() - Auth trigger function, needs elevated privileges
-- - handle_approved_deletion_request() - Needs to delete auth.users, requires elevated privileges
-- - get_secure_payment_details_for_admin() - Intentionally uses SECURITY DEFINER for admin access
-- 
-- Functions that can be CHANGED (remove SECURITY DEFINER):
-- - notify_provider_approval() - Just inserts notifications, doesn't need elevated privileges
-- - audit_payment_details_access() - Just logs access, doesn't need elevated privileges

-- Fix notify_provider_approval function
CREATE OR REPLACE FUNCTION public.notify_provider_approval()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public  -- Set search path for security
AS $function$
BEGIN
  -- If the status is being changed from 'pending' to 'approved'
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    -- Update the user's profile to service_provider type
    UPDATE profiles
    SET user_type = 'service_provider'
    WHERE id = NEW.profile_id;
    
    -- Insert a notification to inform the user
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type
    )
    VALUES (
      NEW.profile_id,
      'Service Provider Application Approved',
      'Congratulations! Your service provider application has been approved. You now have access to the provider dashboard.',
      'account_status'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix audit_payment_details_access function
CREATE OR REPLACE FUNCTION public.audit_payment_details_access()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public  -- Set search path for security
AS $function$
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
$function$;
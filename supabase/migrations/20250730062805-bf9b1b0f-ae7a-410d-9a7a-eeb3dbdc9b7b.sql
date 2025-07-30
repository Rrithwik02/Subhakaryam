-- Fix database security by setting proper search_path for all functions
-- This addresses the 12 security warnings from the linter

-- Update handle_new_user function
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$function$;

-- Update notify_account_deletion_request function
DROP FUNCTION IF EXISTS public.notify_account_deletion_request();
CREATE OR REPLACE FUNCTION public.notify_account_deletion_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
        'Account Deletion Request',
        CASE 
            WHEN NEW.status = 'pending' THEN 'New account deletion request received'
            WHEN NEW.status = 'approved' THEN 'Account deletion request approved'
            WHEN NEW.status = 'rejected' THEN 'Account deletion request rejected'
        END,
        'account_deletion'
    FROM profiles 
    WHERE user_type = 'admin';
    
    RETURN NEW;
END;
$function$;

-- Update notify_admin_payment function
DROP FUNCTION IF EXISTS public.notify_admin_payment();
CREATE OR REPLACE FUNCTION public.notify_admin_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
      THEN format('Advance payment of $%s received for booking %s', NEW.amount::text, NEW.booking_id::text)
      ELSE format('Final payment of $%s received for booking %s', NEW.amount::text, NEW.booking_id::text)
    END,
    'payment'
  FROM profiles 
  WHERE user_type = 'admin';
  
  RETURN NEW;
END;
$function$;

-- Update notify_booking_status_change function
DROP FUNCTION IF EXISTS public.notify_booking_status_change();
CREATE OR REPLACE FUNCTION public.notify_booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    IF NEW.status <> OLD.status THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            NEW.user_id,
            'Booking Status Updated',
            CASE 
                WHEN NEW.status = 'confirmed' THEN 'Your booking has been confirmed!'
                WHEN NEW.status = 'cancelled' THEN 'Your booking has been cancelled.'
                ELSE 'Your booking status has been updated to: ' || NEW.status
            END,
            'booking'
        );
    END IF;
    RETURN NEW;
END;
$function$;

-- Update notify_new_message function
DROP FUNCTION IF EXISTS public.notify_new_message();
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
        NEW.receiver_id,
        'New Message',
        'You have received a new message regarding your booking',
        'chat'
    );
    RETURN NEW;
END;
$function$;

-- Update update_provider_rating function
DROP FUNCTION IF EXISTS public.update_provider_rating();
CREATE OR REPLACE FUNCTION public.update_provider_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    UPDATE service_providers
    SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews
        WHERE provider_id = NEW.provider_id
        AND status = 'approved'
    )
    WHERE id = NEW.provider_id;
    RETURN NEW;
END;
$function$;

-- Update update_updated_at_column function
DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Update update_chat_connections_updated_at function
DROP FUNCTION IF EXISTS public.update_chat_connections_updated_at();
CREATE OR REPLACE FUNCTION public.update_chat_connections_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Update handle_approved_deletion_request function
DROP FUNCTION IF EXISTS public.handle_approved_deletion_request();
CREATE OR REPLACE FUNCTION public.handle_approved_deletion_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only proceed if the status is being changed to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Delete all user-related data from various tables
    DELETE FROM public.bookings WHERE user_id = NEW.user_id;
    DELETE FROM public.chat_messages WHERE sender_id = NEW.user_id OR receiver_id = NEW.user_id;
    DELETE FROM public.chat_connections WHERE user_id = NEW.user_id;
    DELETE FROM public.favorites WHERE user_id = NEW.user_id;
    DELETE FROM public.notifications WHERE user_id = NEW.user_id;
    DELETE FROM public.reviews WHERE user_id = NEW.user_id;
    DELETE FROM public.service_requests WHERE user_id = NEW.user_id;
    DELETE FROM public.service_suggestions WHERE user_id = NEW.user_id;
    
    -- Delete service provider data if user was a provider
    DELETE FROM public.service_providers WHERE profile_id = NEW.user_id;
    DELETE FROM public.provider_payment_details WHERE provider_id IN (
      SELECT id FROM service_providers WHERE profile_id = NEW.user_id
    );
    DELETE FROM public.service_provider_availability WHERE provider_id IN (
      SELECT id FROM service_providers WHERE profile_id = NEW.user_id
    );
    
    -- Delete the user's profile
    DELETE FROM public.profiles WHERE id = NEW.user_id;
    
    -- Delete the user from auth.users (which will cascade to other tables)
    DELETE FROM auth.users WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update handle_provider_rejection function
DROP FUNCTION IF EXISTS public.handle_provider_rejection();
CREATE OR REPLACE FUNCTION public.handle_provider_rejection()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- If the status is being changed to 'rejected'
  IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    -- Update the user's profile to be a normal user
    UPDATE profiles
    SET user_type = 'guest'
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
      'Service Provider Application Rejected',
      'Your service provider application has been rejected. Your account has been converted to a regular user account.',
      'account_status'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update notify_payment_status function
DROP FUNCTION IF EXISTS public.notify_payment_status();
CREATE OR REPLACE FUNCTION public.notify_payment_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    IF NEW.status = 'completed' THEN
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type
        )
        SELECT 
            b.user_id,
            CASE 
                WHEN NEW.payment_type = 'advance' THEN 'Advance Payment Received'
                ELSE 'Final Payment Received'
            END,
            CASE 
                WHEN NEW.payment_type = 'advance' THEN 'Your advance payment has been received. Your booking is confirmed.'
                ELSE 'Your final payment has been received. Thank you for using our service.'
            END,
            'payment'
        FROM bookings b
        WHERE b.id = NEW.booking_id;
    END IF;
    RETURN NEW;
END;
$function$;

-- Update notify_provider_payment function
DROP FUNCTION IF EXISTS public.notify_provider_payment();
CREATE OR REPLACE FUNCTION public.notify_provider_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
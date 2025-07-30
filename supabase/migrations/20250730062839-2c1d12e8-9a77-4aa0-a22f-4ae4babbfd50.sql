-- Fix database security by updating all functions with proper search_path
-- Handle triggers first, then update functions

-- Update all functions with proper search_path parameter
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.notify_account_deletion_request() SET search_path = 'public';  
ALTER FUNCTION public.notify_admin_payment() SET search_path = 'public';
ALTER FUNCTION public.notify_booking_status_change() SET search_path = 'public';
ALTER FUNCTION public.notify_new_message() SET search_path = 'public';
ALTER FUNCTION public.update_provider_rating() SET search_path = 'public';
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.update_chat_connections_updated_at() SET search_path = 'public';
ALTER FUNCTION public.handle_approved_deletion_request() SET search_path = 'public';
ALTER FUNCTION public.handle_provider_rejection() SET search_path = 'public';
ALTER FUNCTION public.notify_payment_status() SET search_path = 'public';
ALTER FUNCTION public.notify_provider_payment() SET search_path = 'public';
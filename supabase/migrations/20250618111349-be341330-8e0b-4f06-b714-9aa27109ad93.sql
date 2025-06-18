
-- First, drop the problematic policies that are causing infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all service providers" ON public.service_providers;

-- Create a security definer function to safely get user type without RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_type()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT user_type FROM public.profiles WHERE id = auth.uid();
$function$;

-- Update the is_admin function to use the security definer approach
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(public.get_current_user_type() = 'admin', false);
$function$;

-- Recreate the admin policies using the safe function
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all service providers" ON public.service_providers
  FOR ALL USING (public.is_admin());

-- Add missing policies for other tables to prevent similar issues
DO $$
BEGIN
  -- Service suggestions policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_suggestions' AND policyname = 'Users can view their own suggestions') THEN
    CREATE POLICY "Users can view their own suggestions" ON public.service_suggestions
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_suggestions' AND policyname = 'Users can create suggestions') THEN
    CREATE POLICY "Users can create suggestions" ON public.service_suggestions
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_suggestions' AND policyname = 'Admins can manage all suggestions') THEN
    CREATE POLICY "Admins can manage all suggestions" ON public.service_suggestions
      FOR ALL USING (public.is_admin());
  END IF;

  -- Reviews policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reviews' AND policyname = 'Anyone can view approved reviews') THEN
    CREATE POLICY "Anyone can view approved reviews" ON public.reviews
      FOR SELECT USING (status = 'approved');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reviews' AND policyname = 'Users can create reviews') THEN
    CREATE POLICY "Users can create reviews" ON public.reviews
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reviews' AND policyname = 'Users can update their own reviews') THEN
    CREATE POLICY "Users can update their own reviews" ON public.reviews
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reviews' AND policyname = 'Admins can manage all reviews') THEN
    CREATE POLICY "Admins can manage all reviews" ON public.reviews
      FOR ALL USING (public.is_admin());
  END IF;

  -- Notifications policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'notifications' AND policyname = 'Users can view their own notifications') THEN
    CREATE POLICY "Users can view their own notifications" ON public.notifications
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'notifications' AND policyname = 'Users can update their own notifications') THEN
    CREATE POLICY "Users can update their own notifications" ON public.notifications
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Favorites policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'favorites' AND policyname = 'Users can manage their own favorites') THEN
    CREATE POLICY "Users can manage their own favorites" ON public.favorites
      FOR ALL USING (auth.uid() = user_id);
  END IF;

  -- Chat policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'chat_messages' AND policyname = 'Users can view messages they sent or received') THEN
    CREATE POLICY "Users can view messages they sent or received" ON public.chat_messages
      FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'chat_messages' AND policyname = 'Users can send messages') THEN
    CREATE POLICY "Users can send messages" ON public.chat_messages
      FOR INSERT WITH CHECK (auth.uid() = sender_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'chat_connections' AND policyname = 'Users can view their own chat connections') THEN
    CREATE POLICY "Users can view their own chat connections" ON public.chat_connections
      FOR SELECT USING (auth.uid() = user_id OR auth.uid() = provider_id);
  END IF;

  -- Payments policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'Users can view their own payments') THEN
    CREATE POLICY "Users can view their own payments" ON public.payments
      FOR SELECT USING (
        booking_id IN (
          SELECT id FROM bookings WHERE user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'Providers can view their payments') THEN
    CREATE POLICY "Providers can view their payments" ON public.payments
      FOR SELECT USING (
        booking_id IN (
          SELECT b.id FROM bookings b
          JOIN service_providers sp ON b.provider_id = sp.id
          WHERE sp.profile_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'Admins can manage all payments') THEN
    CREATE POLICY "Admins can manage all payments" ON public.payments
      FOR ALL USING (public.is_admin());
  END IF;

  -- Additional services policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'additional_services' AND policyname = 'Anyone can view approved additional services') THEN
    CREATE POLICY "Anyone can view approved additional services" ON public.additional_services
      FOR SELECT USING (status = 'approved');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'additional_services' AND policyname = 'Providers can manage their own additional services') THEN
    CREATE POLICY "Providers can manage their own additional services" ON public.additional_services
      FOR ALL USING (
        provider_id IN (
          SELECT id FROM service_providers WHERE profile_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'additional_services' AND policyname = 'Admins can manage all additional services') THEN
    CREATE POLICY "Admins can manage all additional services" ON public.additional_services
      FOR ALL USING (public.is_admin());
  END IF;

  -- Account deletion requests policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'account_deletion_requests' AND policyname = 'Users can view their own deletion requests') THEN
    CREATE POLICY "Users can view their own deletion requests" ON public.account_deletion_requests
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'account_deletion_requests' AND policyname = 'Users can create deletion requests') THEN
    CREATE POLICY "Users can create deletion requests" ON public.account_deletion_requests
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'account_deletion_requests' AND policyname = 'Admins can manage deletion requests') THEN
    CREATE POLICY "Admins can manage deletion requests" ON public.account_deletion_requests
      FOR ALL USING (public.is_admin());
  END IF;

END $$;

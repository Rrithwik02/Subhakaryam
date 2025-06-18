
-- Enable RLS on tables that don't have it yet
DO $$
BEGIN
  -- Enable RLS if not already enabled
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'service_providers') THEN
    ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'service_suggestions') THEN
    ALTER TABLE public.service_suggestions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
    ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews') THEN
    ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
    ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'favorites') THEN
    ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chat_messages') THEN
    ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chat_connections') THEN
    ALTER TABLE public.chat_connections ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments') THEN
    ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'additional_services') THEN
    ALTER TABLE public.additional_services ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'service_provider_availability') THEN
    ALTER TABLE public.service_provider_availability ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'provider_payment_details') THEN
    ALTER TABLE public.provider_payment_details ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'contact_submissions') THEN
    ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'account_deletion_requests') THEN
    ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Profiles policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view their own profile') THEN
    CREATE POLICY "Users can view their own profile" ON public.profiles
      FOR SELECT USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
    CREATE POLICY "Users can update their own profile" ON public.profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins can view all profiles') THEN
    CREATE POLICY "Admins can view all profiles" ON public.profiles
      FOR ALL USING (public.is_admin());
  END IF;

  -- Service providers policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_providers' AND policyname = 'Anyone can view approved service providers') THEN
    CREATE POLICY "Anyone can view approved service providers" ON public.service_providers
      FOR SELECT USING (status = 'approved');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_providers' AND policyname = 'Providers can view and update their own data') THEN
    CREATE POLICY "Providers can view and update their own data" ON public.service_providers
      FOR ALL USING (auth.uid() = profile_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_providers' AND policyname = 'Admins can manage all service providers') THEN
    CREATE POLICY "Admins can manage all service providers" ON public.service_providers
      FOR ALL USING (public.is_admin());
  END IF;

  -- Service requests policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_requests' AND policyname = 'Users can view their own requests') THEN
    CREATE POLICY "Users can view their own requests" ON public.service_requests
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_requests' AND policyname = 'Users can update their own service requests') THEN
    CREATE POLICY "Users can update their own service requests" ON public.service_requests
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_requests' AND policyname = 'Providers can view requests for their services') THEN
    CREATE POLICY "Providers can view requests for their services" ON public.service_requests
      FOR SELECT USING (
        provider_id IN (
          SELECT id FROM service_providers WHERE profile_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_requests' AND policyname = 'Admins can manage all service requests') THEN
    CREATE POLICY "Admins can manage all service requests" ON public.service_requests
      FOR ALL USING (public.is_admin());
  END IF;

  -- Bookings policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'Users can view their own bookings') THEN
    CREATE POLICY "Users can view their own bookings" ON public.bookings
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'Users can create bookings') THEN
    CREATE POLICY "Users can create bookings" ON public.bookings
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'Users can update their own bookings') THEN
    CREATE POLICY "Users can update their own bookings" ON public.bookings
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'Providers can view their bookings') THEN
    CREATE POLICY "Providers can view their bookings" ON public.bookings
      FOR SELECT USING (
        provider_id IN (
          SELECT id FROM service_providers WHERE profile_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'Providers can update their bookings') THEN
    CREATE POLICY "Providers can update their bookings" ON public.bookings
      FOR UPDATE USING (
        provider_id IN (
          SELECT id FROM service_providers WHERE profile_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'Admins can manage all bookings') THEN
    CREATE POLICY "Admins can manage all bookings" ON public.bookings
      FOR ALL USING (public.is_admin());
  END IF;

  -- Contact submissions policies (admin only)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_submissions' AND policyname = 'Admins can manage contact submissions') THEN
    CREATE POLICY "Admins can manage contact submissions" ON public.contact_submissions
      FOR ALL USING (public.is_admin());
  END IF;

END $$;

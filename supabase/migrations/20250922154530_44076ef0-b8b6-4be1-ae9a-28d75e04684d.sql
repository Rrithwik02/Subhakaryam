-- Create service bundles table
CREATE TABLE public.service_bundles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  bundle_name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC NOT NULL,
  discounted_price NUMERIC NOT NULL,
  discount_percentage INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN base_price > 0 THEN ROUND(((base_price - discounted_price) / base_price * 100)::numeric)
      ELSE 0 
    END
  ) STORED,
  is_active BOOLEAN DEFAULT true,
  min_advance_percentage INTEGER DEFAULT 30,
  max_guests INTEGER,
  duration_days INTEGER DEFAULT 1,
  portfolio_images TEXT[] DEFAULT '{}',
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_service_bundles_provider FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Create bundle items table (what services are included)
CREATE TABLE public.bundle_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID NOT NULL,
  service_type TEXT NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  individual_price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_bundle_items_bundle FOREIGN KEY (bundle_id) REFERENCES service_bundles(id) ON DELETE CASCADE
);

-- Create bundle bookings table
CREATE TABLE public.bundle_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bundle_id UUID NOT NULL,
  event_date DATE NOT NULL,
  guest_count INTEGER,
  total_amount NUMERIC NOT NULL,
  advance_amount NUMERIC,
  status TEXT DEFAULT 'pending',
  special_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_bundle_bookings_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_bundle_bookings_bundle FOREIGN KEY (bundle_id) REFERENCES service_bundles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.service_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_bundles
CREATE POLICY "Anyone can view active bundles" 
ON public.service_bundles 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Providers can manage their own bundles" 
ON public.service_bundles 
FOR ALL 
USING (provider_id IN (
  SELECT id FROM service_providers WHERE profile_id = auth.uid()
));

CREATE POLICY "Admins can manage all bundles" 
ON public.service_bundles 
FOR ALL 
USING (is_admin());

-- RLS Policies for bundle_items
CREATE POLICY "Anyone can view bundle items for active bundles" 
ON public.bundle_items 
FOR SELECT 
USING (bundle_id IN (
  SELECT id FROM service_bundles WHERE is_active = true
));

CREATE POLICY "Providers can manage their bundle items" 
ON public.bundle_items 
FOR ALL 
USING (bundle_id IN (
  SELECT sb.id FROM service_bundles sb 
  JOIN service_providers sp ON sb.provider_id = sp.id 
  WHERE sp.profile_id = auth.uid()
));

CREATE POLICY "Admins can manage all bundle items" 
ON public.bundle_items 
FOR ALL 
USING (is_admin());

-- RLS Policies for bundle_bookings
CREATE POLICY "Users can view their own bundle bookings" 
ON public.bundle_bookings 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own bundle bookings" 
ON public.bundle_bookings 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bundle bookings" 
ON public.bundle_bookings 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Providers can view bookings for their bundles" 
ON public.bundle_bookings 
FOR SELECT 
USING (bundle_id IN (
  SELECT sb.id FROM service_bundles sb 
  JOIN service_providers sp ON sb.provider_id = sp.id 
  WHERE sp.profile_id = auth.uid()
));

CREATE POLICY "Providers can update bookings for their bundles" 
ON public.bundle_bookings 
FOR UPDATE 
USING (bundle_id IN (
  SELECT sb.id FROM service_bundles sb 
  JOIN service_providers sp ON sb.provider_id = sp.id 
  WHERE sp.profile_id = auth.uid()
));

CREATE POLICY "Admins can manage all bundle bookings" 
ON public.bundle_bookings 
FOR ALL 
USING (is_admin());

-- Create indexes for performance
CREATE INDEX idx_service_bundles_provider_id ON service_bundles(provider_id);
CREATE INDEX idx_service_bundles_active ON service_bundles(is_active);
CREATE INDEX idx_bundle_items_bundle_id ON bundle_items(bundle_id);
CREATE INDEX idx_bundle_bookings_user_id ON bundle_bookings(user_id);
CREATE INDEX idx_bundle_bookings_bundle_id ON bundle_bookings(bundle_id);

-- Add trigger for updated_at
CREATE TRIGGER update_service_bundles_updated_at
  BEFORE UPDATE ON service_bundles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bundle_bookings_updated_at
  BEFORE UPDATE ON bundle_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
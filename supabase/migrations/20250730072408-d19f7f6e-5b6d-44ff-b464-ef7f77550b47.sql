-- Phase 1 & 2: Service Provider Payment Enhancement
-- Create service provider commissions table
CREATE TABLE public.service_provider_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 15.00, -- percentage
  tier TEXT NOT NULL DEFAULT 'basic' CHECK (tier IN ('basic', 'premium', 'vip')),
  total_earnings DECIMAL(12,2) DEFAULT 0,
  total_commission_paid DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payouts table
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  commission_amount DECIMAL(12,2) NOT NULL,
  net_amount DECIMAL(12,2) NOT NULL,
  payout_method TEXT NOT NULL DEFAULT 'bank_transfer' CHECK (payout_method IN ('bank_transfer', 'upi', 'wallet')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  payout_reference TEXT,
  payout_date DATE,
  processed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment verification logs table
CREATE TABLE public.payment_verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('manual', 'automated', 'fraud_check', 'two_factor')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  verified_by UUID REFERENCES auth.users(id),
  verification_notes TEXT,
  fraud_score INTEGER DEFAULT 0,
  verification_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment schedules table for milestone payments
CREATE TABLE public.payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_plan TEXT NOT NULL DEFAULT 'standard' CHECK (payment_plan IN ('standard', 'milestone', 'custom')),
  total_milestones INTEGER DEFAULT 2,
  milestones JSONB NOT NULL DEFAULT '[{"percentage": 50, "description": "Advance payment", "due_date": null}, {"percentage": 50, "description": "Final payment", "due_date": null}]',
  current_milestone INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create escrow payments table
CREATE TABLE public.escrow_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'released', 'disputed', 'refunded')),
  held_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  release_condition TEXT NOT NULL DEFAULT 'completion_confirmation',
  auto_release_date TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  released_by UUID REFERENCES auth.users(id),
  dispute_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add new columns to existing payments table
ALTER TABLE public.payments 
ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 15.00,
ADD COLUMN commission_amount DECIMAL(12,2) DEFAULT 0,
ADD COLUMN net_amount DECIMAL(12,2),
ADD COLUMN fraud_score INTEGER DEFAULT 0,
ADD COLUMN verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'flagged', 'requires_review')),
ADD COLUMN escrow_status TEXT DEFAULT 'none' CHECK (escrow_status IN ('none', 'held', 'released', 'disputed')),
ADD COLUMN milestone_number INTEGER DEFAULT 1;

-- Enable RLS on new tables
ALTER TABLE public.service_provider_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_provider_commissions
CREATE POLICY "Providers can view their own commissions" ON public.service_provider_commissions
FOR SELECT USING (
  provider_id IN (
    SELECT id FROM service_providers WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all commissions" ON public.service_provider_commissions
FOR ALL USING (is_admin());

-- RLS Policies for payouts
CREATE POLICY "Providers can view their own payouts" ON public.payouts
FOR SELECT USING (
  provider_id IN (
    SELECT id FROM service_providers WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all payouts" ON public.payouts
FOR ALL USING (is_admin());

-- RLS Policies for payment_verification_logs
CREATE POLICY "Admins can manage verification logs" ON public.payment_verification_logs
FOR ALL USING (is_admin());

CREATE POLICY "Users can view their payment verification logs" ON public.payment_verification_logs
FOR SELECT USING (
  payment_id IN (
    SELECT p.id FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    WHERE b.user_id = auth.uid() OR 
          b.provider_id IN (SELECT id FROM service_providers WHERE profile_id = auth.uid())
  )
);

-- RLS Policies for payment_schedules
CREATE POLICY "Users can view their payment schedules" ON public.payment_schedules
FOR SELECT USING (
  booking_id IN (
    SELECT id FROM bookings 
    WHERE user_id = auth.uid() OR 
          provider_id IN (SELECT id FROM service_providers WHERE profile_id = auth.uid())
  )
);

CREATE POLICY "Users can manage their payment schedules" ON public.payment_schedules
FOR ALL USING (
  booking_id IN (
    SELECT id FROM bookings 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all payment schedules" ON public.payment_schedules
FOR ALL USING (is_admin());

-- RLS Policies for escrow_payments
CREATE POLICY "Users can view their escrow payments" ON public.escrow_payments
FOR SELECT USING (
  booking_id IN (
    SELECT id FROM bookings 
    WHERE user_id = auth.uid() OR 
          provider_id IN (SELECT id FROM service_providers WHERE profile_id = auth.uid())
  )
);

CREATE POLICY "Admins can manage escrow payments" ON public.escrow_payments
FOR ALL USING (is_admin());

-- Create indexes for better performance
CREATE INDEX idx_service_provider_commissions_provider_id ON public.service_provider_commissions(provider_id);
CREATE INDEX idx_payouts_provider_id ON public.payouts(provider_id);
CREATE INDEX idx_payouts_status ON public.payouts(status);
CREATE INDEX idx_payment_verification_logs_payment_id ON public.payment_verification_logs(payment_id);
CREATE INDEX idx_payment_schedules_booking_id ON public.payment_schedules(booking_id);
CREATE INDEX idx_escrow_payments_booking_id ON public.escrow_payments(booking_id);
CREATE INDEX idx_escrow_payments_status ON public.escrow_payments(status);

-- Create triggers for updated_at columns
CREATE TRIGGER update_service_provider_commissions_updated_at
  BEFORE UPDATE ON public.service_provider_commissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at
  BEFORE UPDATE ON public.payouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_schedules_updated_at
  BEFORE UPDATE ON public.payment_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_escrow_payments_updated_at
  BEFORE UPDATE ON public.escrow_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate commission based on provider tier
CREATE OR REPLACE FUNCTION public.get_commission_rate(provider_tier TEXT)
RETURNS DECIMAL(5,2)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN provider_tier = 'vip' THEN 5.00
    WHEN provider_tier = 'premium' THEN 10.00
    ELSE 15.00
  END;
$$;

-- Function to auto-calculate commission and net amount
CREATE OR REPLACE FUNCTION public.calculate_payment_commission()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  provider_tier TEXT;
  commission_rate DECIMAL(5,2);
BEGIN
  -- Get provider tier from service_providers table
  SELECT 
    CASE 
      WHEN sp.is_premium THEN 'premium'
      ELSE 'basic'
    END INTO provider_tier
  FROM bookings b
  JOIN service_providers sp ON b.provider_id = sp.id
  WHERE b.id = NEW.booking_id;
  
  -- Calculate commission rate
  commission_rate := public.get_commission_rate(provider_tier);
  
  -- Update the payment record
  NEW.commission_rate := commission_rate;
  NEW.commission_amount := NEW.amount * (commission_rate / 100);
  NEW.net_amount := NEW.amount - NEW.commission_amount;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-calculate commission on payment insert/update
CREATE TRIGGER calculate_payment_commission_trigger
  BEFORE INSERT OR UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.calculate_payment_commission();

-- Function to update provider commission totals
CREATE OR REPLACE FUNCTION public.update_provider_commission_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  provider_id_val UUID;
BEGIN
  -- Get provider_id from booking
  SELECT b.provider_id INTO provider_id_val
  FROM bookings b
  WHERE b.id = NEW.booking_id;
  
  -- Update or insert commission record
  INSERT INTO public.service_provider_commissions (provider_id, total_earnings, total_commission_paid)
  VALUES (
    provider_id_val,
    NEW.net_amount,
    NEW.commission_amount
  )
  ON CONFLICT (provider_id) DO UPDATE SET
    total_earnings = service_provider_commissions.total_earnings + NEW.net_amount,
    total_commission_paid = service_provider_commissions.total_commission_paid + NEW.commission_amount,
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Trigger to update commission totals when payment is completed
CREATE TRIGGER update_provider_commission_totals_trigger
  AFTER UPDATE ON public.payments
  FOR EACH ROW 
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION public.update_provider_commission_totals();
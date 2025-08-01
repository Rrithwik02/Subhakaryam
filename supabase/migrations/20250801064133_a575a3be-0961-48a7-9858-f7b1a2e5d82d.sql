-- Add custom payment fields to support provider payment flexibility
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS provider_requested_amount numeric,
ADD COLUMN IF NOT EXISTS payment_description text,
ADD COLUMN IF NOT EXISTS is_provider_requested boolean DEFAULT false;

-- Add payment request tracking to bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS provider_payment_requested boolean DEFAULT false;

-- Update payments table to allow providers to view their booking payments
-- (RLS policies already exist, just ensuring proper access)
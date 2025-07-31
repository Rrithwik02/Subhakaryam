-- Add advance payment fields to service_providers table
ALTER TABLE public.service_providers 
ADD COLUMN requires_advance_payment boolean DEFAULT false,
ADD COLUMN advance_payment_percentage integer DEFAULT 0 CHECK (advance_payment_percentage >= 0 AND advance_payment_percentage <= 50);
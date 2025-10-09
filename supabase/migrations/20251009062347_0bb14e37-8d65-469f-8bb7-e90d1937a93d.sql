-- Phase 1: Add Global Fields to service_providers table
ALTER TABLE service_providers
ADD COLUMN IF NOT EXISTS gst_number TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS verification_document_url TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS travel_charges_applicable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS advance_booking_days INTEGER,
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE;

-- Add metadata JSONB column to additional_services table
ALTER TABLE additional_services
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_additional_services_metadata 
ON additional_services USING GIN (metadata);

-- Update service_provider_availability for specific date bookings
ALTER TABLE service_provider_availability
ADD COLUMN IF NOT EXISTS specific_date DATE,
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_availability_specific_date 
ON service_provider_availability(provider_id, specific_date);

-- Add service_cities array to service_providers
ALTER TABLE service_providers
ADD COLUMN IF NOT EXISTS service_cities TEXT[] DEFAULT '{}';

-- Update existing records to include current city in array
UPDATE service_providers 
SET service_cities = ARRAY[city] 
WHERE service_cities = '{}' OR service_cities IS NULL;

-- Add secondary city to array if exists
UPDATE service_providers 
SET service_cities = array_append(service_cities, secondary_city)
WHERE secondary_city IS NOT NULL 
AND secondary_city != ''
AND NOT (secondary_city = ANY(service_cities));
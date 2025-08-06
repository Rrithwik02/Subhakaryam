-- Add price range fields to additional_services table
ALTER TABLE additional_services 
ADD COLUMN min_price NUMERIC,
ADD COLUMN max_price NUMERIC;

-- Update existing records to have default price ranges
UPDATE additional_services 
SET min_price = 1000, max_price = 50000 
WHERE min_price IS NULL OR max_price IS NULL;

-- Make price fields required for new records
ALTER TABLE additional_services 
ALTER COLUMN min_price SET NOT NULL,
ALTER COLUMN max_price SET NOT NULL;

-- Add constraint to ensure min_price <= max_price
ALTER TABLE additional_services 
ADD CONSTRAINT check_price_range CHECK (min_price <= max_price);

-- Create index for better query performance
CREATE INDEX idx_additional_services_price_range ON additional_services (min_price, max_price);
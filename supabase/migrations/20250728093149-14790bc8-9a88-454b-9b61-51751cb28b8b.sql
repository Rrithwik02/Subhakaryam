-- Add multi-day booking support to bookings table
ALTER TABLE bookings 
ADD COLUMN start_date date,
ADD COLUMN end_date date,
ADD COLUMN total_days integer DEFAULT 1,
ADD COLUMN total_amount numeric;

-- Update existing bookings to use new structure
UPDATE bookings 
SET start_date = service_date,
    end_date = service_date,
    total_days = 1,
    total_amount = (
      SELECT base_price 
      FROM service_providers 
      WHERE service_providers.id = bookings.provider_id
    )
WHERE start_date IS NULL;
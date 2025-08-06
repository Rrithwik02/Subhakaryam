-- Add subcategory and specialization fields to additional_services table
ALTER TABLE public.additional_services 
ADD COLUMN subcategory TEXT,
ADD COLUMN specialization TEXT;

-- Add subcategory field to service_providers table for main service
ALTER TABLE public.service_providers 
ADD COLUMN subcategory TEXT;

-- Update existing records to have default subcategory values
UPDATE public.additional_services 
SET subcategory = 'general' 
WHERE subcategory IS NULL;

UPDATE public.service_providers 
SET subcategory = 'general' 
WHERE subcategory IS NULL;
-- Phase 5A: Add portfolio_images to additional_services table
ALTER TABLE public.additional_services 
ADD COLUMN portfolio_images text[] DEFAULT '{}';

-- Add index for better performance on portfolio_images queries
CREATE INDEX idx_additional_services_portfolio_images 
ON public.additional_services USING GIN(portfolio_images);
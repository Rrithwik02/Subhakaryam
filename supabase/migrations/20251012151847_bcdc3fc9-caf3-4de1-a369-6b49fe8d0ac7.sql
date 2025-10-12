-- Add check constraints to contact_submissions table for input validation
-- This provides database-level protection against invalid data

-- Add length constraints for name field (2-100 characters)
ALTER TABLE contact_submissions 
  ADD CONSTRAINT check_name_length 
  CHECK (char_length(name) >= 2 AND char_length(name) <= 100);

-- Add length constraint for email field (max 255 characters)
ALTER TABLE contact_submissions 
  ADD CONSTRAINT check_email_length 
  CHECK (char_length(email) <= 255 AND char_length(email) >= 5);

-- Add length constraint for phone field (exactly 10 characters for Indian numbers)
ALTER TABLE contact_submissions 
  ADD CONSTRAINT check_phone_length 
  CHECK (char_length(phone) = 10);

-- Add length constraints for message field (10-1000 characters)
ALTER TABLE contact_submissions 
  ADD CONSTRAINT check_message_length 
  CHECK (char_length(message) >= 10 AND char_length(message) <= 1000);

-- Add comment documenting the security purpose
COMMENT ON TABLE contact_submissions IS 'Contact form submissions with input validation constraints to prevent database bloat and ensure data quality';
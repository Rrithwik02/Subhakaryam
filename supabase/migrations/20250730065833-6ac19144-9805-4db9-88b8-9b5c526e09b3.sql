-- Add trigger to update user profile when service provider is approved
CREATE OR REPLACE FUNCTION public.notify_provider_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- If the status is being changed from 'pending' to 'approved'
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    -- Update the user's profile to service_provider type
    UPDATE profiles
    SET user_type = 'service_provider'
    WHERE id = NEW.profile_id;
    
    -- Insert a notification to inform the user
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type
    )
    VALUES (
      NEW.profile_id,
      'Service Provider Application Approved',
      'Congratulations! Your service provider application has been approved. You now have access to the provider dashboard.',
      'account_status'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to call the function
CREATE TRIGGER on_provider_status_approved
  AFTER UPDATE ON service_providers
  FOR EACH ROW 
  EXECUTE FUNCTION notify_provider_approval();
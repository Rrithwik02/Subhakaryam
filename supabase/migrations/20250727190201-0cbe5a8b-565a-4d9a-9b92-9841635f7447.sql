-- Create the missing is_user_admin function that takes a user_id parameter
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE((SELECT user_type FROM public.profiles WHERE id = user_id) = 'admin', false);
$function$;
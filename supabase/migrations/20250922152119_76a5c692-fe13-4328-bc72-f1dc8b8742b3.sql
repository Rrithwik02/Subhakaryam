-- Create quotation_requests table
CREATE TABLE public.quotation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider_id UUID NULL,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NULL,
  budget_range TEXT NULL,
  location TEXT NOT NULL,
  guest_count INTEGER NULL,
  special_requirements TEXT NULL,
  images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'declined')),
  quoted_amount NUMERIC NULL,
  quoted_description TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quotation_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for quotation_requests
CREATE POLICY "Users can view their own quotation requests" 
ON public.quotation_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quotation requests" 
ON public.quotation_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotation requests" 
ON public.quotation_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Providers can view requests for them" 
ON public.quotation_requests 
FOR SELECT 
USING (provider_id IN (
  SELECT id FROM service_providers 
  WHERE profile_id = auth.uid()
));

CREATE POLICY "Providers can update requests for them" 
ON public.quotation_requests 
FOR UPDATE 
USING (provider_id IN (
  SELECT id FROM service_providers 
  WHERE profile_id = auth.uid()
));

CREATE POLICY "Admins can manage all quotation requests" 
ON public.quotation_requests 
FOR ALL 
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_quotation_requests_updated_at
BEFORE UPDATE ON public.quotation_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key references (optional - for data integrity)
ALTER TABLE public.quotation_requests 
ADD CONSTRAINT quotation_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.quotation_requests 
ADD CONSTRAINT quotation_requests_provider_id_fkey 
FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE SET NULL;
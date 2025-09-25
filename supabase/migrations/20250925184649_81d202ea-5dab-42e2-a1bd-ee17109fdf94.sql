-- Fix contact_submissions table security vulnerability
-- Clean up existing policies and create secure ones

-- Drop all existing policies on contact_submissions to start fresh
DROP POLICY IF EXISTS "Admins can manage contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can submit contact forms" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;

-- Ensure RLS is enabled
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create secure policies for contact_submissions
-- Only admins can view contact submissions
CREATE POLICY "Admins can view all contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (is_admin());

-- Only admins can update contact submission status  
CREATE POLICY "Admins can update contact submissions status" 
ON public.contact_submissions 
FOR UPDATE 
USING (is_admin());

-- Only admins can delete contact submissions
CREATE POLICY "Admins can delete contact submissions" 
ON public.contact_submissions 
FOR DELETE 
USING (is_admin());

-- Allow anyone (including anonymous users) to submit contact forms
-- This is the only public access needed
CREATE POLICY "Anyone can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);
-- Fix RLS infinite recursion in user_roles table
-- The current policy queries user_roles within its own RLS check, causing infinite recursion
-- We need to use the has_role() security definer function instead

-- Drop the problematic policy
DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;

-- Recreate the policy using the has_role() security definer function
-- This breaks the recursion because has_role() bypasses RLS
CREATE POLICY "Only admins can manage roles"
ON user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
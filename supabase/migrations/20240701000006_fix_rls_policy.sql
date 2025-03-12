-- Fix RLS policy for users table

-- First, disable RLS for the users table to allow all operations
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (as a fallback)
DROP POLICY IF EXISTS "Allow all operations on users" ON public.users;
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true);

-- Make sure the anon role can insert into users
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

-- No need to grant sequence permissions since we're using UUID
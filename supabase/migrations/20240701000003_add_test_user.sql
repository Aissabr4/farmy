-- Add a test user to verify database functionality
INSERT INTO public.users (name, email, role, status, avatar, permissions)
VALUES (
  'Test User', 
  'test@farmmanager.com', 
  'worker', 
  'active', 
  'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser', 
  ARRAY['view_fields', 'edit_tasks']
);
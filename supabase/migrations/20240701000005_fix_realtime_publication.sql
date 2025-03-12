-- Fix realtime publication by checking if tables are already members

DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if users table exists in publication
    SELECT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'users'
    ) INTO table_exists;
    
    -- Only add if not already a member
    IF NOT table_exists THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
    END IF;
    
    -- Check if fields table exists in publication
    SELECT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'fields'
    ) INTO table_exists;
    
    -- Only add if not already a member
    IF NOT table_exists THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.fields;
    END IF;
    
    -- Check if tasks table exists in publication
    SELECT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'tasks'
    ) INTO table_exists;
    
    -- Only add if not already a member
    IF NOT table_exists THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
    END IF;
    
    -- Check if weather_data table exists in publication
    SELECT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'weather_data'
    ) INTO table_exists;
    
    -- Only add if not already a member
    IF NOT table_exists THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.weather_data;
    END IF;
    
    -- Check if weather_forecast table exists in publication
    SELECT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'weather_forecast'
    ) INTO table_exists;
    
    -- Only add if not already a member
    IF NOT table_exists THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.weather_forecast;
    END IF;
END
$$;
-- Add farm_id column to users table if it doesn't exist
DO $$
BEGIN
    -- Create farms table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.farms (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        location TEXT,
        size NUMERIC,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add farm_id column to users table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'farm_id') THEN
        ALTER TABLE public.users ADD COLUMN farm_id UUID REFERENCES public.farms(id);
    END IF;

    -- Insert default farm if none exists
    IF NOT EXISTS (SELECT 1 FROM public.farms LIMIT 1) THEN
        INSERT INTO public.farms (name, location, size) 
        VALUES ('Main Farm', 'Default Location', 100);
    END IF;

    -- Enable realtime for farms table
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.farms;
    EXCEPTION WHEN OTHERS THEN
        -- Table might already be in the publication
        NULL;
    END;
END
$$;
-- Add farm_id column to fields table if it doesn't exist
DO $$
BEGIN
    -- Add farm_id column to fields table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'fields' 
                   AND column_name = 'farm_id') THEN
        ALTER TABLE public.fields ADD COLUMN farm_id UUID REFERENCES public.farms(id);
    END IF;

    -- Update existing fields to use the default farm
    UPDATE public.fields
    SET farm_id = (SELECT id FROM public.farms LIMIT 1)
    WHERE farm_id IS NULL;

END
$$;
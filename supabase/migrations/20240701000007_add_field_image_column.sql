-- Add field_image column to fields table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'fields' 
                   AND column_name = 'field_image') THEN
        ALTER TABLE public.fields ADD COLUMN field_image text;
    END IF;
END
$$;
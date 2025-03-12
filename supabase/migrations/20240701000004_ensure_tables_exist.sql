-- Ensure users table exists
CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    status text NOT NULL,
    avatar text,
    date_added timestamp with time zone DEFAULT now(),
    permissions text[]
);

-- Ensure fields table exists
CREATE TABLE IF NOT EXISTS public.fields (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    location text NOT NULL,
    size numeric NOT NULL,
    crop_type text NOT NULL,
    status text NOT NULL,
    soil_moisture integer NOT NULL,
    sunlight integer NOT NULL,
    growth_stage text NOT NULL,
    planting_date text,
    harvest_date text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Ensure tasks table exists
CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    field_name text NOT NULL,
    field_id uuid REFERENCES public.fields(id),
    assigned_to_name text NOT NULL,
    assigned_to_id uuid REFERENCES public.users(id),
    due_date timestamp with time zone,
    priority text NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Ensure weather_data table exists
CREATE TABLE IF NOT EXISTS public.weather_data (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    temperature integer NOT NULL,
    humidity integer NOT NULL,
    wind_speed integer NOT NULL,
    condition text NOT NULL,
    location text NOT NULL,
    recorded_at timestamp with time zone DEFAULT now()
);

-- Ensure weather_forecast table exists
CREATE TABLE IF NOT EXISTS public.weather_forecast (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    day text NOT NULL,
    temperature integer NOT NULL,
    condition text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable row level security but allow all operations for now
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_forecast ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations
DROP POLICY IF EXISTS "Allow all operations on users" ON public.users;
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on fields" ON public.fields;
CREATE POLICY "Allow all operations on fields" ON public.fields FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on tasks" ON public.tasks;
CREATE POLICY "Allow all operations on tasks" ON public.tasks FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on weather_data" ON public.weather_data;
CREATE POLICY "Allow all operations on weather_data" ON public.weather_data FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on weather_forecast" ON public.weather_forecast;
CREATE POLICY "Allow all operations on weather_forecast" ON public.weather_forecast FOR ALL USING (true);

-- Realtime publication is handled in a separate migration file
-- to avoid errors when tables are already members of the publication
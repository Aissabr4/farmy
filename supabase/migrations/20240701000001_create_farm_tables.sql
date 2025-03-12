-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'worker', 'technician')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  avatar TEXT,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  permissions TEXT[] DEFAULT '{}'::TEXT[]
);

-- Create fields table
CREATE TABLE IF NOT EXISTS fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  size NUMERIC NOT NULL,
  crop_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('healthy', 'warning', 'critical')),
  soil_moisture INTEGER NOT NULL,
  sunlight INTEGER NOT NULL,
  growth_stage TEXT NOT NULL,
  planting_date DATE,
  harvest_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  field_id UUID REFERENCES fields(id),
  field_name TEXT NOT NULL,
  assigned_to_id UUID REFERENCES users(id),
  assigned_to_name TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('alert', 'task', 'info')),
  status TEXT CHECK (status IN ('pending', 'completed')),
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  related_type TEXT
);

-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temperature NUMERIC NOT NULL,
  humidity INTEGER NOT NULL,
  wind_speed NUMERIC NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('sunny', 'cloudy', 'rainy', 'foggy', 'snowy')),
  location TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weather_forecast table
CREATE TABLE IF NOT EXISTS weather_forecast (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day TEXT NOT NULL,
  temperature NUMERIC NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('sunny', 'cloudy', 'rainy', 'foggy', 'snowy')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_status table
CREATE TABLE IF NOT EXISTS system_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'warning', 'maintenance')),
  last_checked TEXT NOT NULL,
  uptime TEXT,
  details TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create diagnostic_results table
CREATE TABLE IF NOT EXISTS diagnostic_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  component TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'warning')),
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance_tasks table
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  due_date TEXT NOT NULL,
  assigned_to TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create soil_data table
CREATE TABLE IF NOT EXISTS soil_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id UUID REFERENCES fields(id),
  type TEXT NOT NULL,
  ph NUMERIC NOT NULL,
  moisture INTEGER NOT NULL,
  nitrogen INTEGER,
  phosphorus INTEGER,
  potassium INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crop_history table
CREATE TABLE IF NOT EXISTS crop_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id UUID REFERENCES fields(id),
  year TEXT NOT NULL,
  crop TEXT NOT NULL,
  yield INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_forecast ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_history ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public users access" ON users;
CREATE POLICY "Public users access"
  ON users FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public fields access" ON fields;
CREATE POLICY "Public fields access"
  ON fields FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public tasks access" ON tasks;
CREATE POLICY "Public tasks access"
  ON tasks FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public notifications access" ON notifications;
CREATE POLICY "Public notifications access"
  ON notifications FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public weather_data access" ON weather_data;
CREATE POLICY "Public weather_data access"
  ON weather_data FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public weather_forecast access" ON weather_forecast;
CREATE POLICY "Public weather_forecast access"
  ON weather_forecast FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public system_status access" ON system_status;
CREATE POLICY "Public system_status access"
  ON system_status FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public diagnostic_results access" ON diagnostic_results;
CREATE POLICY "Public diagnostic_results access"
  ON diagnostic_results FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public maintenance_tasks access" ON maintenance_tasks;
CREATE POLICY "Public maintenance_tasks access"
  ON maintenance_tasks FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public soil_data access" ON soil_data;
CREATE POLICY "Public soil_data access"
  ON soil_data FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public crop_history access" ON crop_history;
CREATE POLICY "Public crop_history access"
  ON crop_history FOR SELECT
  USING (true);

-- Enable realtime subscriptions
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table fields;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table weather_data;
alter publication supabase_realtime add table weather_forecast;
alter publication supabase_realtime add table system_status;
alter publication supabase_realtime add table diagnostic_results;
alter publication supabase_realtime add table maintenance_tasks;
alter publication supabase_realtime add table soil_data;
alter publication supabase_realtime add table crop_history;
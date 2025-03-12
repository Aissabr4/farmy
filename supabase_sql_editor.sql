-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Seed users table
INSERT INTO users (name, email, role, status, permissions)
VALUES 
  ('John Farmer', 'john@farmmanager.com', 'owner', 'active', '{all}'),
  ('Sarah Smith', 'sarah@farmmanager.com', 'worker', 'active', '{view_fields,edit_tasks}'),
  ('Mike Johnson', 'mike@farmmanager.com', 'technician', 'active', '{view_diagnostics,edit_equipment}'),
  ('Emily Brown', 'emily@farmmanager.com', 'worker', 'inactive', '{view_fields}'),
  ('David Wilson', 'david@farmmanager.com', 'technician', 'active', '{view_diagnostics}')
ON CONFLICT (email) DO NOTHING;

-- Seed fields table
INSERT INTO fields (name, location, size, crop_type, status, soil_moisture, sunlight, growth_stage, planting_date, harvest_date)
VALUES
  ('North Field', 'Section A, North-East Corner', 12.5, 'Corn', 'healthy', 75, 85, 'Mature', '2023-04-15', '2023-09-30'),
  ('South Field', 'Section B, South Corner', 8.3, 'Wheat', 'warning', 45, 90, 'Growing', '2023-05-10', '2023-10-15'),
  ('East Field', 'Section C, East Side', 15.7, 'Soybeans', 'critical', 30, 65, 'Early', '2023-06-01', '2023-11-05'),
  ('West Field', 'Section D, West Side', 10.2, 'Barley', 'healthy', 80, 75, 'Mature', '2023-03-20', '2023-08-15')
ON CONFLICT DO NOTHING;

-- Seed tasks table (without foreign key constraints for simplicity)
INSERT INTO tasks (title, description, field_name, assigned_to_name, due_date, priority, status)
VALUES
  ('Irrigation Check', 'Check irrigation system in North Field', 'North Field', 'John Doe', NOW() + INTERVAL '1 day', 'high', 'pending'),
  ('Fertilizer Application', 'Apply nitrogen fertilizer to East Field', 'East Field', 'Sarah Smith', NOW() + INTERVAL '2 days', 'medium', 'in-progress'),
  ('Harvest Preparation', 'Prepare equipment for upcoming harvest', 'South Field', 'Mike Johnson', NOW() + INTERVAL '5 days', 'low', 'pending'),
  ('Equipment Maintenance', 'Perform routine maintenance on tractor', 'Workshop', 'John Doe', NOW() + INTERVAL '3 days', 'medium', 'pending'),
  ('Soil Sampling', 'Collect soil samples from West Field', 'West Field', 'Emily Brown', NOW() - INTERVAL '1 day', 'high', 'completed'),
  ('Fence Repair', 'Fix damaged fence in North Field', 'North Field', 'Mike Johnson', NOW() - INTERVAL '2 days', 'medium', 'cancelled')
ON CONFLICT DO NOTHING;

-- Seed notifications table
INSERT INTO notifications (title, message, type, priority, read)
VALUES
  ('Weather Alert', 'Heavy rain expected in the next 24 hours', 'alert', 'high', false),
  ('Task Completed', 'Field irrigation completed successfully', 'task', null, true),
  ('New Task Assigned', 'Check soil moisture in North Field', 'task', 'medium', false)
ON CONFLICT DO NOTHING;

-- Seed weather_data table
INSERT INTO weather_data (temperature, humidity, wind_speed, condition, location)
VALUES (24, 65, 12, 'sunny', 'Farm Location')
ON CONFLICT DO NOTHING;

-- Seed weather_forecast table
INSERT INTO weather_forecast (day, temperature, condition)
VALUES
  ('Mon', 25, 'sunny'),
  ('Tue', 23, 'cloudy'),
  ('Wed', 22, 'rainy'),
  ('Thu', 24, 'sunny'),
  ('Fri', 26, 'sunny')
ON CONFLICT DO NOTHING;

-- Seed system_status table
INSERT INTO system_status (name, status, last_checked, uptime, details)
VALUES
  ('Irrigation System', 'warning', '2 hours ago', '98.5%', 'Pressure fluctuations detected'),
  ('Weather Station', 'online', '30 minutes ago', '99.9%', 'All sensors functioning normally'),
  ('Soil Sensors Network', 'warning', '1 hour ago', '95.2%', '3 sensors reporting low battery'),
  ('Security Cameras', 'online', '15 minutes ago', '99.7%', 'All cameras operational'),
  ('Automated Feeders', 'offline', '3 hours ago', null, 'Connection lost to control unit'),
  ('Water Quality Monitors', 'maintenance', '1 day ago', null, 'Scheduled calibration in progress')
ON CONFLICT DO NOTHING;

-- Seed diagnostic_results table
INSERT INTO diagnostic_results (component, status, message)
VALUES
  ('Irrigation Pump #2', 'warning', 'Pressure below optimal range'),
  ('Network Gateway', 'passed', 'All systems connected'),
  ('Soil Sensor Array', 'warning', '3 sensors need battery replacement'),
  ('Automated Feeder', 'failed', 'Communication failure'),
  ('Weather Station', 'passed', 'All sensors calibrated and functional')
ON CONFLICT DO NOTHING;

-- Seed maintenance_tasks table
INSERT INTO maintenance_tasks (title, description, priority, due_date, assigned_to, status)
VALUES
  ('Replace Soil Sensor Batteries', 'Replace batteries in sensors #5, #8, and #12 in East Field', 'medium', 'Tomorrow', 'Mike Johnson', 'pending'),
  ('Irrigation System Maintenance', 'Check pressure regulators and clean filters', 'high', 'Today', 'Sarah Smith', 'in-progress'),
  ('Recalibrate Weather Station', 'Quarterly calibration of all weather sensors', 'low', 'Next Week', 'Mike Johnson', 'pending'),
  ('Fix Automated Feeder Connection', 'Troubleshoot network connection to automated feeder control unit', 'high', 'Today', 'Emily Brown', 'pending'),
  ('Update System Firmware', 'Apply latest firmware updates to all system controllers', 'medium', 'This Week', 'Sarah Smith', 'completed')
ON CONFLICT DO NOTHING;

-- Seed soil_data table
INSERT INTO soil_data (type, ph, moisture, nitrogen, phosphorus, potassium)
VALUES ('Loamy', 6.8, 72, 65, 45, 80)
ON CONFLICT DO NOTHING;

-- Seed crop_history table
INSERT INTO crop_history (year, crop, yield, notes)
VALUES
  ('2022', 'Soybeans', 52, 'Good yield despite dry summer'),
  ('2021', 'Wheat', 58, 'Excellent growing conditions'),
  ('2020', 'Corn', 48, 'Pest issues in mid-season')
ON CONFLICT DO NOTHING;

-- Enable realtime for all tables
BEGIN;
  -- Create or update the supabase_realtime publication
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      CREATE PUBLICATION supabase_realtime;
    END IF;
  END
  $$;

  -- Add tables to the publication
  ALTER PUBLICATION supabase_realtime ADD TABLE users;
  ALTER PUBLICATION supabase_realtime ADD TABLE fields;
  ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  ALTER PUBLICATION supabase_realtime ADD TABLE weather_data;
  ALTER PUBLICATION supabase_realtime ADD TABLE weather_forecast;
  ALTER PUBLICATION supabase_realtime ADD TABLE system_status;
  ALTER PUBLICATION supabase_realtime ADD TABLE diagnostic_results;
  ALTER PUBLICATION supabase_realtime ADD TABLE maintenance_tasks;
  ALTER PUBLICATION supabase_realtime ADD TABLE soil_data;
  ALTER PUBLICATION supabase_realtime ADD TABLE crop_history;
COMMIT;

-- Create policies for public access (for development purposes)
BEGIN;
  -- Enable RLS on all tables
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

  -- Create policies for each table
  DROP POLICY IF EXISTS "Public users access" ON users;
  CREATE POLICY "Public users access" ON users FOR ALL USING (true);

  DROP POLICY IF EXISTS "Public fields access" ON fields;
  CREATE POLICY "Public fields access" ON fields FOR ALL USING (true);

  DROP POLICY IF EXISTS "Public tasks access" ON tasks;
  CREATE POLICY "Public tasks access" ON tasks FOR ALL USING (true);

  DROP POLICY IF EXISTS "Public notifications access" ON notifications;
  CREATE POLICY "Public notifications access" ON notifications FOR ALL USING (true);

  DROP POLICY IF EXISTS "Public weather_data access" ON weather_data;
  CREATE POLICY "Public weather_data access" ON weather_data FOR ALL USING (true);

  DROP POLICY IF EXISTS "Public weather_forecast access" ON weather_forecast;
  CREATE POLICY "Public weather_forecast access" ON weather_forecast FOR ALL USING (true);

  DROP POLICY IF EXISTS "Public system_status access" ON system_status;
  CREATE POLICY "Public system_status access" ON system_status FOR ALL USING (true);

  DROP POLICY IF EXISTS "Public diagnostic_results access" ON diagnostic_results;
  CREATE POLICY "Public diagnostic_results access" ON diagnostic_results FOR ALL USING (true);

  DROP POLICY IF EXISTS "Public maintenance_tasks access" ON maintenance_tasks;
  CREATE POLICY "Public maintenance_tasks access" ON maintenance_tasks FOR ALL USING (true);

  DROP POLICY IF EXISTS "Public soil_data access" ON soil_data;
  CREATE POLICY "Public soil_data access" ON soil_data FOR ALL USING (true);

  DROP POLICY IF EXISTS "Public crop_history access" ON crop_history;
  CREATE POLICY "Public crop_history access" ON crop_history FOR ALL USING (true);
COMMIT;
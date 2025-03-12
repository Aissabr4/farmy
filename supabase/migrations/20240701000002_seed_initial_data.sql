-- Seed users table
INSERT INTO users (name, email, role, status, permissions)
VALUES 
  ('John Farmer', 'john@farmmanager.com', 'owner', 'active', '{all}'),
  ('Sarah Smith', 'sarah@farmmanager.com', 'worker', 'active', '{view_fields,edit_tasks}'),
  ('Mike Johnson', 'mike@farmmanager.com', 'technician', 'active', '{view_diagnostics,edit_equipment}'),
  ('Emily Brown', 'emily@farmmanager.com', 'worker', 'inactive', '{view_fields}'),
  ('David Wilson', 'david@farmmanager.com', 'technician', 'active', '{view_diagnostics}')
ON CONFLICT DO NOTHING;

-- Seed fields table
INSERT INTO fields (name, location, size, crop_type, status, soil_moisture, sunlight, growth_stage, planting_date, harvest_date)
VALUES
  ('North Field', 'Section A, North-East Corner', 12.5, 'Corn', 'healthy', 75, 85, 'Mature', '2023-04-15', '2023-09-30'),
  ('South Field', 'Section B, South Corner', 8.3, 'Wheat', 'warning', 45, 90, 'Growing', '2023-05-10', '2023-10-15'),
  ('East Field', 'Section C, East Side', 15.7, 'Soybeans', 'critical', 30, 65, 'Early', '2023-06-01', '2023-11-05'),
  ('West Field', 'Section D, West Side', 10.2, 'Barley', 'healthy', 80, 75, 'Mature', '2023-03-20', '2023-08-15')
ON CONFLICT DO NOTHING;

-- Seed tasks table
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

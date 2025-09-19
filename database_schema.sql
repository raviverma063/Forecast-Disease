-- Supabase Database Schema for Preventive Health Dashboard

-- Create UserProfile table
CREATE TABLE IF NOT EXISTS UserProfile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 150),
    gender VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    chronic_conditions TEXT[], -- Array of chronic conditions
    occupation VARCHAR(255),
    lifestyle_smoking BOOLEAN DEFAULT FALSE,
    lifestyle_alcohol BOOLEAN DEFAULT FALSE,
    sleep_hours INTEGER CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create HealthAlerts table
CREATE TABLE IF NOT EXISTS HealthAlerts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    region VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
    alert_type VARCHAR(50) DEFAULT 'general',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_userprofile_name ON UserProfile(name);
CREATE INDEX IF NOT EXISTS idx_userprofile_location ON UserProfile(location);
CREATE INDEX IF NOT EXISTS idx_healthalerts_region ON HealthAlerts(region);
CREATE INDEX IF NOT EXISTS idx_healthalerts_date ON HealthAlerts(date);
CREATE INDEX IF NOT EXISTS idx_healthalerts_severity ON HealthAlerts(severity);
CREATE INDEX IF NOT EXISTS idx_healthalerts_active ON HealthAlerts(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE UserProfile ENABLE ROW LEVEL SECURITY;
ALTER TABLE HealthAlerts ENABLE ROW LEVEL SECURITY;

-- Create policies for UserProfile (users can only access their own data)
CREATE POLICY "Users can view their own profile" ON UserProfile
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own profile" ON UserProfile
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON UserProfile
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for HealthAlerts (public read access for active alerts)
CREATE POLICY "Anyone can view active health alerts" ON HealthAlerts
    FOR SELECT USING (is_active = true);

-- Insert sample health alerts
INSERT INTO HealthAlerts (title, description, region, date, severity, alert_type) VALUES
('Flu Season Alert', 'Influenza activity is increasing in your area. Consider getting vaccinated if you haven''t already.', 'Global', CURRENT_DATE, 'medium', 'seasonal'),
('Air Quality Warning', 'Air quality index is moderate today. Sensitive individuals should limit outdoor activities.', 'Urban Areas', CURRENT_DATE, 'low', 'environmental'),
('Heat Wave Advisory', 'Temperatures are expected to reach dangerous levels. Stay hydrated and avoid prolonged sun exposure.', 'Southern Regions', CURRENT_DATE + INTERVAL '1 day', 'high', 'weather'),
('Dengue Outbreak', 'Increased dengue cases reported. Use mosquito repellent and eliminate standing water.', 'Tropical Areas', CURRENT_DATE, 'high', 'disease'),
('Pollen Count High', 'High pollen levels expected. Allergy sufferers should take precautions.', 'Temperate Regions', CURRENT_DATE, 'medium', 'environmental');

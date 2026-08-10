-- Settings Database Setup
-- This SQL creates table for storing application settings

-- Site settings table for storing configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  category VARCHAR(100) DEFAULT 'general', -- 'general', 'seo', 'social', 'contact', 'appearance'
  is_public BOOLEAN DEFAULT false, -- Whether this setting should be exposed to the public API
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on site_settings table
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Site settings policies
DROP POLICY IF EXISTS "Allow public read access on public site_settings" ON site_settings;
CREATE POLICY "Allow public read access on public site_settings" ON site_settings
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Allow authenticated users to manage site_settings" ON site_settings;
CREATE POLICY "Allow authenticated users to manage site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_site_settings_is_public ON site_settings(is_public);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get settings by category
CREATE OR REPLACE FUNCTION get_settings_by_category(category_param VARCHAR DEFAULT 'general')
RETURNS TABLE (
  key VARCHAR,
  value TEXT,
  description TEXT,
  type VARCHAR,
  category VARCHAR,
  is_public BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    key,
    value,
    description,
    type,
    category,
    is_public
  FROM site_settings
  WHERE category = category_param
  ORDER BY key;
END;
$$ LANGUAGE plpgsql;

-- Function to get a single setting value
CREATE OR REPLACE FUNCTION get_setting(key_param VARCHAR)
RETURNS TEXT AS $$
DECLARE
  setting_value TEXT;
BEGIN
  SELECT value INTO setting_value
  FROM site_settings
  WHERE key = key_param;
  
  RETURN setting_value;
END;
$$ LANGUAGE plpgsql;

-- No sample data inserted - settings are added through the admin panel
-- Note: The Settings page needs at least some settings to display. 
-- You can add settings through the admin panel or run a separate INSERT.

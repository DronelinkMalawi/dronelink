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
CREATE POLICY "Allow public read access on public site_settings" ON site_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Allow authenticated users to manage site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_site_settings_is_public ON site_settings(is_public);

-- Create trigger to automatically update updated_at
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

-- Insert default settings
INSERT INTO site_settings (key, value, description, type, category, is_public) VALUES
  -- General Settings
  ('site_name', 'DroneLink', 'Website name', 'string', 'general', true),
  ('site_description', 'Professional drone services and solutions', 'Website description', 'string', 'general', true),
  ('site_url', 'https://dronelink.com', 'Website URL', 'string', 'general', true),
  ('contact_email', 'contact@dronelink.com', 'Contact email address', 'string', 'contact', true),
  ('contact_phone', '+1 (555) 123-4567', 'Contact phone number', 'string', 'contact', true),
  ('contact_address', '123 Drone Street, San Francisco, CA 94105', 'Business address', 'string', 'contact', true),
  
  -- SEO Settings
  ('meta_title', 'DroneLink - Professional Drone Services', 'Default meta title', 'string', 'seo', true),
  ('meta_description', 'Professional drone services including aerial photography, surveying, and inspection', 'Default meta description', 'string', 'seo', true),
  ('meta_keywords', 'drone, aerial photography, surveying, inspection, drone services', 'Meta keywords', 'string', 'seo', true),
  ('google_analytics_id', '', 'Google Analytics tracking ID', 'string', 'seo', false),
  
  -- Social Media Settings
  ('facebook_url', 'https://facebook.com/dronelink', 'Facebook page URL', 'string', 'social', true),
  ('twitter_url', 'https://twitter.com/dronelink', 'Twitter profile URL', 'string', 'social', true),
  ('linkedin_url', 'https://linkedin.com/company/dronelink', 'LinkedIn company URL', 'string', 'social', true),
  ('instagram_url', 'https://instagram.com/dronelink', 'Instagram profile URL', 'string', 'social', true),
  
  -- Appearance Settings
  ('primary_color', '#3B82F6', 'Primary brand color', 'string', 'appearance', true),
  ('secondary_color', '#10B981', 'Secondary brand color', 'string', 'appearance', true),
  ('logo_url', '', 'Company logo URL', 'string', 'appearance', true),
  ('favicon_url', '', 'Favicon URL', 'string', 'appearance', true),
  
  -- Feature Settings
  ('blog_enabled', 'true', 'Enable blog functionality', 'boolean', 'features', false),
  ('portfolio_enabled', 'true', 'Enable portfolio functionality', 'boolean', 'features', false),
  ('contact_form_enabled', 'true', 'Enable contact form', 'boolean', 'features', false),
  ('analytics_enabled', 'true', 'Enable analytics tracking', 'boolean', 'features', false),
  
  -- Email Settings
  ('smtp_host', '', 'SMTP server host', 'string', 'email', false),
  ('smtp_port', '587', 'SMTP server port', 'number', 'email', false),
  ('smtp_user', '', 'SMTP username', 'string', 'email', false),
  ('smtp_password', '', 'SMTP password', 'string', 'email', false),
  ('email_from_address', 'noreply@dronelink.com', 'From email address', 'string', 'email', false),
  ('email_from_name', 'DroneLink', 'From email name', 'string', 'email', false)
ON CONFLICT (key) DO NOTHING;
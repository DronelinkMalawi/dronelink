-- Team Members Database Setup
-- This SQL creates table for team members with comprehensive profile information

-- Team members table for managing team/staff with profile information
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100) NOT NULL, -- Job title/position
  bio TEXT, -- Professional biography
  profile_image_url VARCHAR(500), -- Profile photo URL
  social_links JSONB DEFAULT '{}', -- Stores social media links (linkedin, twitter, etc.)
  phone VARCHAR(50), -- Contact number
  department VARCHAR(100), -- Department or team
  hire_date DATE, -- When they joined the company
  is_active BOOLEAN DEFAULT true, -- Whether they're currently active
  is_featured BOOLEAN DEFAULT false, -- Whether to feature on website
  sort_order INTEGER DEFAULT 0, -- Order for display purposes
  expertise TEXT[], -- Array of expertise areas
  certifications TEXT[], -- Array of certifications
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on team_members table
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Team members table policies
DROP POLICY IF EXISTS "Allow public read access on active team_members" ON team_members;
CREATE POLICY "Allow public read access on active team_members" ON team_members
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow authenticated users to manage team_members" ON team_members;
CREATE POLICY "Allow authenticated users to manage team_members" ON team_members
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_is_featured ON team_members(is_featured);
CREATE INDEX IF NOT EXISTS idx_team_members_department ON team_members(department);
CREATE INDEX IF NOT EXISTS idx_team_members_sort_order ON team_members(sort_order);
CREATE INDEX IF NOT EXISTS idx_team_members_created_at ON team_members(created_at DESC);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- No sample data inserted - team members are added through the admin panel

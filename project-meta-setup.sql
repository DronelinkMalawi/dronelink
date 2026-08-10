-- Project Meta Database Setup
-- This SQL creates table for project metadata used in the Image Management admin module

-- Project meta table for managing project/partnership/club metadata
CREATE TABLE IF NOT EXISTS project_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('partnership', 'club', 'project')),
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on project_meta table
ALTER TABLE project_meta ENABLE ROW LEVEL SECURITY;

-- Project meta table policies
DROP POLICY IF EXISTS "Allow public read access on project_meta" ON project_meta;
CREATE POLICY "Allow public read access on project_meta" ON project_meta
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage project_meta" ON project_meta;
CREATE POLICY "Allow authenticated users to manage project_meta" ON project_meta
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_project_meta_category ON project_meta(category);
CREATE INDEX IF NOT EXISTS idx_project_meta_featured ON project_meta(featured);
CREATE INDEX IF NOT EXISTS idx_project_meta_created_at ON project_meta(created_at DESC);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_project_meta_updated_at ON project_meta;
CREATE TRIGGER update_project_meta_updated_at
  BEFORE UPDATE ON project_meta
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Portfolio Items Database Setup
-- This SQL creates table for portfolio items with comprehensive fields

-- Portfolio items table for managing portfolio projects
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT, -- Short description for previews
  content TEXT NOT NULL, -- Full project content/details
  featured_image_url VARCHAR(500), -- Main project image
  images JSONB DEFAULT '[]', -- Array of additional project images
  category VARCHAR(100) NOT NULL, -- Project category
  tags TEXT[] DEFAULT '{}', -- Array of project tags
  client VARCHAR(255), -- Client name
  project_date DATE, -- When project was completed
  technologies TEXT[] DEFAULT '{}', -- Technologies used
  project_url VARCHAR(500), -- Live project URL
  github_url VARCHAR(500), -- Repository URL
  is_featured BOOLEAN DEFAULT false, -- Whether to feature on homepage
  is_published BOOLEAN DEFAULT true, -- Whether project is visible
  sort_order INTEGER DEFAULT 0, -- Order for display purposes
  meta_title VARCHAR(255), -- SEO meta title
  meta_description TEXT, -- SEO meta description
  view_count INTEGER DEFAULT 0, -- Project view counter
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on portfolio_items table
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Portfolio items table policies
CREATE POLICY "Allow public read access on published portfolio_items" ON portfolio_items
  FOR SELECT USING (is_published = true);

CREATE POLICY "Allow authenticated users to manage portfolio_items" ON portfolio_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_portfolio_items_slug ON portfolio_items(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_category ON portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_is_featured ON portfolio_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_is_published ON portfolio_items(is_published);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_sort_order ON portfolio_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_project_date ON portfolio_items(project_date DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_created_at ON portfolio_items(created_at DESC);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create a unique slug for portfolio items
CREATE OR REPLACE FUNCTION create_portfolio_slug(title TEXT)
 RETURNS TEXT AS $$
DECLARE
 base_slug TEXT;
 slug TEXT;
 counter INTEGER := 1;
BEGIN
 base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
 base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
 
 slug := base_slug;
 
 WHILE EXISTS (SELECT 1 FROM portfolio_items WHERE slug = slug) LOOP
   slug := base_slug || '-' || counter;
   counter := counter + 1;
 END LOOP;
 
 RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Insert sample portfolio categories (optional)
-- These can be used for categorization in the admin panel
INSERT INTO portfolio_items (title, slug, description, content, category, project_date, is_featured, technologies) VALUES
  ('Agricultural Drone Survey', 'agricultural-drone-survey', 'Precision agriculture mapping using drone technology', 'Comprehensive survey of 500-acre farm using multispectral imaging to identify crop health issues and optimize irrigation.', 'Agriculture', '2024-03-15', true, ARRAY['DJI Phantom 4', 'Multispectral Imaging', 'GIS Mapping']),
  ('Construction Site Monitoring', 'construction-site-monitoring', 'Weekly progress documentation for commercial construction', 'Weekly aerial monitoring of 12-month construction project with 3D mapping and volume calculations for earthworks.', 'Construction', '2024-02-20', true, ARRAY['DJI Matrice 300', 'Photogrammetry', '3D Modeling']),
  ('Real Estate Photography', 'real-estate-photography', 'Aerial photography for luxury property marketing', 'Complete aerial photography package for high-end residential property including twilight shots and neighborhood overview.', 'Real Estate', '2024-01-10', false, ARRAY['DJI Mavic 3', 'HDR Photography', 'Video Editing'])
ON CONFLICT (slug) DO NOTHING;
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

-- Add any missing columns if the table already exists
-- This handles the case where the portfolio_items table already exists with a simpler schema
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS featured_image_url VARCHAR(500);
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS project_date DATE;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS project_url VARCHAR(500);
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Drop old columns from the original schema that are replaced by the admin schema
-- image_url column has NOT NULL constraint that violates inserts - drop it
ALTER TABLE portfolio_items DROP COLUMN IF EXISTS image_url;
-- completion_date was the old date column - replaced by project_date
ALTER TABLE portfolio_items DROP COLUMN IF EXISTS completion_date;
-- Make client nullable since the admin doesn't always require it
ALTER TABLE portfolio_items ALTER COLUMN client DROP NOT NULL;

-- Drop any existing partial unique index on slug (it doesn't work with ON CONFLICT)
DROP INDEX IF EXISTS idx_portfolio_items_slug;

-- Add a proper UNIQUE constraint on slug for ON CONFLICT to work
ALTER TABLE portfolio_items DROP CONSTRAINT IF EXISTS portfolio_items_slug_key;
ALTER TABLE portfolio_items ADD CONSTRAINT portfolio_items_slug_key UNIQUE (slug);

-- Enable Row Level Security (RLS) on portfolio_items table
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Portfolio items table policies
DROP POLICY IF EXISTS "Allow public read access on published portfolio_items" ON portfolio_items;
CREATE POLICY "Allow public read access on published portfolio_items" ON portfolio_items
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Allow authenticated users to manage portfolio_items" ON portfolio_items;
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
DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;
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

-- No sample data inserted - portfolio items are added through the admin panel

-- Blog and Authors Database Setup
-- This SQL creates tables for blog posts, authors, categories, tags, and related functionality

-- Authors table for managing blog authors with profile information
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  profile_image_url VARCHAR(500),
  social_links JSONB DEFAULT '{}', -- Stores social media links (twitter, linkedin, etc.)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog categories for organizing content
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog tags for flexible content tagging
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table with comprehensive fields
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT, -- Short description for previews
  content TEXT NOT NULL, -- Full blog content (can be HTML or markdown)
  featured_image_url VARCHAR(500),
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title VARCHAR(255), -- SEO meta title
  meta_description TEXT, -- SEO meta description
  reading_time_minutes INTEGER, -- Estimated reading time
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE, -- When it was published
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for blog posts and tags (many-to-many relationship)
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Blog analytics for tracking engagement
CREATE TABLE IF NOT EXISTS blog_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'view', 'like', 'share', 'comment'
  user_ip VARCHAR(45), -- For tracking unique visitors
  user_agent TEXT, -- Browser/device info
  referrer VARCHAR(500), -- Where they came from
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;

-- Authors table policies
DROP POLICY IF EXISTS "Allow public read access on authors" ON authors;
CREATE POLICY "Allow public read access on authors" ON authors
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow authenticated users to manage authors" ON authors;
CREATE POLICY "Allow authenticated users to manage authors" ON authors
  FOR ALL USING (auth.role() = 'authenticated');

-- Blog categories policies
DROP POLICY IF EXISTS "Allow public read access on blog_categories" ON blog_categories;
CREATE POLICY "Allow public read access on blog_categories" ON blog_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage blog_categories" ON blog_categories;
CREATE POLICY "Allow authenticated users to manage blog_categories" ON blog_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Blog tags policies
DROP POLICY IF EXISTS "Allow public read access on blog_tags" ON blog_tags;
CREATE POLICY "Allow public read access on blog_tags" ON blog_tags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage blog_tags" ON blog_tags;
CREATE POLICY "Allow authenticated users to manage blog_tags" ON blog_tags
  FOR ALL USING (auth.role() = 'authenticated');

-- Blog posts policies
DROP POLICY IF EXISTS "Allow public read access on published blog_posts" ON blog_posts;
CREATE POLICY "Allow public read access on published blog_posts" ON blog_posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Allow authenticated users to manage blog_posts" ON blog_posts;
CREATE POLICY "Allow authenticated users to manage blog_posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Blog post tags policies
DROP POLICY IF EXISTS "Allow public read access on blog_post_tags" ON blog_post_tags;
CREATE POLICY "Allow public read access on blog_post_tags" ON blog_post_tags
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM blog_posts WHERE blog_posts.id = post_id AND blog_posts.status = 'published')
  );

DROP POLICY IF EXISTS "Allow authenticated users to manage blog_post_tags" ON blog_post_tags;
CREATE POLICY "Allow authenticated users to manage blog_post_tags" ON blog_post_tags
  FOR ALL USING (auth.role() = 'authenticated');

-- Blog analytics policies
DROP POLICY IF EXISTS "Allow public insert access on blog_analytics" ON blog_analytics;
CREATE POLICY "Allow public insert access on blog_analytics" ON blog_analytics
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read blog_analytics" ON blog_analytics;
CREATE POLICY "Allow authenticated users to read blog_analytics" ON blog_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_authors_email ON authors(email);
CREATE INDEX IF NOT EXISTS idx_authors_is_active ON authors(is_active);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);

CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id ON blog_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag_id ON blog_post_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_blog_analytics_post_id ON blog_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_event_type ON blog_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_created_at ON blog_analytics(created_at DESC);

-- Create function to update updated_at timestamp (reusable for all tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_authors_updated_at ON authors;
CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically generate slugs from titles
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Function to create a unique slug
CREATE OR REPLACE FUNCTION create_unique_slug(table_name TEXT, title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  slug TEXT;
  counter INTEGER := 1;
  slug_exists BOOLEAN;
BEGIN
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  
  slug := base_slug;
  
  LOOP
    -- Check if the slug already exists in the specified table
    EXECUTE format('SELECT EXISTS (SELECT 1 FROM %I WHERE slug = $1)', table_name)
      INTO slug_exists
      USING slug;
    
    EXIT WHEN NOT slug_exists;
    
    slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate a unique slug from the title when inserting a blog post
-- (the admin UI does not send a slug; keeping this DB-side guarantees the
-- 'slug NOT NULL UNIQUE' constraint is always satisfied)
CREATE OR REPLACE FUNCTION set_blog_post_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := create_unique_slug('blog_posts', NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_blog_post_slug ON blog_posts;
CREATE TRIGGER set_blog_post_slug
  BEFORE INSERT ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_blog_post_slug();

-- Insert default tags
INSERT INTO blog_tags (name, slug) VALUES
  ('drones', 'drones'),
  ('technology', 'technology'),
  ('agriculture', 'agriculture'),
  ('surveying', 'surveying'),
  ('photography', 'photography'),
  ('inspection', 'inspection'),
  ('mapping', 'mapping'),
  ('regulations', 'regulations'),
  ('safety', 'safety'),
  ('innovation', 'innovation')
ON CONFLICT (slug) DO NOTHING;

-- Create a view for blog posts with author and category information
CREATE OR REPLACE VIEW blog_posts_with_details AS
SELECT 
  bp.*,
  a.name as author_name,
  a.email as author_email,
  a.profile_image_url as author_profile_image,
  a.bio as author_bio,
  bc.name as category_name,
  bc.slug as category_slug,
  bc.color as category_color,
  COALESCE(
    json_agg(
      json_build_object(
        'id', bt.id,
        'name', bt.name,
        'slug', bt.slug
      )
    ) FILTER (WHERE bt.id IS NOT NULL), 
    '[]'::json
  ) as tags
FROM blog_posts bp
LEFT JOIN authors a ON bp.author_id = a.id
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
GROUP BY bp.id, a.name, a.email, a.profile_image_url, a.bio, bc.name, bc.slug, bc.color;

-- Create a function to get featured blog posts
CREATE OR REPLACE FUNCTION get_featured_posts(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  id UUID,
  title VARCHAR(255),
  slug VARCHAR(255),
  excerpt TEXT,
  featured_image_url VARCHAR(500),
  author_name VARCHAR(255),
  author_profile_image_url VARCHAR(500),
  category_name VARCHAR(100),
  category_slug VARCHAR(100),
  category_color VARCHAR(7),
  published_at TIMESTAMP WITH TIME ZONE,
  reading_time_minutes INTEGER,
  view_count INTEGER,
  tags JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.featured_image_url,
    a.name as author_name,
    a.profile_image_url as author_profile_image_url,
    bc.name as category_name,
    bc.slug as category_slug,
    bc.color as category_color,
    bp.published_at,
    bp.reading_time_minutes,
    bp.view_count,
    COALESCE(
      json_agg(
        json_build_object(
          'id', bt.id,
          'name', bt.name,
          'slug', bt.slug
        )
      ) FILTER (WHERE bt.id IS NOT NULL), 
      '[]'::json
    ) as tags
  FROM blog_posts bp
  LEFT JOIN authors a ON bp.author_id = a.id
  LEFT JOIN blog_categories bc ON bp.category_id = bc.id
  LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
  LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
  WHERE bp.status = 'published' AND bp.is_featured = true
  GROUP BY bp.id, a.name, a.profile_image_url, bc.name, bc.slug, bc.color
  ORDER BY bp.published_at DESC NULLS LAST
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
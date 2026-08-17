-- ============================================================================
-- DroneLink Admin - COMPLETE SETUP / FIX (idempotent, safe to re-run)
-- ============================================================================
-- Run this ENTIRE file in: Supabase Dashboard -> SQL Editor -> Run
--
-- Fixes BOTH reported issues:
--   1) "Adding pictures" not working  -> creates the missing public 'images'
--      storage bucket + storage RLS policies (admins can upload, public can view)
--   2) "Adding blog" not working      -> recreates the blog tables + all their
--      RLS policies so authenticated admins can insert, public can read
--   (+ ensure project_meta table + policies for the Image Management module)
--
-- Everything below is idempotent (CREATE ... IF NOT EXISTS / DROP POLICY IF
-- EXISTS / ON CONFLICT DO NOTHING), so you can re-run it any time.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0) Reusable helper function (used by triggers below)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ----------------------------------------------------------------------------
-- 1) BLOG: authors
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  profile_image_url VARCHAR(500),
  social_links JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on authors" ON authors;
CREATE POLICY "Allow public read access on authors" ON authors
  FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow authenticated users to manage authors" ON authors;
CREATE POLICY "Allow authenticated users to manage authors" ON authors
  FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_authors_updated_at ON authors;
CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_authors_email ON authors(email);
CREATE INDEX IF NOT EXISTS idx_authors_is_active ON authors(is_active);

-- ----------------------------------------------------------------------------
-- 2) BLOG: categories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on blog_categories" ON blog_categories;
CREATE POLICY "Allow public read access on blog_categories" ON blog_categories
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow authenticated users to manage blog_categories" ON blog_categories;
CREATE POLICY "Allow authenticated users to manage blog_categories" ON blog_categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- ----------------------------------------------------------------------------
-- 3) BLOG: tags
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on blog_tags" ON blog_tags;
CREATE POLICY "Allow public read access on blog_tags" ON blog_tags
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow authenticated users to manage blog_tags" ON blog_tags;
CREATE POLICY "Allow authenticated users to manage blog_tags" ON blog_tags
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);

-- ----------------------------------------------------------------------------
-- 4) BLOG: posts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url VARCHAR(500),
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title VARCHAR(255),
  meta_description TEXT,
  reading_time_minutes INTEGER,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on published blog_posts" ON blog_posts;
CREATE POLICY "Allow public read access on published blog_posts" ON blog_posts
  FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Allow authenticated users to manage blog_posts" ON blog_posts;
CREATE POLICY "Allow authenticated users to manage blog_posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- ----------------------------------------------------------------------------
-- 5) BLOG: post-tags junction
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on blog_post_tags" ON blog_post_tags;
CREATE POLICY "Allow public read access on blog_post_tags" ON blog_post_tags
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM blog_posts WHERE blog_posts.id = post_id AND blog_posts.status = 'published')
  );
DROP POLICY IF EXISTS "Allow authenticated users to manage blog_post_tags" ON blog_post_tags;
CREATE POLICY "Allow authenticated users to manage blog_post_tags" ON blog_post_tags
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id ON blog_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag_id ON blog_post_tags(tag_id);

-- ----------------------------------------------------------------------------
-- 6) BLOG: analytics
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  user_ip VARCHAR(45),
  user_agent TEXT,
  referrer VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert access on blog_analytics" ON blog_analytics;
CREATE POLICY "Allow public insert access on blog_analytics" ON blog_analytics
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated users to read blog_analytics" ON blog_analytics;
CREATE POLICY "Allow authenticated users to read blog_analytics" ON blog_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_blog_analytics_post_id ON blog_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_event_type ON blog_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_created_at ON blog_analytics(created_at DESC);

-- ----------------------------------------------------------------------------
-- 7) Slug helpers + default tags + blog view
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
END;
$$ LANGUAGE plpgsql;

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
      json_build_object('id', bt.id, 'name', bt.name, 'slug', bt.slug)
    ) FILTER (WHERE bt.id IS NOT NULL),
    '[]'::json
  ) as tags
FROM blog_posts bp
LEFT JOIN authors a ON bp.author_id = a.id
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
GROUP BY bp.id, a.name, a.email, a.profile_image_url, a.bio, bc.name, bc.slug, bc.color;

-- ----------------------------------------------------------------------------
-- 8) IMAGE MANAGEMENT: project_meta table + policies
-- ----------------------------------------------------------------------------
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

ALTER TABLE project_meta ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on project_meta" ON project_meta;
CREATE POLICY "Allow public read access on project_meta" ON project_meta
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow authenticated users to manage project_meta" ON project_meta;
CREATE POLICY "Allow authenticated users to manage project_meta" ON project_meta
  FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_project_meta_updated_at ON project_meta;
CREATE TRIGGER update_project_meta_updated_at
  BEFORE UPDATE ON project_meta
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_project_meta_category ON project_meta(category);
CREATE INDEX IF NOT EXISTS idx_project_meta_featured ON project_meta(featured);
CREATE INDEX IF NOT EXISTS idx_project_meta_created_at ON project_meta(created_at DESC);

-- ----------------------------------------------------------------------------
-- 9) STORAGE: the missing public 'images' bucket + storage policies
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view uploaded images (so they display on the public site)
DROP POLICY IF EXISTS "Public read access to images" ON storage.objects;
CREATE POLICY "Public read access to images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Only signed-in admins can upload / update / delete images
DROP POLICY IF EXISTS "Authenticated upload to images" ON storage.objects;
CREATE POLICY "Authenticated upload to images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated update in images" ON storage.objects;
CREATE POLICY "Authenticated update in images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated delete in images" ON storage.objects;
CREATE POLICY "Authenticated delete in images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- 10) PARTNERS (landing page "Our Partners" section)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  website VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on active partners" ON partners;
CREATE POLICY "Allow public read access on active partners" ON partners
  FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow authenticated users to manage partners" ON partners;
CREATE POLICY "Allow authenticated users to manage partners" ON partners
  FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_partners_is_active ON partners(is_active);
CREATE INDEX IF NOT EXISTS idx_partners_sort_order ON partners(sort_order);

-- No sample data inserted - partners are added through the admin panel

-- ----------------------------------------------------------------------------
-- 11) TESTIMONIALS (landing page "What Our Clients Say" section)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on active testimonials" ON testimonials;
CREATE POLICY "Allow public read access on active testimonials" ON testimonials
  FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow authenticated users to manage testimonials" ON testimonials;
CREATE POLICY "Allow authenticated users to manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON testimonials(sort_order);

-- No sample data inserted - testimonials are added through the admin panel

-- ----------------------------------------------------------------------------
-- 12) SERVICES (landing page "Enterprise Drone Intelligence Services" section)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index_label VARCHAR(10) NOT NULL DEFAULT '01',
  title VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]',
  link VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on active services" ON services;
CREATE POLICY "Allow public read access on active services" ON services
  FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow authenticated users to manage services" ON services;
CREATE POLICY "Allow authenticated users to manage services" ON services
  FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);

-- No sample data inserted - services are added through the admin panel

-- ----------------------------------------------------------------------------
-- 13) ANALYTICS (tables + policies + reporting functions for the Admin Analytics page)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  user_ip VARCHAR(45),
  user_agent TEXT,
  session_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monthly_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  portfolio_views INTEGER DEFAULT 0,
  blog_views INTEGER DEFAULT 0,
  contact_submissions INTEGER DEFAULT 0,
  top_pages JSONB DEFAULT '[]',
  top_referrers JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(year, month)
);

ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert access on site_analytics" ON site_analytics;
CREATE POLICY "Allow public insert access on site_analytics" ON site_analytics
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated users to read site_analytics" ON site_analytics;
CREATE POLICY "Allow authenticated users to read site_analytics" ON site_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to manage monthly_analytics" ON monthly_analytics;
CREATE POLICY "Allow authenticated users to manage monthly_analytics" ON monthly_analytics
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_site_analytics_event_type ON site_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_site_analytics_created_at ON site_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_analytics_session_id ON site_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_site_analytics_page_url ON site_analytics(page_url);
CREATE INDEX IF NOT EXISTS idx_monthly_analytics_year_month ON monthly_analytics(year, month);
CREATE INDEX IF NOT EXISTS idx_monthly_analytics_created_at ON monthly_analytics(created_at DESC);

DROP TRIGGER IF EXISTS update_monthly_analytics_updated_at ON monthly_analytics;
CREATE TRIGGER update_monthly_analytics_updated_at
  BEFORE UPDATE ON monthly_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Reporting functions used by the Admin Analytics page
CREATE OR REPLACE FUNCTION get_analytics_summary(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  total_page_views BIGINT,
  unique_visitors BIGINT,
  portfolio_views BIGINT,
  blog_views BIGINT,
  contact_submissions BIGINT,
  avg_daily_views NUMERIC,
  top_pages JSON,
  top_referrers JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE event_type = 'page_view') as total_page_views,
    COUNT(DISTINCT user_ip) as unique_visitors,
    COUNT(*) FILTER (WHERE event_type = 'portfolio_view') as portfolio_views,
    COUNT(*) FILTER (WHERE event_type = 'blog_view') as blog_views,
    COUNT(*) FILTER (WHERE event_type = 'contact_form') as contact_submissions,
    ROUND(COUNT(*) FILTER (WHERE event_type = 'page_view')::NUMERIC /
          GREATEST(EXTRACT(DAYS FROM end_date - start_date) + 1, 1), 2) as avg_daily_views,
    COALESCE(
      (
        SELECT json_agg(page_stats)
        FROM (
          SELECT page_url, COUNT(*) as views
          FROM site_analytics
          WHERE created_at::DATE >= start_date AND created_at::DATE <= end_date
            AND page_url IS NOT NULL
          GROUP BY page_url
          ORDER BY views DESC
          LIMIT 10
        ) page_stats
      ),
      '[]'::json
    ) as top_pages,
    COALESCE(
      (
        SELECT json_agg(referrer_stats)
        FROM (
          SELECT referrer, COUNT(*) as views
          FROM site_analytics
          WHERE created_at::DATE >= start_date AND created_at::DATE <= end_date
            AND referrer IS NOT NULL AND referrer != ''
          GROUP BY referrer
          ORDER BY views DESC
          LIMIT 10
        ) referrer_stats
      ),
      '[]'::json
    ) as top_referrers
  FROM site_analytics
  WHERE created_at::DATE >= start_date AND created_at::DATE <= end_date;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_daily_analytics(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  date DATE,
  page_views BIGINT,
  unique_visitors BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    created_at::DATE as date,
    COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
    COUNT(DISTINCT user_ip) as unique_visitors
  FROM site_analytics
  WHERE created_at::DATE >= start_date AND created_at::DATE <= end_date
    AND event_type = 'page_view'
  GROUP BY created_at::DATE
  ORDER BY date;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Done. This script can be re-run safely at any time.
-- ============================================================================





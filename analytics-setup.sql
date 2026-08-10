-- Analytics Database Setup
-- This SQL creates tables for tracking website analytics and user engagement
-- Note: This is the COMPLETE script. Run the ENTIRE file at once.

-- Site analytics for tracking overall metrics
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL, -- 'page_view', 'portfolio_view', 'blog_view', 'contact_form'
  page_url VARCHAR(500), -- URL of the page visited
  referrer VARCHAR(500), -- Where they came from
  user_ip VARCHAR(45), -- For tracking unique visitors
  user_agent TEXT, -- Browser/device info
  session_id VARCHAR(255), -- For tracking user sessions
  metadata JSONB DEFAULT '{}', -- Additional event-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly analytics summary for faster reporting
CREATE TABLE IF NOT EXISTS monthly_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  portfolio_views INTEGER DEFAULT 0,
  blog_views INTEGER DEFAULT 0,
  contact_submissions INTEGER DEFAULT 0,
  top_pages JSONB DEFAULT '[]', -- Array of most visited pages
  top_referrers JSONB DEFAULT '[]', -- Array of top traffic sources
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(year, month)
);

-- Enable Row Level Security (RLS) on analytics tables
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_analytics ENABLE ROW LEVEL SECURITY;

-- Site analytics policies
DROP POLICY IF EXISTS "Allow public insert access on site_analytics" ON site_analytics;
CREATE POLICY "Allow public insert access on site_analytics" ON site_analytics
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read site_analytics" ON site_analytics;
CREATE POLICY "Allow authenticated users to read site_analytics" ON site_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Monthly analytics policies
DROP POLICY IF EXISTS "Allow authenticated users to manage monthly_analytics" ON monthly_analytics;
CREATE POLICY "Allow authenticated users to manage monthly_analytics" ON monthly_analytics
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_site_analytics_event_type ON site_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_site_analytics_created_at ON site_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_analytics_session_id ON site_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_site_analytics_page_url ON site_analytics(page_url);

CREATE INDEX IF NOT EXISTS idx_monthly_analytics_year_month ON monthly_analytics(year, month);
CREATE INDEX IF NOT EXISTS idx_monthly_analytics_created_at ON monthly_analytics(created_at DESC);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_monthly_analytics_updated_at ON monthly_analytics;
CREATE TRIGGER update_monthly_analytics_updated_at
  BEFORE UPDATE ON monthly_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==== IMPORTANT: The RPC FUNCTIONS below are what the Analytics page calls ====
-- If you only see "Success. No rows returned" above, scroll down to ensure these ran too

-- Function to get analytics summary for a date range
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
          SELECT page_url, COUNT(*) as view_count
          FROM site_analytics
          WHERE created_at::DATE >= start_date AND created_at::DATE <= end_date
            AND page_url IS NOT NULL
          GROUP BY page_url
          ORDER BY view_count DESC
          LIMIT 10
        ) page_stats
      ),
      '[]'::json
    ) as top_pages,
    COALESCE(
      (
        SELECT json_agg(referrer_stats)
        FROM (
          SELECT referrer, COUNT(*) as view_count
          FROM site_analytics
          WHERE created_at::DATE >= start_date AND created_at::DATE <= end_date
            AND referrer IS NOT NULL AND referrer != ''
          GROUP BY referrer
          ORDER BY view_count DESC
          LIMIT 10
        ) referrer_stats
      ),
      '[]'::json
    ) as top_referrers
  FROM site_analytics
  WHERE created_at::DATE >= start_date AND created_at::DATE <= end_date;
END;
$$ LANGUAGE plpgsql;

-- Function to get daily analytics for charts
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
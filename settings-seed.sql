-- Settings Seed Data
-- Populates the `site_settings` table with the landing-page content that the
-- admin can edit from the admin panel (Settings -> General / Hero / Contact /
-- Social Media). Rows are marked `is_public = true` so they are readable by
-- the public anon key and reflected on the landing page.
--
-- Safe to re-run (uses ON CONFLICT DO NOTHING). Run this in the Supabase SQL
-- editor if your admin Settings page is empty.

INSERT INTO site_settings (key, value, description, type, category, is_public) VALUES
  -- General / brand
  ('company_name', 'DroneLinkMW', 'Company name shown in the navbar and footer', 'string', 'general', true),
  ('company_tagline', 'Aerial Intelligence · Malawi', 'Short tagline under the logo', 'string', 'general', true),
  ('company_description', 'Leading drone technology company in Malawi, specializing in aerial intelligence for agriculture, mapping, and environmental monitoring.', 'Footer about text', 'textarea', 'general', true),

  -- Hero
  ('hero_badge', 'Aerial Intelligence · Malawi', 'Small badge text at the top of the hero', 'string', 'general', true),
  ('hero_title_1', 'See your land with', 'First part of the hero headline', 'string', 'general', true),
  ('hero_title_highlight', 'total clarity.', 'Highlighted part of the hero headline', 'string', 'general', true),
  ('hero_subtitle', 'DroneLink gives agricultural, infrastructure, and environmental teams the high-accuracy aerial data they need to plan, monitor, and act with confidence.', 'Hero paragraph', 'textarea', 'general', true),
  ('hero_cta_primary', 'Explore Solutions', 'Primary hero button text', 'string', 'general', true),
  ('hero_cta_secondary', 'Watch Demo', 'Secondary hero button text', 'string', 'general', true),

  -- Stats
  ('stat_1_value', '500+', 'Stat 1 value', 'string', 'general', true),
  ('stat_1_label', 'Projects delivered', 'Stat 1 label', 'string', 'general', true),
  ('stat_2_value', '99.8%', 'Stat 2 value', 'string', 'general', true),
  ('stat_2_label', 'Data accuracy', 'Stat 2 label', 'string', 'general', true),
  ('stat_3_value', '24/7', 'Stat 3 value', 'string', 'general', true),
  ('stat_3_label', 'Operational support', 'Stat 3 label', 'string', 'general', true),

  -- Contact
  ('contact_phone', '+265 888 32 13 55', 'Primary contact phone number', 'string', 'contact', true),
  ('contact_email', 'info@dronelinkmw.com', 'Primary contact email', 'string', 'contact', true),
  ('contact_address_line1', 'Bingu National Stadium', 'Address line 1', 'string', 'contact', true),
  ('contact_address_line2', 'Corporate Box E26 · Lilongwe', 'Address line 2', 'string', 'contact', true),
  ('contact_hours_weekday', 'Mon–Fri 08:00–18:00', 'Weekday opening hours', 'string', 'contact', true),
  ('contact_hours_saturday', 'Sat 09:00–16:00', 'Saturday opening hours', 'string', 'contact', true),

  -- Social media
  ('social_facebook', '', 'Facebook profile URL', 'string', 'social', true),
  ('social_twitter', '', 'Twitter profile URL', 'string', 'social', true),
  ('social_linkedin', '', 'LinkedIn profile URL', 'string', 'social', true),
  ('social_instagram', '', 'Instagram profile URL', 'string', 'social', true)
ON CONFLICT (key) DO NOTHING;

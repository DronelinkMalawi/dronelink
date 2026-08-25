import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Site-wide settings loaded from the `site_settings` table (managed by the
 * admin panel). Only rows flagged with `is_public = true` are visible to the
 * public anon key via RLS, so whatever the admin edits here is what shows on
 * the landing page. Every field has a sensible default so the page renders
 * correctly even before any settings rows exist.
 */

export interface SiteSettings {
  // General / brand
  company_name: string;
  company_tagline: string;
  company_description: string;
  // Hero
  hero_badge: string;
  hero_title_1: string;
  hero_title_highlight: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  // Stats
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
  // Contact
  contact_phone: string;
  contact_email: string;
  contact_address_line1: string;
  contact_address_line2: string;
  contact_hours_weekday: string;
  contact_hours_saturday: string;
  // Social
  social_facebook: string;
  social_twitter: string;
  social_linkedin: string;
  social_instagram: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  company_name: 'DroneLinkMW',
  company_tagline: 'Aerial Intelligence · Malawi',
  company_description:
    'Leading drone technology company in Malawi, specializing in aerial intelligence for agriculture, mapping, and environmental monitoring.',
  hero_badge: 'Aerial Intelligence · Malawi',
  hero_title_1: 'See your land with',
  hero_title_highlight: 'total clarity.',
  hero_subtitle:
    'DroneLink gives agricultural, infrastructure, and environmental teams the high-accuracy aerial data they need to plan, monitor, and act with confidence.',
  hero_cta_primary: 'Explore Solutions',
  hero_cta_secondary: 'Watch Demo',
  stat_1_value: '500+',
  stat_1_label: 'Projects delivered',
  stat_2_value: '99.8%',
  stat_2_label: 'Data accuracy',
  stat_3_value: '24/7',
  stat_3_label: 'Operational support',
  contact_phone: '+265 888 32 13 55',
  contact_email: 'info@dronelinkmw.com',
  contact_address_line1: 'Bingu National Stadium',
  contact_address_line2: 'Corporate Box E26 · Lilongwe',
  contact_hours_weekday: 'Mon–Fri 08:00–18:00',
  contact_hours_saturday: 'Sat 09:00–16:00',
  social_facebook: '',
  social_twitter: '',
  social_linkedin: '',
  social_instagram: '',
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .eq('is_public', true);

        if (error) throw error;

        if (!cancelled && data && data.length > 0) {
          const map: Record<string, string> = {};
          data.forEach((row: { key: string; value: string | null }) => {
            if (row.value != null) map[row.key] = row.value;
          });
          setSettings((prev) => ({ ...prev, ...map }));
        }
      } catch (err) {
        // Keep defaults — the page should never break because of settings.
        console.error('Error fetching site settings:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

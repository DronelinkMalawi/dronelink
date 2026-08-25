import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Zap, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { supabase } from '@/lib/supabase';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const [footerServices, setFooterServices] = useState<string[]>([]);

  const fallbackServices = [
    'Aerial Imagery',
    'GIS Mapping',
    'Precision Agriculture',
    'Land Monitoring',
    'Custom Solutions',
  ];

  // Pull the active admin-managed services so the footer stays in sync.
  useEffect(() => {
    let cancelled = false;
    supabase
      .from('services')
      .select('title')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled || error) return;
        const titles = (data || []).map((s) => s.title).filter(Boolean);
        if (titles.length > 0) setFooterServices(titles);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const services = footerServices.length > 0 ? footerServices : fallbackServices;

  const quickLinks = [
    { name: 'About Us', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/#contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: settings.social_facebook, label: 'Facebook' },
    { icon: Twitter, href: settings.social_twitter, label: 'Twitter' },
    { icon: Linkedin, href: settings.social_linkedin, label: 'LinkedIn' },
    { icon: Instagram, href: settings.social_instagram, label: 'Instagram' },
  ].filter((social) => social.href);

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {settings.company_name}
              </span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              {settings.company_description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href || '#'}
                  target={social.href ? '_blank' : undefined}
                  rel={social.href ? 'noopener noreferrer' : undefined}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-slate-900/70 border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:text-cyan-400 transition-colors"
                >
                  <social.icon className="w-5 h-5 text-slate-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-400 hover:text-cyan-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="text-slate-400">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="leading-snug">
                  {settings.contact_address_line1}
                  <br />
                  {settings.contact_address_line2}
                </span>
              </div>
              <div className="flex gap-3 text-slate-400">
                <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>{settings.contact_phone}</span>
              </div>
              <div className="flex gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>{settings.contact_email}</span>
              </div>
            </div>

            <div className="mt-7">
              <h4 className="font-semibold text-white text-sm mb-3">Stay Updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-white/10 bg-slate-900 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                />
                <Button size="sm" className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} {settings.company_name}. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/privacy-policy" className="text-slate-500 hover:text-cyan-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-slate-500 hover:text-cyan-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-slate-500 hover:text-cyan-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

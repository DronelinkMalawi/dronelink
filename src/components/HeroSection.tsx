import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Camera,
  MapPin,
  Leaf,
  BarChart3,
  Check,
  Signal,
  Radar,
  SatelliteDish,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const capabilities = [
  { icon: Camera, label: 'Aerial Imagery' },
  { icon: MapPin, label: 'GIS Mapping' },
  { icon: Leaf, label: 'Precision Agriculture' },
  { icon: BarChart3, label: 'Data Analytics' },
];

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => setIsVisible(true), []);

  const stats = [
    { value: settings.stat_1_value, label: settings.stat_1_label },
    { value: settings.stat_2_value, label: settings.stat_2_label },
    { value: settings.stat_3_value, label: settings.stat_3_label },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 pt-20"
      aria-label="Hero"
    >
      {/* Image-free ambient background: gradient mesh + subtle grid */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_-10%,rgba(14,165,233,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_0%_110%,rgba(34,211,238,0.12),transparent_60%)]" />
        <div className="absolute -top-32 -right-24 w-[36rem] h-[36rem] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-0 -left-32 w-[32rem] h-[32rem] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16 py-20 items-center">
        {/* Text column */}
        <div className="lg:col-span-6">
          <div
            className={`inline-flex items-center gap-3 transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="h-px w-10 bg-cyan-400/70" aria-hidden />
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-cyan-300/90">
              <Radar className="w-3.5 h-3.5" aria-hidden />
              {settings.company_tagline}
            </span>
          </div>

          <h1
            className={`mt-8 text-5xl sm:text-6xl lg:text-[4.5rem] font-bold text-white tracking-tight leading-[1.02] transition-all duration-700 delay-100 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {settings.hero_title_1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400">
              {settings.hero_title_highlight}
            </span>
          </h1>

          <p
            className={`mt-7 text-lg md:text-xl text-slate-300/90 max-w-xl leading-relaxed transition-all duration-700 delay-200 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {settings.hero_subtitle}
          </p>

          <div
            className={`mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-700 delay-300 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link to="/services" aria-label="Explore solutions">
              <Button size="lg" className="group px-9 bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25">
                <span className="flex items-center">
                  {settings.hero_cta_primary}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link to="/demo" aria-label="Watch demo">
              <Button size="lg" variant="outline" className="px-9 border border-white/15 text-white hover:bg-slate-800/70 hover:border-white/25">
                <Play className="w-4 h-4 mr-2" />
                {settings.hero_cta_secondary}
              </Button>
            </Link>
          </div>

          {/* Stats band */}
          <div
            className={`mt-14 grid grid-cols-3 gap-8 border-t border-white/10 pt-10 max-w-xl transition-all duration-700 delay-400 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-left">
                <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">{stat.value}</div>
                <div className="mt-1.5 text-xs sm:text-sm text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual column — image-free data panel */}
        <div
          className={`lg:col-span-6 transition-all duration-700 delay-300 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-sm p-7 sm:p-9 shadow-2xl shadow-cyan-500/5">
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">Live Mission</p>
                <h3 className="mt-1 text-2xl font-bold text-white tracking-tight">Spatial intelligence, delivered</h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 px-3 py-1.5 text-[11px] font-medium text-cyan-300">
                <SatelliteDish className="w-3.5 h-3.5" aria-hidden />
                {settings.company_name}
              </span>
            </div>

            {/* Capability checklist */}
            <ul className="pt-6 space-y-4">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                const widths = ['48%', '70%', '58%', '82%'];
                return (
                  <li key={cap.label} className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-cyan-300" aria-hidden />
                      </div>
                      <span className="text-sm font-medium text-white">{cap.label}</span>
                    </div>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400"
                        style={{ width: widths[i] }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Metrics row */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div className="rounded-2xl bg-slate-950/50 border border-white/10 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Accuracy</p>
                <p className="mt-1 text-2xl font-bold text-white">±1<span className="text-cyan-400">cm</span></p>
              </div>
              <div className="rounded-2xl bg-slate-950/50 border border-white/10 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Turnaround</p>
                <p className="mt-1 text-2xl font-bold text-white">24h</p>
              </div>
              <div className="rounded-2xl bg-slate-950/50 border border-white/10 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Compliance</p>
                <p className="mt-1 text-2xl font-bold text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-cyan-400" aria-hidden />
                  Full
                </p>
              </div>
            </div>

            {/* Status strip */}
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
                </span>
                <span className="text-sm text-slate-200">All systems operational</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Signal className="w-4 h-4 text-cyan-400" aria-hidden />
                Malawi coverage
              </span>
            </div>
          </div>
      </div>
      </div>
    </section>
  );
};

export default HeroSection;
import { useEffect, useRef, useState } from 'react';
import { Shield, Target, Globe, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const values = [
  {
    icon: Target,
    number: '01',
    title: 'Precision First',
    description:
      'Sub-centimeter accuracy on every flight, ensuring data you can trust for critical planning decisions.',
  },
  {
    icon: Shield,
    number: '02',
    title: 'Operational Safety',
    description:
      'Strict adherence to Malawian civil aviation standards with fully insured, professional-grade systems.',
  },
  {
    icon: Globe,
    number: '03',
    title: 'Localized Impact',
    description:
      'Headquartered in Lilongwe, our solutions are purpose-built for the unique African terrain.',
  },
];

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: settings.stat_1_value, label: settings.stat_1_label },
    { value: settings.stat_2_value, label: settings.stat_2_label },
    { value: settings.stat_3_value, label: settings.stat_3_label },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-28 lg:py-36 bg-slate-950 overflow-hidden"
    >
      {/* Soft ambient accent */}
      <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-cyan-500/[0.06] blur-[160px] pointer-events-none" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Narrative column */}
          <div
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cyan-400/90">
              <span className="h-px w-8 bg-cyan-400/70" aria-hidden />
              Who We Are
            </p>

            <h2 className="mt-8 text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.05]">
              Pioneering spatial intelligence
              <span className="block text-slate-400"> for a changing region.</span>
            </h2>

            <p className="mt-6 text-lg text-slate-300/90 leading-relaxed max-w-xl">
              {settings.company_description}
            </p>

            <p className="mt-5 text-lg text-slate-300/90 leading-relaxed max-w-xl">
              From precision agriculture to infrastructure mapping, we turn
              high-resolution imagery into the clarity teams need to move forward.
            </p>

            {/* Mini stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-cyan-400 tracking-tight">{stat.value}</div>
                  <div className="mt-1 text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Values card */}
          <div
            className={`transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 sm:p-10">
              <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400 mb-8">
                The principles we fly by
              </h3>

              <div className="space-y-7">
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <div key={value.title} className="group flex gap-5 items-start">
                      <div className="w-11 h-11 shrink-0 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center transition-colors group-hover:border-cyan-400/40">
                        <Icon className="w-5 h-5 text-cyan-400" aria-hidden />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-500">{value.number}</span>
                          <h3 className="text-lg font-semibold text-white">{value.title}</h3>
                        </div>
                        <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <a
                href="/#services"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                aria-label="View services"
              >
                Explore the full impact
                <ArrowRight className="w-4 h-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

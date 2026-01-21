'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { Shield, Target, Globe, ArrowRight } from 'lucide-react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '500+', label: 'Scans Deployed' },
    { value: '99%', label: 'Data Precision' },
    { value: '24/7', label: 'Field Readiness' },
    { value: '100%', label: 'MW Registered' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Precision First',
      description: 'We prioritize sub-centimeter accuracy in every flight, ensuring data integrity for critical planning.',
    },
    {
      icon: Shield,
      title: 'Operational Safety',
      description: 'Strict adherence to Malawian civil aviation standards with fully insured, professional-grade systems.',
    },
    {
      icon: Globe,
      title: 'Localized Impact',
      description: 'Headquartered in Lilongwe, our solutions are built specifically for the unique African terrain.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 bg-white overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
          
          {/* Narrative Column */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-mono tracking-widest uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              Who We Are
            </div>

            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-slate-950 mb-8">
              Pioneering <span className="text-cyan-500">Spatial</span> <br />
              Intelligence in Malawi.
            </h2>

            <p className="text-xl text-slate-500 font-light leading-relaxed max-w-xl mb-12">
              <strong>DronelinkMW</strong> is more than a drone company. We are a data-first consultancy delivering enterprise-grade aerial solutions that combine autonomous systems with expert spatial analytics to empower NGOs, Estates, and Infrastructure developers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="h-14 px-10 bg-slate-950 text-white rounded-full font-bold hover:bg-cyan-600 transition-all">
                OUR TECHNOLOGY <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" className="h-14 px-10 border-slate-200 text-slate-600 rounded-full font-semibold hover:bg-slate-50">
                MEET THE PILOTS
              </Button>
            </div>
          </div>

          {/* Value Card - Terminal Style */}
          <div
            className={`transition-all duration-1000 delay-300 ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <Card className="border-none shadow-2xl shadow-slate-200 rounded-[2.5rem] bg-slate-950 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Globe className="w-48 h-48" />
              </div>
              
              <CardContent className="p-12 relative z-10">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em] mb-12">// CORE PRINCIPLES</h3>
                
                <div className="space-y-12">
                  {values.map((v) => (
                    <div key={v.title} className="group flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-cyan-500 transition-colors">
                        <v.icon className="w-5 h-5 text-cyan-400 group-hover:text-slate-950 transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-2 tracking-tight">{v.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-light">
                          {v.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dynamic Stats Bar */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100 rounded-[2rem] overflow-hidden shadow-xl transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-10 text-center hover:bg-slate-50 transition-colors group">
              <div className="text-5xl font-bold text-slate-950 mb-2 tracking-tighter group-hover:text-cyan-500 transition-colors">
                {s.value}
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Credibility Footer */}
        <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-100 pt-12">
          <div className="max-w-md text-center md:text-left">
             <h4 className="text-sm font-bold text-slate-950 mb-2">Institutional Trust</h4>
             <p className="text-xs text-slate-500 leading-relaxed">
               Registered with the Department of Civil Aviation (DCA) Malawi. Fully compliant with Part 101 of the Aviation Act.
             </p>
          </div>
          <div className="flex gap-8 opacity-30 grayscale contrast-125">
             {/* Replace with your local partner/regulatory logos */}
             <div className="h-8 w-24 bg-slate-400 rounded" />
             <div className="h-8 w-24 bg-slate-400 rounded" />
             <div className="h-8 w-24 bg-slate-400 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
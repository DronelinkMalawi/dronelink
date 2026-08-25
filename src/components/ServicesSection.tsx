'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface Service {
  id: string;
  index: string;
  title: string;
  description: string;
  features: string[];
  link: string;
}

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        setServices(
          (data || []).map((s) => ({
            id: s.id,
            index: s.index_label || '01',
            title: s.title,
            description: s.description,
            features: Array.isArray(s.features) ? s.features : [],
            link: s.link || '/contact',
          }))
        );
      } catch (err) {
        console.error('Error fetching services:', err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-slate-900/40">
      <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-cyan-500/[0.06] blur-[160px] pointer-events-none" aria-hidden />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl mb-16">
          <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cyan-400/90">
            <span className="h-px w-8 bg-cyan-400/70" aria-hidden />
            What We Do
          </p>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Enterprise drone
            <span className="block text-slate-400">intelligence services</span>
          </h2>
          <p className="mt-5 text-lg text-slate-300/90 max-w-3xl">
            We deliver mission-critical aerial data systems designed for accuracy,
            reliability, and confident operational decision-making across industries.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-10">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-slate-400 py-10">No services to display yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
            {services.map((service) => (
              <Card
                key={service.title}
                className="border border-white/10 bg-slate-900/70 rounded-2xl shadow-none transition-colors hover:border-cyan-400/30"
              >
                <CardContent className="p-8 lg:p-10 flex flex-col h-full">
                  <div className="mb-7 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
                      Service {service.index}
                    </span>
                    <span className="w-10 h-[2px] bg-cyan-400/60 rounded-full" />
                  </div>

                  <h3 className="text-2xl font-semibold text-white leading-snug mb-4">
                    {service.title}
                  </h3>

                  <p className="text-slate-400 leading-relaxed mb-8 max-w-xl">
                    {service.description}
                  </p>

                  {service.features.length > 0 && (
                    <ul className="flex flex-wrap gap-2 mb-8">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 text-slate-200 text-xs border border-white/10"
                        >
                          <span className="w-1 h-1 rounded-full bg-cyan-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto pt-4">
                    <Link to={service.link} className="group">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                        View Service Details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/40 p-10 lg:p-14 max-w-5xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Need a custom aerial intelligence solution?
          </h3>
          <p className="text-slate-300/90 mb-8 max-w-2xl">
            Our team works with enterprises, governments, and NGOs to design tailored
            drone systems that meet your operational requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact">
              <Button className="px-8 bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25">
                Request Consultation
              </Button>
            </Link>
            <Link to="/get-quote">
              <Button variant="outline" className="px-8 bg-slate-950/30 border border-white/15 text-white hover:bg-slate-800/70">
                Request Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
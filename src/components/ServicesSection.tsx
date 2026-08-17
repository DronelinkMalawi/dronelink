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
    <section id="services" className="relative py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <div className="inline-block mb-6 border border-foreground px-4 py-2 text-sm font-medium tracking-wide">
            SERVICES
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            Enterprise Drone
            <span className="block">Intelligence Services</span>
          </h2>

          <p className="mt-6 text-lg text-muted-foreground max-w-3xl">
            We deliver mission-critical aerial data systems designed for accuracy,
            reliability, and operational decision-making across industries.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-center text-muted-foreground py-10">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No services to display yet.</p>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24">
          {services.map((service) => (
            <Card
              key={service.title}
              className="
                relative border border-border bg-transparent rounded-none
                transition-all duration-300
                hover:bg-muted/40
              "
            >
              <CardContent className="p-8 lg:p-10 flex flex-col h-full">
                {/* Index */}
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-5xl font-bold text-muted-foreground">
                    {service.index}
                  </span>
                  <span className="w-12 h-[2px] bg-foreground" />
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-semibold mb-4 text-foreground">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm text-muted-foreground mb-10">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className="mr-3 block w-2 h-2 bg-foreground" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto pt-6 border-t border-border">
                  <Link to={service.link}>
                    <Button
                      variant="ghost"
                      className="group px-0 text-foreground hover:bg-transparent"
                    >
                      View Service Details
                      <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {/* Bottom CTA */}
        <div className="border border-foreground p-10 lg:p-14 max-w-5xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Need a Custom Aerial Intelligence Solution?
          </h3>

          <p className="text-muted-foreground mb-8 max-w-2xl">
            Our team works with enterprises, governments, and NGOs to design
            tailored drone systems that meet operational requirements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
<Link to="/contact">
              <Button className="rounded-none px-8">
                Request Consultation
              </Button>
            </Link>

            <Link to="/get-quote">
              <Button variant="outline" className="rounded-none px-8">
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

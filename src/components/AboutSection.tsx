'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const droneRef = useRef(null);

  /* ---------------- Parallax (desktop only) ---------------- */
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const drone = droneRef.current;
    if (!drone) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          drone.style.transform = `
            translateX(-50%)
            translateY(${window.scrollY * 0.18}px)
          `;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---------------- Section reveal ---------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.15 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '500+', label: 'Projects Completed' },
    { value: '99%', label: 'Client Satisfaction' },
    { value: '50+', label: 'Specialist Team Members' },
    { value: '24/7', label: 'Operational Support' },
  ];

  const values = [
    {
      title: 'Innovation First',
      description:
        'We develop and deploy advanced aerial data systems that push technological boundaries.',
    },
    {
      title: 'Precision & Quality',
      description:
        'Every mission is executed with strict operational discipline and data accuracy.',
    },
    {
      title: 'Sustainable Impact',
      description:
        'Our work supports environmental monitoring, conservation, and long-term planning.',
    },
  ];

  return (
    <section
      id="about"
      className="relative py-24 lg:py-32 bg-background overflow-hidden"
    >
      {/* Parallax Drone */}
      <div className="absolute top-20 left-1/2 w-full pointer-events-none">
        <img
          ref={droneRef}
          src="/images/drone.png"
          alt="Aerial drone"
          className="
            absolute left-1/2 w-[520px] max-w-none
            -translate-x-1/2
            will-change-transform
            transition-transform duration-75
            opacity-90
          "
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 mb-24 items-start">
          {/* Text Column */}
          <div
            className={`space-y-10 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
            }`}
          >
            <div className="inline-block border border-foreground px-4 py-2 text-sm font-medium tracking-wide">
              ABOUT
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Aerial Intelligence
              <span className="block">Built for Decision Makers</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl">
              <strong>DronelinkMW</strong> delivers enterprise-grade aerial data
              solutions combining unmanned systems, spatial analytics, and
              operational expertise across agriculture, mapping, and environmental sectors.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="rounded-none px-8">
                Company Overview
              </Button>
              <Button size="lg" variant="outline" className="rounded-none px-8">
                Leadership Team
              </Button>
            </div>
          </div>

          {/* Mission / Values */}
          <Card
            className={`border border-border bg-transparent rounded-none transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
            }`}
          >
            <CardContent className="p-8 lg:p-10">
              <h3 className="text-2xl font-semibold mb-6">
                Mission Statement
              </h3>

              <p className="text-muted-foreground mb-10 max-w-xl">
                To provide reliable, high-integrity aerial intelligence systems
                that enable informed planning, monitoring, and risk management.
              </p>

              <div className="space-y-6">
                {values.map((v, index) => (
                  <div
                    key={v.title}
                    className="grid grid-cols-[40px_1fr] gap-6 border-t border-border pt-6"
                  >
                    <div className="text-xl font-bold text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{v.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-border">
          {stats.map((s, index) => (
            <div
              key={s.label}
              className={`
                p-8 lg:p-10 text-center
                ${index !== 0 ? 'border-l border-border' : ''}
              `}
            >
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trust */}
        <div className="mt-20 max-w-3xl">
          <div className="border border-border p-8">
            <p className="text-lg font-medium">
              Trusted by enterprises, NGOs, and institutions across Africa
            </p>
            <p className="text-muted-foreground mt-2">
              Delivering reliable aerial intelligence for over a decade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

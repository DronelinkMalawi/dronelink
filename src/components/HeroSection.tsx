import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, MapPin, Camera, Leaf, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-drone.jpg';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    { icon: Camera, text: 'Aerial Imagery', description: 'High-resolution photography' },
    { icon: MapPin, text: 'GIS Mapping', description: 'Precise geographic data' },
    { icon: Leaf, text: 'Agriculture Tech', description: 'Smart crop monitoring' },
    { icon: BarChart3, text: 'Analytics', description: 'Real-time insights' },
  ];

  useEffect(() => setIsVisible(true), []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
      aria-label="Hero"
    >
      {/* Background Image with Overlays */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Drone surveying an agricultural field at sunrise"
          className="w-full h-full object-cover scale-105 transition-transform duration-1000 ease-out"
          loading="lazy"
          fetchPriority="low"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-blue-950/70 to-slate-950/75" aria-hidden />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      </div>

      {/* Minimal Floating Elements */}
      <div className="absolute top-20 left-12 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-60" aria-hidden />
      <div className="absolute top-40 right-24 w-3 h-3 bg-cyan-400 rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }} aria-hidden />
      <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-blue-500 rounded-full animate-float opacity-50" style={{ animationDelay: '1.5s' }} aria-hidden />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`max-w-5xl mx-auto transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center px-4 py-2 bg-white/8 backdrop-blur-sm border border-blue-400/20 rounded-full mb-8 hover:bg-white/12 transition-all duration-300">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2.5" />
            <span className="text-white/90 font-medium text-sm tracking-wide">Enterprise Drone Solutions</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight tracking-tight">
            Intelligent Aerial Solutions
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
            Enterprise-grade drone technology for precision mapping, agricultural analytics, and environmental monitoring with <strong className="text-blue-300 font-medium">industry-grade accuracy</strong>.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.text}
                  className={`group card-sm flex flex-col items-center text-center p-4 transition-all duration-500 hover:translate-y-[-6px] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="p-2.5 bg-white/6 rounded-lg mb-3">
                    <Icon className="w-5 h-5 text-blue-300" />
                  </div>
                  <h3 className="text-white font-semibold text-sm">{feature.text}</h3>
                  <p className="text-white/60 text-xs">{feature.description}</p>
                </article>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/services" aria-label="Explore Solutions">
              <Button className="group px-6 py-3">
                <span className="flex items-center">
                  Explore Solutions
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>

            <Link to="/demo" aria-label="Watch demo">
              <Button variant="outline" className="px-6 py-3">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Stats Section */}
          <section className="grid grid-cols-3 gap-8 max-w-2xl mx-auto py-8 px-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10" aria-label="Key statistics">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-1">500+</div>
              <div className="text-white/70 text-sm font-medium">Projects</div>
            </div>
            <div className="text-center border-l border-r border-white/10 px-4">
              <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-1">99.8%</div>
              <div className="text-white/70 text-sm font-medium">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-1">24/7</div>
              <div className="text-white/70 text-sm font-medium">Support</div>
            </div>
          </section>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" aria-hidden>
          <div className="flex flex-col items-center space-y-3">
            <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Scroll</span>
            <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white/50 rounded-full mt-1.5 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
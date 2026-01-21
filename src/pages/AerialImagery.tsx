import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  Play,
  Star,
  Users,
  ArrowRight,
  ChevronRight,
  Monitor,
  Gamepad2,
  Building2,
  Mountain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import aerialHero from '@/assets/aerial-imagery-hero.jpg';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FEATURES = [
  {
    icon: Camera,
    title: '4K Ultra HD Capture',
    description: 'Professional-grade cameras delivering cinematic clarity and stabilized raw footage.',
  },
  {
    icon: Play,
    title: 'Live Monitoring',
    description: 'Low-latency video streaming for real-time site coordination and remote directing.',
  },
  {
    icon: Star,
    title: 'Multi-angle Coverage',
    description: 'Dynamic flight paths capturing unique oblique and vertical perspectives.',
  },
  {
    icon: CheckCircle,
    title: 'Operational Safety',
    description: 'Fully insured operations with redundant systems and certified flight crews.',
  },
];

const APPLICATION_DETAILS = [
  {
    id: 'real-estate',
    title: 'Real Estate Marketing',
    icon: Building2,
    description: 'High-impact visuals that showcase property context, proximity to amenities, and architectural grandeur.',
    deliverables: ['Cinematic Walkthroughs', 'Twilight Aerials', 'Surrounding Area Maps'],
    value: 'Faster Sales Cycles'
  },
  {
    id: 'construction',
    title: 'Construction Monitoring',
    icon: Monitor,
    description: 'Systematic visual documentation of progress for stakeholders and project management archives.',
    deliverables: ['Weekly Progress Vlogs', 'Time-lapse Sequences', 'Safety Overviews'],
    value: 'Reduced Site Disputes'
  },
  {
    id: 'tourism',
    title: 'Tourism Promotion',
    icon: Mountain,
    description: 'Sweeping vistas and immersive landscapes designed to drive travel interest and digital engagement.',
    deliverables: ['4K Promo Reels', 'Social Media Shorts', '360° Virtual Tours'],
    value: 'Higher Booking Rates'
  },
  {
    id: 'infrastructure',
    title: 'Inspection & Events',
    icon: Gamepad2,
    description: 'Detailed visual capture for high-access assets or large-scale event documentation.',
    deliverables: ['Structural Close-ups', 'Crowd Density Views', 'Live Stream Feeds'],
    value: 'Operational Safety'
  }
];

const AerialImagery = () => {
  const [activeApp, setActiveApp] = useState(APPLICATION_DETAILS[0]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={aerialHero}
            alt="Professional aerial imagery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl">
            <Link to="/#services">
              <button className="flex items-center gap-2 mb-10 text-xs font-mono uppercase tracking-[0.3em] text-emerald-600 hover:text-emerald-700 transition-colors group">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Discovery
              </button>
            </Link>

            <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.85] mb-8 text-slate-950">
              Visual <span className="text-emerald-600 italic font-light">Storytelling</span> <br />
              From Above.
            </h1>

            <p className="text-xl text-slate-500 max-w-2xl mb-12 font-light leading-relaxed">
              Cinematic drone imagery and high-resolution photography designed for impact, clarity, and documentation across Malawi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-10 bg-slate-950 hover:bg-emerald-600 text-white rounded-full font-bold transition-all hover:scale-105">
                GET A QUOTE <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full font-semibold">
                <Play className="mr-2 w-4 h-4" /> VIEW PORTFOLIO
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES GRID ================= */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 shadow-2xl rounded-3xl overflow-hidden">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-white p-10 hover:bg-slate-50 transition-colors group">
                <feature.icon className="w-8 h-8 mb-8 text-emerald-600 stroke-[1.5px]" />
                <h3 className="text-lg font-bold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE APPLICATION DASHBOARD ================= */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-stretch">
            
            {/* Left: Application Selection */}
            <div className="lg:w-1/3">
              <h2 className="text-sm font-mono text-emerald-600 tracking-[0.3em] uppercase mb-4">// VERTICALS</h2>
              <h3 className="text-4xl font-medium mb-10 tracking-tight text-slate-950">Industry Use Cases</h3>
              
              <div className="space-y-3">
                {APPLICATION_DETAILS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setActiveApp(app)}
                    className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${
                      activeApp.id === app.id 
                      ? 'bg-slate-950 border-slate-950 text-white shadow-xl translate-x-4' 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <app.icon className={`w-5 h-5 ${activeApp.id === app.id ? 'text-emerald-400' : 'text-slate-300'}`} />
                      <span className="font-bold uppercase tracking-widest text-xs">{app.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeApp.id === app.id ? 'rotate-90' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Dynamic Case Detail */}
            <div className="lg:w-2/3">
              <div className="bg-slate-100 rounded-[3rem] p-12 md:p-16 h-full flex flex-col justify-between relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-[2px] w-12 bg-emerald-500" />
                    <span className="text-emerald-600 font-mono text-xs tracking-widest uppercase">Project Brief</span>
                  </div>

                  <h3 className="text-4xl font-medium mb-8 text-slate-950">{activeApp.title}</h3>
                  <p className="text-slate-600 text-lg font-light leading-relaxed mb-12 max-w-xl">
                    {activeApp.description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-12">
                    <div>
                      <h4 className="text-[10px] font-mono text-slate-400 tracking-[0.2em] uppercase mb-6">Deliverables</h4>
                      <ul className="space-y-4">
                        {activeApp.deliverables.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-center items-center text-center shadow-sm">
                      <div className="text-3xl font-bold text-slate-950 mb-2">{activeApp.value}</div>
                      <div className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest">Target Outcome</div>
                    </div>
                  </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row gap-6 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-medium">Standard SLA applies to all projects</span>
                  </div>
                  <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-10">
                    START PROJECT
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Successful Projects', val: '500+' },
              { label: 'HD Images Captured', val: '50k+' },
              { label: 'Client Satisfaction', val: '98%' },
              { label: 'Certified Pilots', val: 'Elite' },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-4xl font-bold text-slate-950 mb-2 tracking-tighter">{stat.val}</div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <Camera className="absolute top-0 right-0 w-96 h-96 text-white/10 translate-x-20 -translate-y-20 rotate-12" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter relative z-10">Capture your <br />best perspective.</h2>
          <Button size="lg" className="h-16 px-12 bg-slate-950 text-white font-bold hover:bg-slate-900 rounded-full shadow-2xl relative z-10 transition-transform hover:scale-105">
            GET A CUSTOM QUOTE
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AerialImagery;
import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  BarChart3,
  Shield,
  TreePine,
  Eye,
  Activity,
  ChevronRight,
  Zap,
  Microscope,
  Wind,
  Droplets,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SERVICES = [
  {
    icon: TreePine,
    title: 'Vegetation Analysis',
    description: 'Spectral data analysis for vegetation health and biomass.',
    stat: '95%',
    label: 'Accuracy',
    tag: 'SPECTRAL'
  },
  {
    icon: Shield,
    title: 'Erosion Detection',
    description: 'Early identification of erosion and land degradation.',
    stat: '2.5M',
    label: 'Hectares',
    tag: 'TERRAIN'
  },
  {
    icon: Eye,
    title: 'Wildlife Tracking',
    description: 'Non-invasive wildlife and habitat monitoring.',
    stat: '24/7',
    label: 'Real-time',
    tag: 'BIOTIC'
  },
  {
    icon: BarChart3,
    title: 'Environmental Impact',
    description: 'Long-term ecosystem change assessment.',
    stat: '200+',
    label: 'Projects',
    tag: 'ANALYSIS'
  }
];

const INDICATORS = [
  { 
    category: 'Vegetation', 
    summary: 'Monitoring photosynthetic activity and canopy density using multi-band sensors.',
    metrics: [
      { name: 'NDVI Index', desc: 'Plant vigor & health' },
      { name: 'Chlorophyll', desc: 'Nutrient absorption' },
      { name: 'Biomass', desc: 'Carbon sequestration' },
      { name: 'Diversity', desc: 'Species richness' }
    ] 
  },
  { 
    category: 'Soil', 
    summary: 'Sub-surface analysis of moisture levels and organic composition.',
    metrics: [
      { name: 'Moisture', desc: 'Hydration levels' },
      { name: 'Erosion', desc: 'Topsoil stability' },
      { name: 'Organic', desc: 'Carbon content' },
      { name: 'Contaminants', desc: 'Pollution detection' }
    ] 
  },
  { 
    category: 'Water', 
    summary: 'Assessing catchment health and surface water quality metrics.',
    metrics: [
      { name: 'Quality', desc: 'Chemical balance' },
      { name: 'Sediments', desc: 'Turbidity levels' },
      { name: 'Algae', desc: 'Bloom monitoring' },
      { name: 'Pollution', desc: 'Runoff tracking' }
    ] 
  }
];

export default function LandHealthMonitoring() {
  const [activeTab, setActiveTab] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Fix: Scroll to top and Mouse Tracker
  useEffect(() => {
    window.scrollTo(0, 0);
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans antialiased">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-6 pt-20 overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(16,185,129,0.15), transparent 80%)`
          }}
        />

        <div className="relative max-w-6xl mx-auto text-center z-10">
          <Link to="/#services">
            <button className="flex items-center gap-2 mx-auto mb-10 text-xs font-mono uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors group">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Back to Core Services
            </button>
          </Link>

          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] font-mono tracking-widest uppercase mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Ecosystem Monitor: Online
          </div>

          <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9] mb-8 text-slate-950">
            Precision <span className="text-emerald-600 font-light italic">Ecosystem</span> <br />
            Intelligence.
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Harnessing hyper-spectral imaging and neural analysis to protect 
            the planet’s most vital environmental assets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg shadow-emerald-100 transition-all hover:scale-105 flex items-center gap-2">
              DEPLOY MONITORING <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-10 py-4 border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all rounded-full font-semibold">
              TECHNICAL SPECS
            </button>
          </div>
        </div>
      </section>

      {/* ================= CAPABILITIES GRID ================= */}
      <section className="py-32 px-6 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-mono text-emerald-600 tracking-[0.3em] uppercase mb-4">// ANALYTICAL FRAMEWORK</h2>
            <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-950">Holistic Health Systems</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="text-[10px] font-mono text-emerald-600/50 mb-8 tracking-widest uppercase">{service.tag}</div>
                <service.icon className="w-10 h-10 mb-8 text-emerald-600 stroke-[1.5px]" />
                <h4 className="text-xl font-semibold mb-4 text-slate-950">{service.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-10 font-light">{service.description}</p>
                <div className="flex items-baseline gap-2 pt-6 border-t border-slate-50">
                  <span className="text-3xl font-mono text-slate-900">{service.stat}</span>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">{service.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE DASHBOARD ================= */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-stretch">
            {/* Nav Column */}
            <div className="lg:col-span-4">
              <h2 className="text-sm font-mono text-emerald-600 tracking-[0.3em] uppercase mb-8">/ DATA MODULES</h2>
              <h3 className="text-4xl font-medium mb-10 tracking-tight text-slate-950">Key Ecosystem Indicators</h3>
              <div className="space-y-2">
                {INDICATORS.map((indicator, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`w-full flex items-center justify-between p-6 text-left transition-all rounded-2xl border ${
                      activeTab === i 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200' 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200'
                    }`}
                  >
                    <span className="font-bold tracking-wide uppercase text-xs">{indicator.category}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === i ? 'rotate-90' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Display Column */}
            <div className="lg:col-span-8">
              <div className="bg-slate-950 rounded-[3rem] p-12 md:p-16 h-full text-white relative overflow-hidden shadow-2xl">
                <Microscope className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
                
                <div className="relative z-10">
                  <h4 className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-6">Currently Inspecting</h4>
                  <h3 className="text-3xl font-medium mb-6">{INDICATORS[activeTab].category} Metrics</h3>
                  <p className="text-slate-400 text-lg font-light leading-relaxed mb-12 max-w-xl">
                    {INDICATORS[activeTab].summary}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {INDICATORS[activeTab].metrics.map((metric) => (
                      <div key={metric.name} className="group p-6 bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-white uppercase tracking-wider">{metric.name}</span>
                          <Zap className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-slate-500">{metric.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  */}

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto relative overflow-hidden bg-emerald-600 p-16 md:p-24 text-center rounded-[3rem] shadow-2xl shadow-emerald-100">
          <Activity className="absolute top-0 left-0 w-64 h-64 text-white/10 -translate-x-20 -translate-y-20" />
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tighter">Protect the <br />next frontier.</h2>
          <Link to="/#contact">
            <button className="px-12 py-5 bg-white text-emerald-600 font-bold hover:scale-105 transition-transform rounded-full shadow-xl relative z-10">
              GET STARTED NOW
            </button>
          </Link>
          
        </div>
      </section>

      <Footer />
    </div>
  );
}
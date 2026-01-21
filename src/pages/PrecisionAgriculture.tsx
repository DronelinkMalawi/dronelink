import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  CheckCircle, 
  TrendingUp, 
  Droplets, 
  Bug, 
  BarChart3, 
  ArrowRight,
  Target,
  Layers,
  Cpu,
  Zap,
  ChevronRight,
  Sprout
} from 'lucide-react';
import { Link } from 'react-router-dom';
import agricultureHero from '@/assets/agriculture-hero.jpg';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TECHNOLOGIES = [
  {
    icon: TrendingUp,
    title: 'Crop Health Monitoring',
    description: 'Advanced multispectral imaging to identify plant stress before it becomes visible.',
    tag: 'VISUAL AI'
  },
  {
    icon: BarChart3,
    title: 'Yield Prediction',
    description: 'AI-powered analytics to forecast yields and optimize harvest logistics.',
    tag: 'PREDICTIVE'
  },
  {
    icon: Droplets,
    title: 'Irrigation Planning',
    description: 'Precision water management through detailed soil moisture analysis.',
    tag: 'RESOURCES'
  },
  {
    icon: Bug,
    title: 'Pest Detection',
    description: 'Early identification of infestations for hyper-localized intervention.',
    tag: 'PROTECTION'
  }
];

const CROP_INTELLIGENCE = [
  { 
    name: 'Maize', 
    description: "Malawi's primary staple crop. We focus on nitrogen levels and cob maturity mapping.",
    impacts: ['25% Yield Increase', 'Optimized Urea Application', 'Early Stalk Borer Detection'],
    metric: '98% Data Precision'
  },
  { 
    name: 'Tea', 
    description: 'High-altitude plantation monitoring for plucking readiness and bush health.',
    impacts: ['Enhanced Grade Quality', 'Plucking Window Accuracy', 'Biomass Density Mapping'],
    metric: 'Sub-cm Resolution'
  },
  { 
    name: 'Coffee', 
    description: 'Precision mapping for bean uniformity and cherry ripening stages.',
    impacts: ['Uniform Ripening Data', 'Water Stress Management', 'Disease Hotspot Alerts'],
    metric: 'Real-time Alerts'
  },
  { 
    name: 'Sugarcane', 
    description: 'Large-scale estate monitoring for sucrose content optimization.',
    impacts: ['Harvest Sequence Planning', 'Drainage Analysis', 'Irrigation Leak Detection'],
    metric: 'Estate-wide Coverage'
  }
];

export default function PrecisionAgriculture() {
  const [activeCrop, setActiveCrop] = useState(CROP_INTELLIGENCE[0]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100">
      <Navbar />
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={agricultureHero}
            alt="Precision agriculture"
            className="w-full h-full object-cover opacity-10 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <Link to="/#services">
            <button className="flex items-center gap-2 mx-auto mb-10 text-xs font-mono uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors group">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Back to Intel Suite
            </button>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] font-mono tracking-[0.2em] uppercase mb-8">
            <Target className="w-3 h-3" />
            Autonomous Agronomy v3.1
          </div>

          <h1 className="text-5xl md:text-8xl font-medium tracking-tighter leading-[0.9] mb-8 text-slate-950">
            Precision <span className="text-emerald-600 italic font-light">Yield</span> <br />
            Engineering.
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Revolutionizing the Malawian agricultural landscape through 
            multispectral drone intelligence and AI-driven growth analysis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-lg shadow-emerald-100">
              REQUEST FIELD SCAN <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full font-semibold">
              EXPLORE ANALYTICS
            </Button>
          </div>
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="py-32 px-6 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-mono text-emerald-600 tracking-[0.3em] uppercase mb-4">// ARCHITECTURE</h2>
            <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-950">The Monitoring Stack</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TECHNOLOGIES.map((tech) => (
              <Card key={tech.title} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
                <CardContent className="p-10">
                  <div className="text-[10px] font-mono text-emerald-600/60 mb-8 tracking-widest uppercase">{tech.tag}</div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-colors">
                    <tech.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">{tech.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-light">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE CROP DASHBOARD ================= */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left: Crop Navigation (5 Columns) */}
            <div className="lg:col-span-5">
              <h2 className="text-sm font-mono text-emerald-600 tracking-[0.3em] uppercase mb-8">/ LOCAL OPTIMIZATION</h2>
              <h3 className="text-4xl font-medium mb-10 tracking-tight text-slate-950">Crop Intelligence</h3>
              <div className="space-y-3">
                {CROP_INTELLIGENCE.map((crop) => (
                  <button
                    key={crop.name}
                    onClick={() => setActiveCrop(crop)}
                    className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${
                      activeCrop.name === crop.name 
                      ? 'bg-white border-emerald-500 shadow-xl ring-1 ring-emerald-500' 
                      : 'bg-transparent border-slate-100 text-slate-500 hover:border-emerald-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Sprout className={`w-5 h-5 ${activeCrop.name === crop.name ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span className={`font-bold uppercase tracking-widest text-xs ${activeCrop.name === crop.name ? 'text-slate-950' : ''}`}>
                        {crop.name}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeCrop.name === crop.name ? 'translate-x-1 text-emerald-500' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Dynamic Impact Panel (7 Columns) */}
            <div className="lg:col-span-7">
              <div className="bg-slate-950 rounded-[2.5rem] p-12 h-full text-white relative overflow-hidden shadow-2xl flex flex-col">
                <Cpu className="absolute -top-10 -right-10 w-64 h-64 text-white/5" />
                
                <div className="relative z-10 flex-1">
                  <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono mb-8 uppercase tracking-widest">
                    <Zap className="w-3 h-3" /> Targeted Performance
                  </div>
                  
                  <h3 className="text-4xl font-medium mb-6 tracking-tight">{activeCrop.name} <span className="text-emerald-500">Analytics</span></h3>
                  <p className="text-slate-400 text-lg font-light leading-relaxed mb-12 border-l-2 border-emerald-500 pl-6">
                    {activeCrop.description}
                  </p>

                  <div className="grid sm:grid-cols-1 gap-4 mb-12">
                    {activeCrop.impacts.map((impact, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-slate-200 font-medium tracking-tight text-sm">{impact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-emerald-500 font-mono text-xl font-bold">{activeCrop.metric}</div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Verified Impact</div>
                  </div>
                  <Button className="bg-white text-slate-950 hover:bg-emerald-50 rounded-full font-bold px-8">
                    GET CASE STUDY
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      

      {/* ================= PROCESS STEPS ================= */}
      <section className="py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
             <h2 className="text-sm font-mono text-emerald-600 tracking-[0.3em] uppercase mb-4">// WORKFLOW</h2>
             <h3 className="text-4xl font-medium tracking-tight text-slate-950">Monitoring Lifecycle</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative">
             <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-slate-200 z-0" />
             {[
               { step: '01', title: 'Baseline Scan', desc: 'Initial field calibration and soil moisture profiling.' },
               { step: '02', title: 'Strategic Sorties', desc: 'Autonomous drone missions scheduled via AI forecasting.' },
               { step: '03', title: 'Actionable Intelligence', desc: 'Direct prescriptions for fertilizer, water, and pest control.' }
             ].map((item) => (
               <div key={item.step} className="relative z-10 text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-white bg-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-xl text-white font-mono font-bold text-xl">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-slate-950">{item.title}</h4>
                  <p className="text-slate-500 text-sm font-light leading-relaxed px-4">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-emerald-100">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <Sprout className="w-[40rem] h-[40rem] text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter relative z-10">Maximize your <br />harvest potential.</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button size="lg" className="h-16 px-12 bg-white text-emerald-600 font-bold hover:bg-emerald-50 rounded-full shadow-2xl transition-transform hover:scale-105">
              BOOK A FIELD ASSESSMENT
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
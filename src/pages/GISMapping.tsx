import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Globe,
  Layers,
  BarChart3,
  CheckCircle,
  Maximize,
  Database,
  Compass,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gisHero from '@/assets/gis-mapping-hero.jpg';

// Define the data structure for the interactive section
const DELIVERABLES_DATA = [
  { 
    id: 'ortho',
    title: 'Orthomosaic Maps', 
    description: 'Georeferenced, high-resolution aerial imagery.',
    details: 'Our orthomosaics are stitched from hundreds of high-res photos, corrected for topographic relief and lens distortion.',
    useCases: ['Encroachment monitoring', 'Project progress tracking', 'Asset inspection'],
    specs: 'Resolution: up to 1cm/pixel'
  },
  { 
    id: 'dem',
    title: 'Digital Elevation Models', 
    description: 'Accurate terrain and surface elevation data.',
    details: 'Essential for hydrological modeling and site grading. We provide both DSM (Surface) and DTM (Terrain) models.',
    useCases: ['Flood risk analysis', 'Road alignment planning', 'Site leveling'],
    specs: 'Accuracy: < 5cm Vertical'
  },
  { 
    id: 'contour',
    title: 'Contour Maps', 
    description: 'Engineering-grade contour datasets.',
    details: 'Traditional survey outputs generated from dense point clouds, ready for immediate engineering use.',
    useCases: ['Architectural design', 'Land subdivision', 'Drainage planning'],
    specs: 'Intervals: 0.25m to 5m'
  },
  { 
    id: 'vol',
    title: 'Volume Calculations', 
    description: 'Stockpile and cut/fill measurements.',
    details: 'Fast and safe volumetric analysis without manual climbing. Ideal for mining and construction logistics.',
    useCases: ['Stockpile inventory', 'Earthworks balance', 'Quarry management'],
    specs: 'Precision: 98-99%'
  },
  { 
    id: 'cad',
    title: 'CAD-Ready Files', 
    description: 'Standard .dwg and .dxf survey outputs.',
    details: 'Vectorized data that integrates directly into your existing AutoCAD, Civil 3D, or Revit workflows.',
    useCases: ['BIM integration', 'Construction staking', 'Legal boundary filing'],
    specs: 'Format: .DWG, .DXF, .SHP'
  }
];

export default function GISMapping() {
  const [activeItem, setActiveItem] = useState(DELIVERABLES_DATA[0]);

  // Add this block at the top of your component
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' to prevent the user from seeing the jump
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100">
      <Navbar />

      {/* ================= HERO SECTION (Condensed for Focus) ================= */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img src={gisHero} alt="GIS" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] font-mono tracking-[0.2em] uppercase mb-8">
              <Compass className="w-3 h-3" />
              Spatial Intelligence Suite
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] mb-8 text-slate-950">
              Interactive <span className="text-emerald-600 italic font-light">GIS</span> <br />
              Data Solutions.
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mb-10 font-light leading-relaxed">
              Explore our precision deliverables. Select a data type below to see how it transforms your industry operations.
            </p>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE DASHBOARD SECTION ================= */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-stretch">
            
            {/* LEFT: SELECTION LIST (5 Columns) */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-mono text-emerald-600 tracking-[0.3em] uppercase mb-8">
                // SELECT DELIVERABLE
              </h3>
              {DELIVERABLES_DATA.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                    activeItem.id === item.id 
                    ? 'bg-white border-emerald-500 shadow-xl ring-1 ring-emerald-500' 
                    : 'bg-transparent border-slate-200 hover:border-emerald-300 hover:bg-white'
                  }`}
                >
                  <div>
                    <h4 className={`font-bold transition-colors ${activeItem.id === item.id ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-light">{item.description}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${activeItem.id === item.id ? 'translate-x-1 text-emerald-500' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            {/* RIGHT: DYNAMIC PREVIEW PANEL (7 Columns) */}
            <div className="lg:col-span-7">
              <div className="bg-slate-950 rounded-[2.5rem] p-10 md:p-14 h-full relative overflow-hidden text-white flex flex-col shadow-2xl transition-all duration-500">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                    <Layers className="w-96 h-96" />
                </div>

                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-[1px] w-12 bg-emerald-500" />
                    <span className="text-emerald-500 font-mono text-xs tracking-widest uppercase">Intelligence Module</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
                    {activeItem.title}
                  </h2>
                  
                  <p className="text-slate-400 text-lg font-light leading-relaxed mb-10 border-l border-white/10 pl-6">
                    {activeItem.details}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div>
                      <h5 className="text-emerald-400 text-[10px] font-mono tracking-widest uppercase mb-4">Core Applications</h5>
                      <ul className="space-y-3">
                        {activeItem.useCases.map((u, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                            <CheckCircle className="w-4 h-4 text-emerald-500/50" />
                            {u}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                        <h5 className="text-emerald-400 text-[10px] font-mono tracking-widest uppercase mb-4">Technical Specs</h5>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <div className="flex items-center gap-3 text-sm text-slate-200 italic">
                                <Zap className="w-4 h-4 text-emerald-500" />
                                {activeItem.specs}
                            </div>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Database className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-xs text-slate-500 uppercase tracking-widest">Survey Grade Verified</span>
                  </div>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                    View Sample Case
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/*  */}

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">Ready for precision?</h2>
          <Link to="/#contact">
            <Button className="h-16 px-10 bg-white text-emerald-600 font-bold hover:scale-105 transition-transform rounded-full shadow-xl">
              GET FREE CONSULTATION <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
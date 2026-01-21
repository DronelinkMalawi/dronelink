'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/dronelinkwhite.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('/#')) {
      const hash = href.replace('/', '');
      if (location.pathname === '/') {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-[100] transition-all duration-300">
      <nav
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isOpen
            ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-[120]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <img 
              src={logo}
              alt="DroneLinkMW Logo"
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-lg font-bold tracking-tighter text-white uppercase">
              DroneLink<span className="text-cyan-400">MW</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/60 hover:text-cyan-400 transition-colors"
              >
                {item.name}
              </button>
            ))}
            <Link to="/get-quote">
              <Button size="sm" className="rounded-full bg-cyan-500 text-slate-950 hover:bg-white font-bold px-6 shadow-lg shadow-cyan-500/20">
                START PROJECT
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white w-10 h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Improved Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[110] flex flex-col pt-32 px-8"
            >
              {/* Subtle Ambient Background Light */}
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="flex flex-col space-y-6 relative z-10">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => handleNavClick(item.href)}
                    className="text-left"
                  >
                    <span className="text-xs font-mono text-cyan-500 tracking-[0.3em] uppercase block mb-1">0{index + 1}</span>
                    <span className="text-4xl font-bold text-white tracking-tighter hover:text-cyan-400 transition-colors">
                      {item.name}
                    </span>
                  </motion.button>
                ))}

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-10 border-t border-white/10"
                >
                  <Link to="/get-quote" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-16 rounded-2xl bg-white text-slate-950 font-bold text-lg hover:bg-cyan-400 shadow-xl">
                      GET A QUOTE
                    </Button>
                  </Link>
                  <p className="text-center mt-8 text-white/30 font-mono text-[10px] tracking-widest uppercase">
                    © 2026 DRONELINKMW // AERIAL INTELLIGENCE
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
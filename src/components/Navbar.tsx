import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const firstMobileLinkRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) firstMobileLinkRef.current?.focus();
  }, [isOpen]);

  // Handle hash navigation on page load
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.offsetTop - navbarHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location.hash]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      
      if (location.pathname !== path) {
        // Navigate to the page first, then scroll to section
        navigate(href);
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const navbarHeight = 80; // Approximate navbar height (md:h-20 = 5rem = 80px)
            const elementPosition = element.offsetTop - navbarHeight;
            window.scrollTo({
              top: elementPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        // Already on the page, just scroll to section
        const element = document.getElementById(hash);
        if (element) {
          const navbarHeight = 80; // Approximate navbar height (md:h-20 = 5rem = 80px)
          const elementPosition = element.offsetTop - navbarHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }
    } else {
      navigate(href);
    }
  };

  const isActive = (href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      return location.pathname === path && location.hash === `#${hash}`;
    }
    return location.pathname === href;
  };

  return (
    <header className="sticky top-0 z-50">
      <nav
        aria-label="Main navigation"
        className={`transition-colors duration-200 ${
          isScrolled
            ? 'bg-slate-950/85 backdrop-blur border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <div className="h-9 w-9 grid place-items-center border border-white/20">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm tracking-wide font-semibold uppercase text-white">
                DroneLink<span className="text-cyan-400">MW</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative text-xs uppercase tracking-widest transition-colors bg-transparent border-none cursor-pointer ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-2 left-0 h-px w-full bg-cyan-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/demo">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/5"
                >
                  Demo
                </Button>
              </Link>
              <Link to="/get-quote">
                <Button
                  size="sm"
                  className="bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-semibold"
                >
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 text-white focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-x-0 top-16 bottom-0 bg-slate-950 transition-all duration-200 ${
            isOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="px-6 pt-10 space-y-6">
            {navItems.map((item, i) => (
              <button
                key={item.name}
                ref={i === 0 ? firstMobileLinkRef : undefined}
                onClick={() => handleNavClick(item.href)}
                className="block text-lg uppercase tracking-widest text-white/70 hover:text-white bg-transparent border-none cursor-pointer text-left w-full"
              >
                {item.name}
              </button>
            ))}

            <div className="pt-8 space-y-3 border-t border-white/10">
              <Link to="/demo">
                <Button variant="outline" className="w-full border-white/20 text-white">
                  Demo
                </Button>
              </Link>
              <Link to="/get-quote">
                <Button className="w-full bg-cyan-500 text-slate-950 font-semibold">
                  Get Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

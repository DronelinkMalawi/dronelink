import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const firstMobileLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      firstMobileLinkRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) =>
    href.startsWith('#')
      ? location.hash === href || (!location.hash && href === '#home')
      : location.pathname === href;

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`relative transition-all duration-500 ${
          isScrolled
            ? 'bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]'
            : 'bg-transparent'
        }`}
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:scale-105 transition">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                DroneLink<span className="text-cyan-400">MW</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {isActive(item.href) && (
                    <span className="absolute inset-0 -z-10 rounded-lg bg-white/10 backdrop-blur-md" />
                  )}
                  {item.name}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/demo">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </Link>
              <Link to="/get-quote">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:opacity-90"
                >
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="md:hidden rounded-lg p-2 text-white/80 hover:bg-white/10 transition"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-x-0 top-16 bottom-0 bg-slate-950/80 backdrop-blur-2xl transition-transform duration-500 ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="px-6 pt-8 space-y-2">
            {navItems.map((item, i) => (
              <a
                key={item.name}
                href={item.href}
                ref={i === 0 ? firstMobileLinkRef : undefined}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-5 py-4 text-lg font-medium text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                {item.name}
              </a>
            ))}

              <div className="mt-6 space-y-3">
              <Link to="/demo">
                <Button variant="outline" className="w-full border-white/20 text-white">
                  Schedule Demo
                </Button>
              </Link>
              <Link to="/get-quote">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
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

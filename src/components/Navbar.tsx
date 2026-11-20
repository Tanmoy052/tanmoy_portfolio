import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu, X, Lock, FileText } from 'lucide-react';

interface NavbarProps {
  theme?: string;
  setTheme?: (t: any) => void;
  onOpenAdmin?: () => void;
  onOpenDocuments?: () => void;
  [key: string]: any;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenDocuments }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];

  // Efficient IntersectionObserver Scrollspy for zero-lag scroll tracking without forced layout reflows
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    };

    const observedElements: HTMLElement[] = [];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    }, observerOptions);

    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) {
        observer.observe(el);
        observedElements.push(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false);

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Name on the Left */}
        <a 
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-500 tracking-tight hover:opacity-90 transition-opacity"
        >
          Tanmoy
        </a>

        {/* Navigation Links on the Right (Laptops & Desktops) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-7 2xl:gap-9">
          {navLinks.map((link) => {
            const isActive = activeNav === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
                className={`text-sm xl:text-base font-normal transition-colors duration-200 relative py-1 ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-medium'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0.3 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 dark:bg-blue-400 rounded-full origin-center"
                  />
                )}
              </a>
            );
          })}
          <button
            onClick={onOpenAdmin || (() => { window.history.pushState({}, '', '/admin'); window.dispatchEvent(new PopStateEvent('popstate')); })}
            className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition cursor-pointer"
            title="Admin Console"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Red Area: Personal Documents Section Button */}
          <button
            onClick={onOpenDocuments}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-sm hover:shadow-md hover:shadow-blue-500/25 active:scale-95 transition-all duration-200 cursor-pointer border border-blue-400/30"
            title="Personal Documents Vault (Secure PDF Downloads)"
          >
            <FileText className="w-4 h-4 text-blue-100 group-hover:text-white transition" />
            <span className="tracking-tight">Documents</span>
          </button>
        </nav>

        {/* Mobile & Tablet View Toggle & Quick Documents Trigger */}
        <div className="lg:hidden flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenDocuments}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm transition active:scale-95 cursor-pointer"
            title="Personal Documents Vault"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Documents</span>
            <span className="sm:hidden">Docs</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 cursor-pointer active:scale-95 transition"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile & Tablet Menu Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 space-y-2 shadow-lg"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.id);
              }}
              className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeNav === link.id
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenDocuments) onOpenDocuments();
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-2 transition"
          >
            <FileText className="w-4 h-4" />
            Personal Documents Vault
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenAdmin) onOpenAdmin();
              else {
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-emerald-500 hover:bg-emerald-500/10 flex items-center gap-2 transition"
          >
            <Lock className="w-4 h-4" />
            Admin Console
          </button>
        </motion.div>
      )}
    </header>
  );
};


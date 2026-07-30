import React, { useState, useEffect } from 'react';
import { ThemeMode, AccentColor } from './types';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProjectShowcase } from './components/ProjectShowcase';
import { SkillsMatrix } from './components/SkillsMatrix';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PortfolioAuditModal } from './components/PortfolioAuditModal';
import { ResumeModal } from './components/ResumeModal';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('portfolio_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'matrix') return saved as ThemeMode;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });
  const [accent, setAccent] = useState<AccentColor>('emerald');
  const [auditOpen, setAuditOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('portfolio_theme', theme);
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else if (theme === 'matrix') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  // Handle ESC key to close active modals & lock body scroll when modal is open
  useEffect(() => {
    const isAnyModalOpen = auditOpen || resumeOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAuditOpen(false);
        setResumeOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [auditOpen, resumeOpen]);

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen selection:bg-emerald-500 selection:text-slate-950 font-sans transition-colors duration-500 ${
      theme === 'light' 
        ? 'bg-slate-50 text-slate-900' 
        : theme === 'matrix' 
          ? 'bg-black text-green-400 font-mono' 
          : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Precision Custom Cursor */}
      <CustomCursor />

      {/* Main Glass Navigation Header */}
      <Navbar
        theme={theme}
        setTheme={setTheme}
        accent={accent}
        setAccent={setAccent}
        onOpenAudit={() => setAuditOpen(true)}
        onOpenResume={() => setResumeOpen(true)}
        onOpenTerminal={scrollToAbout}
      />

      {/* Page Sections */}
      <main>
        <Hero
          onOpenResume={() => setResumeOpen(true)}
        />

        <AboutSection onOpenResume={() => setResumeOpen(true)} />

        <SkillsMatrix />

        <ProjectShowcase />

        <ExperienceTimeline />

        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <PortfolioAuditModal
        isOpen={auditOpen}
        onClose={() => setAuditOpen(false)}
      />

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

    </div>
  );
}

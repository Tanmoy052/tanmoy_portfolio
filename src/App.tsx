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
import { PortfolioProvider } from './context/PortfolioContext';

// Dynamic lazy imports for admin routes to optimize bundle size
const AdminPanel = React.lazy(() =>
  import('./components/admin/AdminPanel').then((m) => ({ default: m.AdminPanel }))
);
const AdminLogin = React.lazy(() =>
  import('./components/admin/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [accent, setAccent] = useState<AccentColor>('emerald');
  const [auditOpen, setAuditOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  // Path & Hash based routing for /admin and /admin/login
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      const h = window.location.hash;
      if (p === '/admin/login' || h === '#admin/login' || h === '#login') return '/admin/login';
      if (p === '/admin' || p.startsWith('/admin') || h === '#admin') return '/admin';
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const p = window.location.pathname;
      const h = window.location.hash;
      if (p === '/admin/login' || h === '#admin/login' || h === '#login') {
        setCurrentPath('/admin/login');
      } else if (p === '/admin' || p.startsWith('/admin') || h === '#admin') {
        setCurrentPath('/admin');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToAdmin = () => {
    const isAuthed = typeof window !== 'undefined' && sessionStorage.getItem('admin_auth') === 'true';
    const target = isAuthed ? '/admin' : '/admin/login';
    window.history.pushState({}, '', target);
    setCurrentPath(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPortfolio = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentPath('/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    window.history.pushState({}, '', '/admin/login');
    setCurrentPath('/admin/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('portfolio_theme', 'light');
    root.classList.remove('dark');
    root.classList.add('light');
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#f8fafc');
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
    <PortfolioProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-slate-950 font-sans">
        
        {/* Precision Custom Cursor */}
        <CustomCursor />

        {currentPath === '/admin/login' ? (
          /* Dedicated Admin Login Route */
          <React.Suspense
            fallback={
              <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                Loading Admin Portal...
              </div>
            }
          >
            <AdminLogin
              onLoginSuccess={handleLoginSuccess}
              onBackToPortfolio={navigateToPortfolio}
            />
          </React.Suspense>
        ) : currentPath === '/admin' ? (
          /* Protected Admin Dashboard Route */
          <React.Suspense
            fallback={
              <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                Loading Dashboard...
              </div>
            }
          >
            <AdminPanel
              onBackToPortfolio={navigateToPortfolio}
              onLogout={handleLogout}
            />
          </React.Suspense>
        ) : (
          /* Public Portfolio View */
          <>
            {/* Main Glass Navigation Header */}
            <Navbar
              theme={theme}
              setTheme={setTheme}
              accent={accent}
              setAccent={setAccent}
              onOpenAudit={() => setAuditOpen(true)}
              onOpenResume={() => setResumeOpen(true)}
              onOpenTerminal={scrollToAbout}
              onOpenAdmin={navigateToAdmin}
            />

            {/* Page Sections */}
            <main>
              <Hero onOpenResume={() => setResumeOpen(true)} />

              <AboutSection onOpenResume={() => setResumeOpen(true)} />

              <SkillsMatrix />

              <ProjectShowcase />

              <ExperienceTimeline />

              <ContactSection />
            </main>

            {/* Footer */}
            <Footer onOpenAdmin={navigateToAdmin} />

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
          </>
        )}

      </div>
    </PortfolioProvider>
  );
}

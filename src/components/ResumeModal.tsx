import React, { useState, useEffect } from 'react';
import { X, Download, Printer, Mail, MapPin, ExternalLink, FileText, Smartphone, Layers } from 'lucide-react';
import { PERSONAL_INFO, SKILL_CATEGORIES, TIMELINE } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [activeView, setActiveView] = useState<'pdf' | 'interactive'>('pdf');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileQuery = window.matchMedia('(max-width: 768px)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobile(mobileQuery);
      if (mobileQuery) {
        setActiveView('interactive');
      } else {
        setActiveView('pdf');
      }
    };
    if (isOpen) {
      checkMobile();
    }
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const resumePdfUrl = "/Tanmoy_Pal_Resume.pdf";

  return (
    <div id="resume-modal-backdrop" onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div 
        id="resume-modal-content"
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Responsive Header Bar */}
        <div className="p-3 sm:p-4 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3 shrink-0">
          
          {/* Top Row: Title + View Switcher + Close Button */}
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                Tanmoy Pal - Resume
              </h2>
            </div>

            {/* View Mode Toggle Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setActiveView('interactive')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                    activeView === 'interactive' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Interactive</span> Overview
                </button>
                <button
                  onClick={() => setActiveView('pdf')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                    activeView === 'pdf' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF Document</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 sm:border-t-0 sm:pt-0">
            <a
              href={resumePdfUrl}
              download="Tanmoy_Pal_Resume.pdf"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold whitespace-nowrap transition-colors shadow-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </a>

            <a
              href={resumePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap transition-colors shadow-xs shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open Full PDF Tab
            </a>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold whitespace-nowrap transition-colors shrink-0"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>

        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-3 sm:p-6 min-h-[50vh] max-h-[75vh]">
          {activeView === 'pdf' ? (
            <div className="w-full h-full flex flex-col items-center">
              {isMobile && (
                <div className="w-full mb-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-2 text-xs text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>Viewing PDF file. For best view on mobile, tap Open PDF Tab.</span>
                  </div>
                  <a
                    href={resumePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg whitespace-nowrap"
                  >
                    Open PDF Tab
                  </a>
                </div>
              )}

              <div className="w-full h-[60vh] sm:h-[68vh] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-inner">
                <object
                  data={`${resumePdfUrl}#toolbar=1`}
                  type="application/pdf"
                  className="w-full h-full border-0"
                >
                  <iframe
                    src={`${resumePdfUrl}#toolbar=1`}
                    title="Tanmoy Pal Resume PDF"
                    className="w-full h-full border-0"
                  >
                    <div className="p-8 text-center space-y-4">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                      <p className="text-slate-600 dark:text-slate-300 text-sm">Unable to render PDF preview directly in this browser environment.</p>
                      <a
                        href={resumePdfUrl}
                        download="Tanmoy_Pal_Resume.pdf"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-sm"
                      >
                        <Download className="w-4 h-4" /> Download Tanmoy_Pal_Resume.pdf
                      </a>
                    </div>
                  </iframe>
                </object>
              </div>
            </div>
          ) : (
            /* Interactive Mobile Resume Overview */
            <div className="space-y-4 sm:space-y-6 text-slate-900 dark:text-slate-100 max-w-3xl mx-auto">
              {/* Header Info Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{PERSONAL_INFO.name}</h3>
                    <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">{PERSONAL_INFO.tagline}</p>
                  </div>
                  <a href={resumePdfUrl} download className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap">
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </a>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {PERSONAL_INFO.bio}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {PERSONAL_INFO.location}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-cyan-500 shrink-0" /> {PERSONAL_INFO.email}</span>
                </div>
              </div>

              {/* Skills Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" /> Core Technical Skills
                </h4>
                <div className="space-y-3">
                  {SKILL_CATEGORIES.map((cat) => (
                    <div key={cat.id} className="space-y-1">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{cat.title}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.skills.map((skill) => (
                          <span key={skill.name} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono">
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Experience & Journey</h4>
                <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
                  {TIMELINE.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{item.role} @ {item.companyOrInstitution}</span>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 shrink-0">{item.year}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


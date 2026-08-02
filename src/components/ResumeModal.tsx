import React from 'react';
import { X, Download, Printer, Mail, Github, Linkedin, MapPin, ExternalLink, FileText } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES, TIMELINE } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="resume-modal-backdrop" onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div 
        id="resume-modal-content"
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Tanmoy Pal - Software Engineer Resume</h2>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/Tanmoy_Pal_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open Full PDF Tab
            </a>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded PDF Viewer */}
        <div className="w-full h-[80vh] bg-slate-100 dark:bg-slate-950">
          <iframe 
            src="/Tanmoy_Pal_Resume.pdf#toolbar=1" 
            title="Tanmoy Pal Resume PDF"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};

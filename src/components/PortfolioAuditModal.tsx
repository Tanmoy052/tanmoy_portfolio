import React from 'react';
import { X, CheckCircle2, BarChart2, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { PORTFOLIO_AUDIT_POINTS } from '../data/portfolioData';

interface PortfolioAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioAuditModal: React.FC<PortfolioAuditModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div id="audit-modal-backdrop" onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div 
        id="audit-modal-content"
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Portfolio Review & Upgrade Audit</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Analysis of original Vercel portfolio vs. Updated Interactive Architecture</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" /> Review Summary for tanmoypal-portfolio.vercel.app
            </div>
            <p>
              Your original portfolio established a great baseline! To elevate it into a top-tier senior developer presentation, this updated version introduces high-contrast dark/light modes, interactive project filtering, code snippet inspection, a real CLI terminal easter egg, a project estimator utility, and Tanmoy's AI Twin powered by Gemini.
            </p>
          </div>

          {/* Audit Matrix Table */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Detailed UX & Architecture Improvements</h3>
            
            <div className="space-y-3">
              {PORTFOLIO_AUDIT_POINTS.map((pt, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{pt.area}</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {pt.impactScore}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-rose-500/20 text-slate-600 dark:text-slate-400">
                      <span className="text-rose-500 dark:text-rose-400 font-bold block mb-1">Previous State:</span>
                      {pt.observation}
                    </div>
                    <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-emerald-500/20 text-slate-700 dark:text-slate-300">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">Updated Enhancement:</span>
                      {pt.improvementMade}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

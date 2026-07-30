import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layout, 
  Server, 
  Database, 
  Wrench, 
  Cpu, 
  Sparkles,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

export const SkillsMatrix: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<{
    category: string;
    name: string;
    level: number;
    experience: string;
    description: string;
  } | null>(null);

  // Icon mapping for categories
  const getCategoryTheme = (id: string) => {
    switch (id) {
      case 'frontend':
        return {
          icon: Layout,
          iconBg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
          badgeHover: 'hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400',
          accentColor: 'text-blue-600 dark:text-blue-400',
        };
      case 'backend':
        return {
          icon: Server,
          iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          badgeHover: 'hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400',
          accentColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'database':
        return {
          icon: Database,
          iconBg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
          badgeHover: 'hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:text-purple-600 dark:hover:text-purple-400',
          accentColor: 'text-purple-600 dark:text-purple-400',
        };
      case 'tools':
      default:
        return {
          icon: Wrench,
          iconBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
          badgeHover: 'hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 hover:text-amber-600 dark:hover:text-amber-400',
          accentColor: 'text-amber-600 dark:text-amber-400',
        };
    }
  };

  return (
    <section id="skills" className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative border-t border-slate-200 dark:border-slate-900 transition-colors duration-300">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-[1500px] h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold"
          >
            <Cpu className="w-3.5 h-3.5" /> Technical Skill Matrix & Stack
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Skills & Core Technologies
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            A comprehensive overview of my technical stack across frontend frameworks, backend engines, databases, and deployment platforms.
          </motion.p>
        </div>

        {/* 4 Cards Grid - Expanded Wide Width Side-by-Side Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8 items-stretch">
          {SKILL_CATEGORIES.map((category, idx) => {
            const theme = getCategoryTheme(category.id);
            const IconComponent = theme.icon;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between w-full"
              >
                <div>
                  {/* Category Card Header */}
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className={`p-3 rounded-xl border ${theme.iconBg} flex items-center justify-center shrink-0`}>
                      <IconComponent className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills Badge Pills */}
                  <div className="flex flex-wrap gap-2.5 sm:gap-3 items-start content-start">
                    {category.skills.map((skill) => (
                      <motion.button
                        key={skill.name}
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedSkill({
                          category: category.title,
                          name: skill.name,
                          level: skill.level,
                          experience: skill.experience,
                          description: skill.description
                        })}
                        className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 transition-all shadow-xs flex items-center gap-2 group cursor-pointer ${theme.badgeHover}`}
                        title={`Click for ${skill.name} proficiency details`}
                      >
                        <span>{skill.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Footer hint */}
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono">
                  <span>{category.skills.length} Stack Items</span>
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Tap for details
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Skill Detail Modal */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4"
              >
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                  <Sparkles className="w-4 h-4" /> {selectedSkill.category} Skill Profile
                </div>

                <div className="space-y-1">
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedSkill.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Experience: {selectedSkill.experience}
                  </p>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                  {selectedSkill.description}
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Proficiency Score</span>
                    <span className="font-mono text-cyan-600 dark:text-cyan-400">{selectedSkill.level}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${selectedSkill.level}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};


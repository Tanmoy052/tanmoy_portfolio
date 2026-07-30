import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap, MapPin, Calendar, Award, Server, Globe, Building2, CheckCircle2, Sparkles } from 'lucide-react';
import { TIMELINE } from '../data/portfolioData';

export const ExperienceTimeline: React.FC = () => {
  const experienceItems = TIMELINE.filter((t) => t.type === 'Experience');
  const educationItems = TIMELINE.filter((t) => t.type === 'Education');

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* SECTION 1: EXPERIENCE */}
      <section id="experience" className="py-20 sm:py-24 border-t border-slate-200 dark:border-slate-900 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold"
            >
              <Briefcase className="w-3.5 h-3.5" /> Career Journey & Work Experience
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              Work Experience
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed"
            >
              Chronological summary of backend software engineering, API development, and client web solutions.
            </motion.p>
          </div>

          {/* Experience Timeline Container */}
          <div className="relative ml-2 sm:ml-4 pl-6 sm:pl-10 space-y-8">
            {/* Continuous Vertical Timeline Line */}
            <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-600 via-blue-400 to-slate-200 dark:to-slate-800 rounded-full" />

            {experienceItems.map((item, idx) => {
              const isCurrent = item.year.includes('Present');
              const IconComponent = item.role.toLowerCase().includes('backend') ? Server : Globe;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline Dot Node on vertical line */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-7 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-600 dark:bg-blue-500 border-2 sm:border-3 border-white dark:border-slate-950 shadow-md ring-4 ring-blue-500/20 group-hover:scale-125 group-hover:ring-blue-500/40 transition-all duration-300 z-10" />

                  {/* Experience Card */}
                  <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-800/80 transition-all duration-300 relative overflow-hidden">
                    {/* Subtle Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity" />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-start gap-4">
                        {/* Company / Role Branding Icon */}
                        <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <IconComponent className="w-6 h-6 stroke-[2]" />
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            {item.role}
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                Active Role
                              </span>
                            )}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-blue-600 dark:text-blue-400">
                            <span className="flex items-center gap-1.5">
                              <Building2 className="w-4 h-4" />
                              {item.companyOrInstitution}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-normal font-mono">
                              <MapPin className="w-3.5 h-3.5 text-amber-500" />
                              {item.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Date Badge */}
                      <div className="self-start px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center gap-1.5 shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>{item.year}</span>
                      </div>
                    </div>

                    {/* Key Highlights Bullet Points */}
                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="mt-5 space-y-3">
                        {item.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Skills / Tech Stack Badges */}
                    {item.skillsUsed && item.skillsUsed.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-500" /> Stack:
                        </span>
                        {item.skillsUsed.map((sk, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-lg text-xs font-semibold font-mono bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 2: EDUCATION */}
      <section id="education" className="py-20 sm:py-24 border-t border-slate-200 dark:border-slate-900 relative">
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold"
            >
              <GraduationCap className="w-3.5 h-3.5" /> Academic Background & Education
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              Education & Qualifications
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed"
            >
              Academic degrees, institutions, and core specialized coursework in engineering and computer science.
            </motion.p>
          </div>

          {/* Education 2x2 Grid (Matching Image 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {educationItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Header row with Graduation Icon & Title */}
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0">
                      <GraduationCap className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                        {item.role}
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5 mt-1">
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.companyOrInstitution}</span>
                      </p>
                    </div>
                  </div>

                  {/* Date and Location Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>{item.year}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{item.location}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>

                {/* Skills / Coursework Tag Badges */}
                {item.skillsUsed && item.skillsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800/80">
                    {item.skillsUsed.map((sk, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-blue-50/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60 tracking-wider uppercase"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

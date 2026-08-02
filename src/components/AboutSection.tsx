import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Code2,
  Rocket,
  Zap,
  Brain,
  Layers,
  Award,
  MapPin,
  CheckCircle2,
  Sparkles,
  Heart,
  Globe,
  Terminal,
  Cpu,
  Download,
  FileText
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface AboutSectionProps {
  onOpenResume?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenResume }) => {
  const [activeTab, setActiveTab] = useState<'philosophy' | 'stack' | 'vision'>('philosophy');

  const stats = [
    { label: 'Featured Projects', value: '10+', desc: 'Full-stack & AI solutions' },
    { label: 'Mastery Stack', value: 'MERN + TS', desc: 'React 19, Node.js, Express' },
    { label: 'Client Satisfaction', value: '100%', desc: 'Production-ready execution' },
    { label: 'Experience', value: '2+ Years', desc: 'Crafting modern web apps' }
  ];

  const highlights = [
    {
      icon: Code2,
      title: 'Full-Stack Architecture',
      description: 'Building end-to-end web applications with modular React frontends and scalable Express/Node backends.'
    },
    {
      icon: Zap,
      title: 'Performance & UX Specialist',
      description: 'Prioritizing sub-second render times, smooth 60 FPS Framer Motion physics, and clean responsive layouts.'
    },
    {
      icon: Brain,
      title: 'AI & Next-Gen Tech Integrations',
      description: 'Connecting Gemini API, LLM prompt workflows, and real-time WebSockets to supercharge user workflows.'
    },
    {
      icon: Layers,
      title: 'Clean Code & Best Practices',
      description: 'Enforcing strict TypeScript safety, clean component boundaries, and production-tested API design.'
    }
  ];

  return (
    <section id="about" className="py-24 relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 border-t border-slate-200 dark:border-slate-900/80">

      {/* Background Ambient Illumination */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
          >
            <User className="w-3.5 h-3.5" /> About Me & Engineering Philosophy
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            A Deep Dive Into My Professional World
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            I am a full-stack developer dedicated to turning complex problems into intuitive, high-performance web applications.
          </motion.p>
        </div>

        {/* Main Grid: Bio & Strengths Left, Portrait Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">

          {/* Left Column: Bio Story & Strengths */}
          <div className="lg:col-span-8 flex flex-col h-full">

            {/* Bio & Story Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-full flex flex-col justify-between space-y-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-7 sm:p-8 lg:p-9 shadow-xl dark:shadow-2xl backdrop-blur-md"
            >
              <div>
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-slate-950 text-base shadow-md">
                    TP
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{PERSONAL_INFO.name}</h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">{PERSONAL_INFO.tagline}</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed sm:leading-relaxed">
                  <p>
                    Hello! I'm <strong className="text-slate-900 dark:text-white font-semibold">{PERSONAL_INFO.name}</strong>, a passionate software developer based in <span className="text-cyan-600 dark:text-cyan-400 font-medium">India</span>. My journey into software engineering began with a curiosity for how full-stack systems interact behind sleek user interfaces.
                  </p>
                  <p>
                    Specializing in the <strong className="text-emerald-600 dark:text-emerald-400">MERN stack (MongoDB, Express, React, Node.js)</strong> and modern <strong className="text-cyan-600 dark:text-cyan-400">TypeScript</strong>, I build applications that blend aesthetic elegance with robust backend architecture. From real-time SaaS dashboards and e-commerce engines to Gemini-powered AI studios, I focus on crafting software that solves real user problems.
                  </p>
                  <p>
                    When I'm not writing code, I actively explore emerging AI research, optimize frontend web vitals, contribute to open-source tools, and continuously upgrade my engineering toolkit.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Global Remote / Onsite</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    <span>Kolkata, India</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span>Full-Stack Engineer</span>
                  </div>
                </div>

                <a
                  href="/Tanmoy_Pal_Resume.pdf"
                  download="Tanmoy_Pal_Resume.pdf"
                  className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Portrait Photo Card featuring tanmoy_pal.png */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl dark:shadow-2xl backdrop-blur-md relative overflow-hidden group max-w-sm w-full mx-auto lg:ml-auto lg:mr-0 flex flex-col justify-between space-y-4"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3.5">
              {/* Photo Container with capped width and compact aspect ratio */}
              <div className="relative w-full max-w-[260px] aspect-[4/5] max-h-72 mx-auto rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md group-hover:border-emerald-500/40 transition-all duration-300">
                <img
                  src="/tanmoy_pal.png"
                  alt={PERSONAL_INFO.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter brightness-[1.08] contrast-[1.03] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />

                {/* Live Availability Badge on Photo */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-medium text-white bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Available for Work
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">Full-Stack</span>
                </div>
              </div>

              <div className="space-y-0.5 text-center sm:text-left">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                  {PERSONAL_INFO.name}
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                </h3>
                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  {PERSONAL_INFO.tagline}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{PERSONAL_INFO.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>MERN Engineer</span>
                </div>
              </div>

              <a
                href="/Tanmoy_Pal_Resume.pdf"
                download="Tanmoy_Pal_Resume.pdf"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Resume / CV</span>
              </a>
            </div>
          </motion.div>

        </div>

        {/* Key Metrics Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((st, i) => (
            <motion.div
              key={st.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 text-center space-y-1 shadow-lg dark:shadow-xl backdrop-blur-md hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400">
                {st.value}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{st.label}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{st.desc}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

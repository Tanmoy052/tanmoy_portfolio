import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import {
  ArrowRight,
  Terminal,
  Sparkles,
  Code2,
  Github,
  Linkedin,
  Mail,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  Download,
  FileText,
} from "lucide-react";
import { PERSONAL_INFO } from "../data/portfolioData";

interface HeroProps {
  onOpenAITwin?: () => void;
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const roles = [
    "Full-Stack MERN Engineer",
    "React 19 & TypeScript Craftsman",
    "AI Integration Specialist",
    "UI/UX Architecture Designer",
  ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const rafRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const lastMouseRef = useRef<{ clientX: number; clientY: number } | null>(
    null,
  );
  const [isPointerEffectsEnabled, setIsPointerEffectsEnabled] = useState(false);

  // 3D Card Parallax Mouse Motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);
  const spotlightX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setIsPointerEffectsEnabled(finePointer && !reduceMotion);
    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPointerEffectsEnabled) return;
    lastMouseRef.current = { clientX: e.clientX, clientY: e.clientY };
    if (rafRef.current != null) return;
    const el = e.currentTarget;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      if (!lastMouseRef.current) return;

      const rect = el.getBoundingClientRect();
      const width = rect.width || 1;
      const height = rect.height || 1;
      const mouseX = lastMouseRef.current.clientX - rect.left;
      const mouseY = lastMouseRef.current.clientY - rect.top;

      x.set(mouseX / width - 0.5);
      y.set(mouseY / height - 0.5);
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const currentRole = roles[roleIndex];

    if (!isDeleting && displayText === currentRole) {
      const pauseTimer = window.setTimeout(() => setIsDeleting(true), 2200);
      return () => window.clearTimeout(pauseTimer);
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    const typingSpeed = isDeleting ? 35 : 75;
    const timer = window.setTimeout(() => {
      setDisplayText(
        isDeleting
          ? currentRole.substring(0, displayText.length - 1)
          : currentRole.substring(0, displayText.length + 1),
      );
    }, typingSpeed);

    return () => window.clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
    >
      {/* Background Animated Gradient Orbs & Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* High-Performance Ambient Glow Orbs */}
      <div className="hidden sm:block absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none transform-gpu" />
      <div className="hidden sm:block absolute top-1/3 right-1/4 w-[250px] sm:w-[380px] h-[250px] sm:h-[380px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none transform-gpu" />
      <div className="hidden sm:block absolute bottom-10 left-10 w-[200px] sm:w-[280px] h-[200px] sm:h-[280px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transform-gpu" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide text-emerald-600 dark:text-emerald-400">
                {PERSONAL_INFO.status}
              </span>
            </div>

            {/* Title Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1]">
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {PERSONAL_INFO.name}
              </span>
            </h1>

            {/* Dynamic Typewriter Title */}
            <div className="h-10 text-xl sm:text-2xl font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-center lg:justify-start">
              <span>{displayText}</span>
              <span className="ml-1 text-cyan-500 dark:text-cyan-400 animate-[blink_1s_step-end_infinite]">|</span>
            </div>

            {/* Bio */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {PERSONAL_INFO.bio}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
              <a
                href="#projects"
                id="hero-view-projects-btn"
                className="group relative flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-shadow overflow-hidden active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View My Work
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              <button
                onClick={onOpenResume}
                id="hero-download-resume-btn"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-slate-800 border border-slate-200 hover:border-emerald-500/50 hover:text-emerald-600 text-sm font-semibold transition-colors shadow-sm cursor-pointer active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                Download Resume
              </button>

              <a
                href="#contact"
                id="hero-contact-btn"
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white text-slate-700 border border-slate-200 hover:border-slate-300 text-sm font-mono transition-colors shadow-sm active:scale-[0.98]"
              >
                <Mail className="w-4 h-4 text-cyan-600" />
                Contact Me
              </a>
            </div>

            {/* Social Channels */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-slate-500 dark:text-slate-400">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Connect:
              </span>
              {[
                { href: PERSONAL_INFO.github, icon: Github, label: "GitHub" },
                { href: PERSONAL_INFO.linkedin, icon: Linkedin, label: "LinkedIn" },
                { href: `mailto:${PERSONAL_INFO.email}`, icon: Mail, label: "Email" },
              ].map((soc, i) => (
                <a
                  key={i}
                  href={soc.href}
                  target={soc.href.startsWith("mailto") ? "_self" : "_blank"}
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-sm transition-colors active:scale-95"
                  title={soc.label}
                >
                  <soc.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column - 3D Interactive Card (desktop only parallax) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 relative perspective-1000"
            onMouseMove={isPointerEffectsEnabled ? handleMouseMove : undefined}
            onMouseLeave={isPointerEffectsEnabled ? handleMouseLeave : undefined}
            ref={cardRef}
          >
            <motion.div
              style={{
                rotateX: isPointerEffectsEnabled ? rotateX : undefined,
                rotateY: isPointerEffectsEnabled ? rotateY : undefined,
                transformStyle: isPointerEffectsEnabled ? "preserve-3d" : "flat",
              }}
              className="relative mx-auto max-w-md lg:max-w-none rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden group"
            >
              {/* Spotlight: desktop-only, CSS-driven */}
              <div className="hidden lg:block pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" style={{ background: `radial-gradient(500px circle at 50% 50%, rgba(16,185,129,0.07), transparent 40%)` }} />

              {/* Terminal Window Header */}
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between relative z-20">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  tanmoy-developer.config.ts
                </div>
                <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  3D ACTIVE
                </div>
              </div>

              {/* Interactive Code Preview */}
              <div className="p-5 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-300 space-y-2 overflow-x-auto relative z-20">
                <div>
                  <span className="text-purple-600 dark:text-purple-400">
                    const
                  </span>{" "}
                  <span className="text-cyan-700 dark:text-cyan-300">
                    developer
                  </span>{" "}
                  = &#123;
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    name:
                  </span>{" "}
                  <span className="text-emerald-600 dark:text-emerald-300">
                    "{PERSONAL_INFO.name}"
                  </span>
                  ,
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    role:
                  </span>{" "}
                  <span className="text-emerald-600 dark:text-emerald-300">
                    "Full-Stack Engineer"
                  </span>
                  ,
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    stack:
                  </span>{" "}
                  [
                  <span className="text-amber-600 dark:text-amber-300">
                    "React 19"
                  </span>
                  ,{" "}
                  <span className="text-amber-600 dark:text-amber-300">
                    "Node.js"
                  </span>
                  ,{" "}
                  <span className="text-amber-600 dark:text-amber-300">
                    "TypeScript"
                  </span>
                  ,{" "}
                  <span className="text-amber-600 dark:text-amber-300">
                    "MongoDB"
                  </span>
                  ],
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    location:
                  </span>{" "}
                  <span className="text-emerald-600 dark:text-emerald-300">
                    "{PERSONAL_INFO.location}"
                  </span>
                  ,
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    availableForHire:
                  </span>{" "}
                  <span className="text-cyan-600 dark:text-cyan-400">true</span>
                  ,
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    codeQuality:
                  </span>{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    "99% Pure Architecture"
                  </span>
                </div>
                <div>&#125;;</div>
                <div className="pt-2 text-slate-500 flex items-center gap-1 text-xs">
                  <span className="text-emerald-500 dark:text-emerald-400">
                    ❯
                  </span>{" "}
                  developer.buildNextProject();
                </div>
              </div>

              {/* Stack Badges Footer */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center relative z-20">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/30 transition-colors">
                  <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                    MERN Engine
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/30 transition-colors">
                  <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                    REST APIs
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/30 transition-colors">
                  <Database className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                    MongoDB / SQL
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {PERSONAL_INFO.stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 transition-colors flex items-center gap-4 shadow-sm"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

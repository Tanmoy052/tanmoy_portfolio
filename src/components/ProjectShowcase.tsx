import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Eye,
  Star
} from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types';
import { ProjectDetailModal } from './ProjectDetailModal';

export const ProjectShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1); // 1 = Next (right to left), -1 = Prev (left to right)
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);

  const categories = ['All', 'Full-Stack MERN', 'AI Integration', 'E-Commerce', 'System Architecture'];

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory || p.tags.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase())));

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return PROJECTS.length;
    return PROJECTS.filter((p) => p.category === cat || p.tags.some(t => t.toLowerCase().includes(cat.toLowerCase()))).length;
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setDirection(1);
  };

  // Circular Queue Navigation Handlers
  const handleNext = () => {
    if (filteredProjects.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrev = () => {
    if (filteredProjects.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  // Touch swipe support for mobile devices without triggering re-renders on every pixel of move
  const touchStartRef = React.useRef<number | null>(null);
  const touchEndRef = React.useRef<number | null>(null);

  const minSwipeDistance = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartRef.current === null || touchEndRef.current === null) return;
    const distance = touchStartRef.current - touchEndRef.current;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };
  const getVisibleProjects = () => {
    const count = filteredProjects.length;
    if (count === 0) return [];
    
    const displayCount = Math.min(itemsPerPage, count);
    const visible = [];
    
    for (let i = 0; i < displayCount; i++) {
      const projectIndex = (currentIndex + i) % count;
      visible.push({
        project: filteredProjects[projectIndex],
        projectIndex,
        slot: i
      });
    }
    return visible;
  };

  const visibleProjects = getVisibleProjects();

  // Snappy, smooth & fast side-by-side transition variants
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 32 },
        opacity: { duration: 0.2, ease: 'easeOut' },
        scale: { duration: 0.2, ease: 'easeOut' },
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 420, damping: 35 },
        opacity: { duration: 0.15, ease: 'easeIn' },
        scale: { duration: 0.15 },
      }
    })
  };

  return (
    <section id="projects" className="py-24 bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative border-t border-slate-200 dark:border-slate-900 transition-colors duration-300 overflow-hidden">
      
      {/* Background Ambient Glows matching whole website theme */}
      <div className="hidden sm:block absolute top-1/3 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute bottom-10 right-10 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Increased Container Width from 7xl (1280px) to 1440px for roomier cards */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide uppercase"
          >
            <FolderGit2 className="w-3.5 h-3.5" /> Featured Engineering Projects
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Production Case Studies
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            Explore live web applications built with modern full-stack engineering, real-time communication, and responsive designs.
          </motion.p>
        </div>



        {/* Circular Queue Carousel Viewport */}
        <div 
          className="relative px-2 sm:px-6 select-none touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* Left Navigation Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Projects"
            className="absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-6 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-colors flex items-center justify-center group"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </button>

          {/* Side-by-Side Cards Grid with Advanced Staggered Wave Transition */}
          <div className="overflow-hidden py-4 px-1 min-h-[500px] sm:min-h-[540px] flex items-center justify-center">
            {visibleProjects.length > 0 ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                <AnimatePresence mode="popLayout" custom={direction}>
                  {visibleProjects.map(({ project, slot }) => (
                    <motion.div
                      key={`${project.id}-at-${currentIndex}-slot-${slot}`}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="flex flex-col h-full w-full"
                    >
                      <ProjectCard
                        project={project}
                        onInspect={() => setActiveModalProject(project)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                No projects found in this category.
              </div>
            )}
          </div>

          {/* Right Navigation Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next Projects"
            className="absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-6 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-colors flex items-center justify-center group"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </button>

        </div>

        {/* Circular Queue Pagination Dots at Bottom */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {filteredProjects.map((_, pIdx) => {
            const isActive = pIdx === currentIndex;
            return (
              <button
                key={pIdx}
                onClick={() => {
                  setDirection(pIdx >= currentIndex ? 1 : -1);
                  setCurrentIndex(pIdx);
                }}
                aria-label={`Go to project ${pIdx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isActive 
                    ? 'w-9 h-2.5 bg-blue-600 dark:bg-blue-500 shadow-xs' 
                    : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
              />
            );
          })}
        </div>

      </div>

      {/* Project Detail Modal */}
      {activeModalProject && (
        <ProjectDetailModal
          project={activeModalProject}
          isOpen={!!activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}

    </section>
  );
};

/* Individual Project Card matching theme */
interface ProjectCardProps {
  project: Project;
  onInspect: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onInspect }) => {
  return (
    <motion.div 
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="group bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between h-full w-full"
    >
      <div className="flex flex-col flex-1">
        {/* Top Browser Bar & Image Banner */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 flex flex-col shrink-0">
          
          {/* Top Decorative Browser Header Bar */}
          <div className="h-7 w-full bg-slate-200/80 dark:bg-slate-900 border-b border-slate-300/50 dark:border-slate-800/80 px-3.5 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
              {project.title.toLowerCase().replace(/[^a-z0-0]/g, '')}.app
            </span>
            <div className="w-10" />
          </div>

          {/* Image Container */}
          <div className="relative flex-1 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/30 transition-colors duration-300" />

            {/* Quick Action Overlay Buttons on Image Hover */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-slate-950/40">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all"
                title="View Source Code on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all"
                title="Open Live Application"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-3 left-3 z-10">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/90 text-[11px] font-bold text-slate-950 shadow-sm">
                  <Star className="w-3 h-3 fill-slate-950 text-slate-950" /> Featured
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card Content Body with Fixed Heights for 100% Uniform Card Sizes */}
        <div className="p-6 space-y-4 flex flex-col flex-1 justify-between">
          
          <div className="space-y-3">
            {/* Tech Stack Pills - Reserved Fixed Container Height so wrapping doesn't shift card height */}
            <div className="min-h-[3.25rem] flex flex-wrap items-start content-start gap-1.5 overflow-hidden">
              {project.tags.slice(0, 4).map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Project Title - Reserved Fixed Height (2 lines max) */}
            <div className="min-h-[3.5rem] flex items-center">
              <h3 
                onClick={onInspect}
                className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer leading-snug line-clamp-2"
              >
                {project.title}
              </h3>
            </div>
          </div>

          {/* Short Description - Reserved Fixed Height (3 lines max) */}
          <div className="min-h-[4.25rem] flex items-start">
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-normal">
              {project.shortDescription}
            </p>
          </div>

        </div>
      </div>

      {/* Card Footer Link */}
      <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 mt-2 shrink-0">
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 transition-all group-hover:translate-x-1 pt-4"
        >
          Live Demo <ArrowRight className="w-4 h-4" />
        </a>

        <button
          onClick={onInspect}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 mt-4"
        >
          <Eye className="w-3.5 h-3.5" /> Inspect
        </button>
      </div>

    </motion.div>
  );
};

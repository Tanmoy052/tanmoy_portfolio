import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for outer ring
  const springConfig = { damping: 28, stiffness: 250, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable on touch devices, mobile screens, or reduced motion
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileWidth = window.innerWidth < 768;
    const hasTouchScreen = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

    if (!finePointer || reduceMotion || isMobileWidth || hasTouchScreen) {
      setIsTouchDevice(true);
      return;
    }

    let rafMove: number | null = null;
    let rafHover: number | null = null;
    let lastX = -100;
    let lastY = -100;
    let lastHoverTarget: EventTarget | null = null;
    let pendingHoverTarget: EventTarget | null = null;

    const flushMove = () => {
      rafMove = null;
      cursorX.set(lastX);
      cursorY.set(lastY);
      setIsVisible((prev) => (prev ? prev : true));
    };

    const moveCursor = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafMove != null) return;
      rafMove = window.requestAnimationFrame(flushMove);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track interactive hover targets efficiently
    const flushHover = () => {
      rafHover = null;
      const target = pendingHoverTarget as HTMLElement | null;
      if (!target) return;
      const nextHovered = !!(
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[role="button"]') ||
        target.closest('.group')
      );
      setIsHovered((prev) => (prev === nextHovered ? prev : nextHovered));
    };

    const handleOver = (e: PointerEvent) => {
      if (e.target === lastHoverTarget) return;
      lastHoverTarget = e.target;
      pendingHoverTarget = e.target;
      if (rafHover != null) return;
      rafHover = window.requestAnimationFrame(flushHover);
    };

    window.addEventListener('pointermove', moveCursor, { passive: true });
    window.addEventListener('pointerdown', handleMouseDown, { passive: true });
    window.addEventListener('pointerup', handleMouseUp, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    window.addEventListener('pointerover', handleOver, { passive: true });

    return () => {
      if (rafMove != null) window.cancelAnimationFrame(rafMove);
      if (rafHover != null) window.cancelAnimationFrame(rafHover);
      window.removeEventListener('pointermove', moveCursor);
      window.removeEventListener('pointerdown', handleMouseDown);
      window.removeEventListener('pointerup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('pointerover', handleOver);
    };
  }, [cursorX, cursorY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer Glow Ring */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isClicking ? 0.75 : isHovered ? 1.6 : 1,
          opacity: isHovered ? 0.85 : 0.4
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 border border-emerald-400/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.25)] transform-gpu will-change-transform"
      />

      {/* Inner Precision Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isClicking ? 0.5 : isHovered ? 1.3 : 1
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-50 bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)] transform-gpu will-change-transform"
      />
    </>
  );
};

'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 400, damping: 40, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches);
    const listener = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as HTMLElement)?.closest('[data-cursor]');
      setLabel(target ? target.getAttribute('data-cursor') : null);
    };
    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] flex items-center justify-center"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.div
        animate={{
          width: label ? 72 : 8,
          height: label ? 72 : 8,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center rounded-full border border-brass/70 bg-ink/40 backdrop-blur-sm"
      >
        {label ? (
          <span className="font-sans text-[10px] uppercase tracking-widest text-ink-50">
            {label}
          </span>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-brass" />
        )}
      </motion.div>
    </motion.div>
  );
}

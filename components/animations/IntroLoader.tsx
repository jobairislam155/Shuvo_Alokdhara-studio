'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';

const STEPS = ['01', '02', '03'];

export function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('intro-seen')) {
      setVisible(false);
      return;
    }

    if (prefersReduced) {
      setVisible(false);
      sessionStorage.setItem('intro-seen', '1');
      return;
    }

    const stepTimer = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 220);

    const done = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('intro-seen', '1');
    }, 950);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(done);
    };
  }, [prefersReduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-ink"
        >
          <BrandLogo variant="full" priority className="h-auto w-[min(78vw,400px)]" />
          <div className="flex items-center gap-3 font-sans text-xs tracking-widest text-ink-100">
            {STEPS.map((s, i) => (
              <span key={s} className={i <= step ? 'text-brass' : ''}>
                {s}
                {i < STEPS.length - 1 && <span className="ml-3 text-ink-300">—</span>}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

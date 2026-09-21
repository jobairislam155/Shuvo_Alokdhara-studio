'use client';

import { motion, useInView } from 'framer-motion';
import { ElementType, ReactNode, useRef } from 'react';

interface RevealTextProps {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  once?: boolean;
}

export function RevealText({
  children,
  as: Tag = 'div',
  delay = 0,
  className,
  once = true,
}: RevealTextProps) {
  // Observe the fixed, clipping wrapper — not the text that slides up.
  // The text starts fully below the wrapper's overflow edge, so observing
  // the text itself never reports "in view" and the title would stay hidden.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-10% 0px' });

  return (
    <div ref={ref} className="-mb-[0.15em] overflow-hidden pb-[0.15em]">
      <motion.div
        initial={{ y: '110%' }}
        animate={{ y: inView ? '0%' : '110%' }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    </div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className,
  y = 16,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

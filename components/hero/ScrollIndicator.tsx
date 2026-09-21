'use client';

import { motion } from 'framer-motion';

export function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
    >
      <span className="font-sans text-[10px] uppercase tracking-widest text-ink-100">Scroll</span>
      <motion.span
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="h-8 w-px bg-gradient-to-b from-brass to-transparent"
      />
    </motion.div>
  );
}

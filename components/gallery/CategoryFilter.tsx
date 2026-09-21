'use client';

import { cn } from '@/lib/utils/cn';

interface CategoryFilterProps {
  categories: readonly { label: string; value: string }[];
  active: string;
  onChange: (value: string) => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="no-scrollbar flex gap-8 overflow-x-auto border-b border-ink-400 pb-px">
      {categories.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          aria-pressed={active === c.value}
          className={cn(
            'relative shrink-0 whitespace-nowrap pb-4 font-sans text-xs uppercase tracking-widest transition-colors',
            active === c.value ? 'text-ink-50' : 'text-ink-100 hover:text-ink-50',
          )}
        >
          {c.label}
          {active === c.value && (
            <span className="absolute inset-x-0 -bottom-px h-px bg-brass" aria-hidden />
          )}
        </button>
      ))}
    </div>
  );
}

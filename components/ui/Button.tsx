import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface BaseProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

const base =
  'inline-flex items-center justify-center gap-3 whitespace-nowrap font-sans text-xs tracking-widest uppercase transition-colors duration-300 ease-cinematic disabled:opacity-40 disabled:pointer-events-none';

const sizes = {
  sm: 'px-5 py-2.5',
  md: 'px-7 py-3.5',
};

const variants = {
  solid: 'bg-ink-50 text-ink border border-ink-50 hover:bg-transparent hover:text-ink-50',
  outline: 'border border-ink-50/40 text-ink-50 hover:border-ink-50 hover:bg-ink-50/5',
  ghost: 'text-ink-50 hover:text-brass',
};

export function Button({
  variant = 'outline',
  size = 'md',
  className,
  children,
  ...props
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = 'outline',
  size = 'md',
  className,
  children,
}: BaseProps & { href: string }) {
  return (
    <Link href={href} className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </Link>
  );
}

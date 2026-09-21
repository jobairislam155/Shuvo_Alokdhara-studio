import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Every shade below reads from a CSS variable (see app/globals.css),
        // so switching [data-theme] on <html> re-themes the whole site
        // without touching a single component. The `<alpha-value>` token
        // is required for Tailwind's opacity modifiers (bg-ink/40, etc.)
        // to keep working.
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          50: 'rgb(var(--ink-50) / <alpha-value>)',
          100: 'rgb(var(--ink-100) / <alpha-value>)',
          200: 'rgb(var(--ink-200) / <alpha-value>)',
          300: 'rgb(var(--ink-300) / <alpha-value>)',
          400: 'rgb(var(--ink-400) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
          600: 'rgb(var(--ink) / <alpha-value>)',
        },
        brass: {
          DEFAULT: 'rgb(var(--brass) / <alpha-value>)',
          light: 'rgb(var(--brass-light) / <alpha-value>)',
          dim: 'rgb(var(--brass-dim) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
          hover: 'rgb(var(--danger-hover) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['clamp(3.5rem, 9vw, 9rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-2': ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
        'display-3': ['clamp(1.75rem, 3.5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        widest: '0.28em',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        content: '1600px',
      },
    },
  },
  plugins: [],
};

export default config;

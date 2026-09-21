'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils/cn';
import type { SlidePhoto } from '@/lib/utils/slideshow';

const FADE_MS = 1400;

interface SlideshowBackdropProps {
  photos: SlidePhoto[];
  /** Time each photo stays on screen, in ms. */
  interval?: number;
  /** "hero" fills the home page; "banner" sits behind an inner-page title. */
  variant?: 'hero' | 'banner';
}

/**
 * Full-bleed photo slideshow that fills its nearest `relative` parent.
 *
 * - Crossfades one photo at a time, with a slow zoom on the active photo.
 * - Advancing is driven by the progress bar's CSS animation, so pausing
 *   (hover/focus on the controls, or the pause button) freezes the timer,
 *   the zoom and the bar together and they always stay in sync.
 * - Only the current, previous and neighbouring photos are mounted, so a
 *   large portfolio doesn't load every image at once.
 * - Swipe left/right on touch screens.
 * - With "reduce motion" on, it never auto-advances; controls still work.
 */
export function SlideshowBackdrop({ photos, interval = 6000, variant = 'hero' }: SlideshowBackdropProps) {
  const count = photos.length;
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [{ index, previous }, setPos] = useState({ index: 0, previous: -1 });
  const [userPaused, setUserPaused] = useState(false);
  const [holding, setHolding] = useState(false);

  const step = useCallback(
    (dir: 1 | -1) =>
      setPos((p) => ({ index: (p.index + dir + count) % count, previous: p.index })),
    [count],
  );

  // Swipe support — listeners go on the parent section, because page
  // content sits on top of this layer and would otherwise swallow touches.
  useEffect(() => {
    const target = rootRef.current?.parentElement;
    if (!target || count < 2) return;
    let x0 = 0;
    let y0 = 0;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      x0 = t.clientX;
      y0 = t.clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - x0;
      const dy = t.clientY - y0;
      if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    };
    target.addEventListener('touchstart', onStart, { passive: true });
    target.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      target.removeEventListener('touchstart', onStart);
      target.removeEventListener('touchend', onEnd);
    };
  }, [count, step]);

  if (count === 0) return null;

  const paused = userPaused || holding;
  const autoplay = count > 1 && !reduced;
  const mounted = new Set([index, previous, (index + 1) % count, (index - 1 + count) % count]);
  const current = photos[index] ?? photos[0]!;

  return (
    <div
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Photography slideshow"
      className={cn('absolute inset-0', paused && 'slide-paused')}
      style={
        {
          '--slide-interval': `${interval}ms`,
          '--slide-zoom-duration': `${interval + FADE_MS * 2}ms`,
        } as CSSProperties
      }
    >
      {/* Photos */}
      <div className="absolute inset-0 overflow-hidden bg-ink">
        {photos.map((photo, i) => {
          if (!mounted.has(i)) return null;
          const active = i === index;
          return (
            <div
              key={photo.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              className="absolute inset-0 transition-opacity ease-in-out"
              style={{ opacity: active ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
            >
              <SmartImage
                src={photo.src}
                alt={active ? photo.alt : ''}
                fill
                priority={i === 0}
                sizes="100vw"
                className={cn(
                  'object-cover',
                  (active || i === previous) && !reduced && 'slide-zoom',
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Legibility overlays */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t',
          variant === 'hero' ? 'from-ink via-ink/25 to-ink/35' : 'from-ink via-ink/40 to-ink/40',
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />

      {/* Controls */}
      {count > 1 && (
        <div
          className="absolute inset-x-0 bottom-0 z-20 pb-5 md:pb-8"
          onMouseEnter={() => setHolding(true)}
          onMouseLeave={() => setHolding(false)}
          onFocus={() => setHolding(true)}
          onBlur={() => setHolding(false)}
        >
          <Container className="flex justify-end">
            <div className="flex flex-col items-end gap-3">
              <Link
                href={`/projects/${current.slug}`}
                data-cursor="OPEN"
                className="link-underline hidden max-w-[320px] truncate font-sans text-xs text-ink-50/90 md:block"
              >
                {current.title}
              </Link>

              <div className="flex items-center gap-3 text-ink-50">
                <ControlButton label="Previous photo" onClick={() => step(-1)}>
                  <ChevronLeft size={18} />
                </ControlButton>

                <div className="flex w-24 flex-col items-center gap-2" aria-live="off">
                  <span className="font-sans text-xs tabular-nums tracking-widest text-ink-50">
                    {String(index + 1).padStart(2, '0')}
                    <span className="text-ink-50/50"> / {String(count).padStart(2, '0')}</span>
                  </span>
                  <span className="relative block h-px w-full overflow-hidden bg-ink-50/25">
                    {autoplay && (
                      <span
                        key={index}
                        onAnimationEnd={() => step(1)}
                        className="slide-progress absolute inset-0 bg-brass"
                      />
                    )}
                  </span>
                </div>

                <ControlButton label="Next photo" onClick={() => step(1)}>
                  <ChevronRight size={18} />
                </ControlButton>

                {autoplay && (
                  <ControlButton
                    label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
                    onClick={() => setUserPaused((v) => !v)}
                  >
                    {userPaused ? <Play size={14} /> : <Pause size={14} />}
                  </ControlButton>
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center border border-ink-50/30 text-ink-50 backdrop-blur-sm transition-colors duration-300 hover:border-brass hover:bg-brass hover:text-ink"
    >
      {children}
    </button>
  );
}

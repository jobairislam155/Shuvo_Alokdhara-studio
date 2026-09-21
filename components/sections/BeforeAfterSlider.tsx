'use client';

import { useCallback, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';
import { duotonePlate } from '@/lib/data/placeholder-art';
import { cldImage, isCloudinaryConfigured } from '@/lib/cloudinary';

/** Cloudinary public ID of the photo shown in the comparison. */
const BEFORE_AFTER_PUBLIC_ID = 'pexels-upenderphotography-37602134';

const size = { width: 1600, height: 1000 } as const;

// One photo, two looks: "before" is the flat, muted capture; "after" is the graded result.
const before = isCloudinaryConfigured
  ? cldImage(BEFORE_AFTER_PUBLIC_ID, { ...size, effects: 'e_saturation:-70,e_contrast:-30,e_brightness:8' })
  : duotonePlate('before-edit', ['#232019', '#948B7E'], 'Before', 'Raw capture');
const after = isCloudinaryConfigured
  ? cldImage(BEFORE_AFTER_PUBLIC_ID, { ...size, effects: 'e_vibrance:35,e_contrast:18' })
  : duotonePlate('after-edit', ['#241d15', '#c9a15a'], 'After', 'Final grade');

export function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <section className="bg-ink section-y">
      <Container>
        <SectionHeading
          title="Before / After"
          description="A look at the editing process — drag the divider to compare."
          className="mb-8"
        />

        <div
          ref={containerRef}
          className="relative aspect-[4/3] w-full max-w-3xl touch-none select-none overflow-hidden md:aspect-[16/9]"
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            updateFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (dragging.current) updateFromClientX(e.clientX);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
        >
          <SmartImage src={after} alt="Final edited photograph" fill className="object-cover" />
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <SmartImage src={before} alt="Unedited raw photograph" fill className="object-cover" />
          </div>

          <span className="pointer-events-none absolute left-3 top-3 bg-ink/70 px-2.5 py-1 font-sans text-[10px] uppercase tracking-widest text-ink-50 backdrop-blur-sm">
            Before
          </span>
          <span className="pointer-events-none absolute right-3 top-3 bg-ink/70 px-2.5 py-1 font-sans text-[10px] uppercase tracking-widest text-ink-50 backdrop-blur-sm">
            After
          </span>

          <div
            className="pointer-events-none absolute inset-y-0 flex w-px -translate-x-1/2 items-center bg-brass"
            style={{ left: `${position}%` }}
          >
            <span className="flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-brass bg-ink font-sans text-[10px] tracking-widest text-brass">
              ↔
            </span>
          </div>

          <label className="sr-only" htmlFor="before-after-range">
            Compare before and after
          </label>
          <input
            id="before-after-range"
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="absolute inset-x-0 bottom-3 mx-auto w-[90%] accent-brass"
          />
        </div>
      </Container>
    </section>
  );
}

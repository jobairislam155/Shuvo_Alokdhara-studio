'use client';

import { useMemo, useState } from 'react';
import { FilmReel } from '@/types';
import { CategoryFilter } from '@/components/gallery/CategoryFilter';
import { VideoPlayer } from './VideoPlayer';
import { posterFor } from '@/lib/data/reels';

const videoCategories = [
  { label: 'All', value: 'all' },
  { label: 'Wedding Films', value: 'wedding' },
  { label: 'Commercial Films', value: 'commercial' },
  { label: 'Short Films', value: 'short' },
  { label: 'Event Films', value: 'event' },
  { label: 'Social Reels', value: 'social' },
] as const;

export function VideographyClient({ reels }: { reels: FilmReel[] }) {
  const [category, setCategory] = useState('all');

  const filtered = useMemo(
    () => (category === 'all' ? reels : reels.filter((r) => r.category === category)),
    [reels, category],
  );

  return (
    <div>
      <CategoryFilter categories={videoCategories} active={category} onChange={setCategory} />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((reel) => (
          <div key={reel.id}>
            <VideoPlayer title={reel.title} poster={posterFor(reel)} videoUrl={reel.video_url || undefined} />
            <p className="mt-3 font-sans text-xs uppercase tracking-widest text-ink-200">
              {reel.category} — {reel.year}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

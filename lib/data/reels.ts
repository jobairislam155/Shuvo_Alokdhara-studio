import { FilmReel } from '@/types';

import { duotonePlate } from './placeholder-art';
import { cldVideo } from '@/lib/cloudinary';

interface Seed {
  title: string;
  category: FilmReel['category'];
  year: number;
  tone: [string, string];
  video_url: string;
}

const seeds: Seed[] = [
  {
    title: 'Anika & Rafi — Feature Film',
    category: 'wedding',
    year: 2026,
    tone: ['#2b241c', '#c9a15a'],
    video_url: cldVideo('samples/dance-2'),
  },
  {
    title: 'Anthem Goods — Launch Film',
    category: 'commercial',
    year: 2025,
    tone: ['#12181a', '#5fa3a0'],
    video_url: cldVideo('samples/dance-2'),
  },
  {
    title: 'The Long Way Home',
    category: 'short',
    year: 2024,
    tone: ['#1d1a12', '#d1a24a'],
    video_url: cldVideo('samples/dance-2'),
  },
  {
    title: 'Horizon Summit — Recap',
    category: 'event',
    year: 2025,
    tone: ['#1a1a1a', '#c98a3a'],
    video_url: cldVideo('samples/dance-2'),
  },
  {
    title: 'Meherun & Tanvir — Highlights',
    category: 'wedding',
    year: 2025,
    tone: ['#241d15', '#c9a15a'],
    video_url: cldVideo('samples/dance-2'),
  },
  {
    title: 'Shoreline Resorts — Reel',
    category: 'social',
    year: 2026,
    tone: ['#12181a', '#5fa3a0'],
    video_url: cldVideo('samples/elephants'),
  },
];

export const reels: FilmReel[] = seeds.map((seed, index) => ({
  id: String(index + 1),
  title: seed.title,
  category: seed.category,
  video_url: seed.video_url,
  poster_tone: seed.tone,
  year: seed.year,
}));

export function posterFor(reel: FilmReel): string {
  if (reel.poster_url) return reel.poster_url;
  return duotonePlate(
    reel.title,
    reel.poster_tone ?? ['#161410', '#B08D57'],
    reel.title.split(' — ')[0] ?? reel.title
  );
}
/**
 * Until real photography is uploaded through Cloudinary, every "cover_image"
 * in the demo data is one of these generated duotone plates rather than a
 * stock photo — so the site never pretends to show real client work.
 * Swap any cover_image / media_url for a Cloudinary URL and this is never used.
 */

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function duotonePlate(
  seedKey: string,
  tone: [string, string],
  label: string,
  sublabel?: string,
): string {
  const seed = hashSeed(seedKey);
  const angle = 20 + (seed % 50);
  const cx = 30 + (seed % 40);
  const cy = 20 + ((seed >> 3) % 60);
  const [a, b] = tone;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="g-${seed}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="${a}" />
      <stop offset="100%" stop-color="${b}" />
    </linearGradient>
    <radialGradient id="r-${seed}" cx="${cx}%" cy="${cy}%" r="75%">
      <stop offset="0%" stop-color="${b}" stop-opacity="0.55" />
      <stop offset="100%" stop-color="${a}" stop-opacity="0" />
    </radialGradient>
    <filter id="grain-${seed}">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise"/>
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"/>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
  </defs>
  <rect width="800" height="1000" fill="url(#g-${seed})" />
  <rect width="800" height="1000" fill="url(#r-${seed})" />
  <rect width="800" height="1000" filter="url(#grain-${seed})" opacity="0.5" />
  <line x1="60" y1="900" x2="140" y2="900" stroke="${a}" stroke-opacity="0.9" stroke-width="1.5" />
  <text x="60" y="935" font-family="Georgia, serif" font-size="30" fill="${a}" fill-opacity="0.92">${escapeXml(
    label,
  )}</text>
  ${
    sublabel
      ? `<text x="60" y="962" font-family="Helvetica, Arial, sans-serif" font-size="14" letter-spacing="2" fill="${a}" fill-opacity="0.7">${escapeXml(
          sublabel.toUpperCase(),
        )}</text>`
      : ''
  }
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const categoryTones: Record<string, [string, string]> = {
  wedding: ['#2b241c', '#c9a15a'],
  portrait: ['#1c1f22', '#8a97a3'],
  fashion: ['#221820', '#a8657a'],
  events: ['#1a1a1a', '#c98a3a'],
  commercial: ['#12181a', '#5fa3a0'],
  travel: ['#1d1a12', '#d1a24a'],
};

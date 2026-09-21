// The cloud name is public (it appears in every image URL). The fallback keeps
// photos working on Vercel even if the env var was never added there, since
// .env.local is git-ignored and does not get pushed to GitHub.
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'ak6gupc4';

export const isCloudinaryConfigured = Boolean(CLOUD_NAME);

type ImageOptions = {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  gravity?: 'auto' | 'face' | 'center';
  quality?: 'auto' | number;
  /** Extra Cloudinary transformations, e.g. 'e_saturation:-60,e_contrast:-20'. */
  effects?: string;
};

/**
 * Builds an optimized Cloudinary delivery URL for a given public ID.
 * If `source` is already a full URL (e.g. an http(s) URL or a data: URI
 * used by the bundled placeholder art), it is returned unchanged so the
 * same helper works before and after Cloudinary is connected.
 */
export function cldImage(source: string, opts: ImageOptions = {}): string {
  if (!CLOUD_NAME || /^(https?:|data:|blob:)/.test(source)) return source;

  const { width, height, crop = 'fill', gravity = 'auto', quality = 'auto', effects } = opts;
  const transforms = [
    'f_auto',
    `q_${quality}`,
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
    width || height ? `c_${crop}` : null,
    (width || height) && crop === 'fill' ? `g_${gravity}` : null,
    effects || null,
  ]
    .filter(Boolean)
    .join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${source}`;
}

type VideoOptions = {
  width?: number;
  quality?: 'auto' | number;
};

export function cldVideo(source: string, opts: VideoOptions = {}): string {
  if (!CLOUD_NAME || /^(https?:|blob:)/.test(source)) return source;
  const { width, quality = 'auto' } = opts;
  const transforms = ['f_auto', `q_${quality}`, width ? `w_${width}` : null].filter(Boolean).join(',');
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transforms}/${source}`;
}

/** Auto-generated poster frame for a Cloudinary-hosted video. */
export function cldVideoPoster(source: string): string {
  if (!CLOUD_NAME || /^(https?:|data:|blob:)/.test(source)) return source;
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto,so_0/${source}.jpg`;
}
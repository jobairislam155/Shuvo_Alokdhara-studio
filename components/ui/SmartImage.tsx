import Image, { ImageProps } from 'next/image';

type SmartImageProps = Omit<ImageProps, 'src'> & { src: string };

/**
 * The demo content ships as inline data: URI placeholder art (see
 * lib/data/placeholder-art.ts) so the site never pretends to show real
 * client photography before Cloudinary is connected. next/image's
 * optimizer is built for remote/static sources, so data: URIs render
 * through a plain <img> instead — swap any cover_image / media_url for a
 * real Cloudinary URL and this automatically uses the optimized path.
 */
export function SmartImage({ src, alt, className, fill, priority, sizes, ...props }: SmartImageProps) {
  if (src.startsWith('data:')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className={className}
        style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : undefined}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes ?? '100vw'}
      className={className}
      {...props}
    />
  );
}

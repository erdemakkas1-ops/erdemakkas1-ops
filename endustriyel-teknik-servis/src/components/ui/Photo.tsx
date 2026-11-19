import type { CSSProperties } from 'react';
import { assetPath } from '@/data/visuals';
import type { MediaSlot } from '@/data/media';

/**
 * AVIF + WebP fotoğraf. Açılış görseli için priority (eager + fetchpriority=high), diğerleri lazy.
 * Boyut kapsayıcıdan gelir (object-cover); width/height oranı CLS'yi önler.
 */
export function Photo({
  m,
  priority = false,
  className = '',
  style,
  sizes = '100vw',
}: {
  m: MediaSlot;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={assetPath(`${m.file}.avif`)} sizes={sizes} />
      <img
        src={assetPath(`${m.file}.webp`)}
        alt={m.alt}
        width={m.width}
        height={m.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={`h-full w-full object-cover ${className}`}
        style={{ objectPosition: m.position, ...style }}
      />
    </picture>
  );
}

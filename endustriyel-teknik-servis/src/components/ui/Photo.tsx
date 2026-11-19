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
  // Duyarlı set: <file>-<genişlik>.avif/.webp (scripts/optimize-images.py); yoksa tek dosya <file>.avif/.webp
  const set = (ext: string) =>
    m.widths ? m.widths.map((w) => `${assetPath(`${m.file}-${w}.${ext}`)} ${w}w`).join(', ') : assetPath(`${m.file}.${ext}`);
  const fallback = m.widths ? `${m.file}-${m.widths[Math.min(1, m.widths.length - 1)]}.webp` : `${m.file}.webp`;
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={assetPath(fallback)}
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

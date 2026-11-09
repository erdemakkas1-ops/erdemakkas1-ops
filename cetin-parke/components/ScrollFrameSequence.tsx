'use client';

import { useEffect, useRef, useState } from 'react';
import { MEDIA_VERSION } from '@/lib/media';

type Props = {
  folder: string;
  count: number;
  poster: string;
  progress: number;
  className?: string;
  label?: string;
  reducedMotion?: boolean;
};

/**
 * No playback clock: the frame is a pure function of user scroll position.
 * The component never calls play(), setInterval(), or autonomous animation.
 * Missing frames fall back to the nearest loaded frame or the poster.
 */
export function ScrollFrameSequence({folder, count, poster, progress, className = '', label = '', reducedMotion = false}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const indexRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const target = reducedMotion ? count - 1 : Math.max(0, Math.min(count - 1, Math.round(progress * (count - 1))));
  indexRef.current = target;

  useEffect(() => {
    let disposed = false;
    const cache = cacheRef.current;
    cache.clear();
    setLoaded(false);

    const draw = (image: HTMLImageElement) => {
      const surface = canvasRef.current;
      if (!surface || !image.naturalWidth || !image.naturalHeight || disposed) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      const width = Math.min(Math.max(1, Math.round(surface.clientWidth * ratio)), 1920);
      const height = Math.min(Math.max(1, Math.round(surface.clientHeight * ratio)), 1080);
      if (surface.width !== width || surface.height !== height) {
        surface.width = width;
        surface.height = height;
      }
      const context = surface.getContext('2d', {alpha: false});
      if (!context) return;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const imageWidth = image.naturalWidth * scale;
      const imageHeight = image.naturalHeight * scale;
      context.drawImage(image, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);
      setLoaded(true);
    };

    const closestAvailable = (requested: number) => {
      let nearest: HTMLImageElement | undefined;
      let best = Infinity;
      for (const [key, frame] of cache) {
        const delta = Math.abs(key - requested);
        if (frame.naturalWidth > 0 && delta < best) { nearest = frame; best = delta; }
      }
      return nearest;
    };

    const framePath = (n: number) => `${folder}/${String(n + 1).padStart(4, '0')}.webp?v=${MEDIA_VERSION}`;
    const fetchFrame = (n: number) => {
      if (n < 0 || n >= count || cache.has(n)) return;
      const img = new Image();
      cache.set(n,img);
      img.decoding = 'async';
      img.onload = () => {
        if (disposed) return;
        // Draw a frame only when it corresponds to the current scroll position,
        // or when this is the first available image (avoid revealing blank canvas).
        if (n === indexRef.current || !Array.from(cache.values()).some(item => item !== img && item.naturalWidth > 0)) {
          draw(img);
        }
      };
      img.onerror = () => { cache.delete(n); };
      img.src = framePath(n);
    };

    const render = (n: number) => {
      const exact = cache.get(n);
      const image = exact?.naturalWidth ? exact : closestAvailable(n);
      if (image) draw(image);
      fetchFrame(n);
      // Small bidirectional window keeps memory and downloads bounded.
      for (let offset = -6; offset <= 6; offset++) if (offset) fetchFrame(n + offset);
      // Cull loaded frames after scroll jumps; browser HTTP cache can restore them.
      for (const key of cache.keys()) if (key !== 0 && Math.abs(key-n) > 24) cache.delete(key);
    };

    // Keep function available to scroll/resize effect without recreating image loads.
    controllerRef.current = render;
    fetchFrame(0);
    render(indexRef.current);
    const observer = new ResizeObserver(() => render(indexRef.current));
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => {
      disposed = true;
      observer.disconnect();
      controllerRef.current = null;
      cache.clear();
    };
  }, [folder, count]);

  const controllerRef = useRef<((n: number) => void) | null>(null);
  useEffect(() => {controllerRef.current?.(target);}, [target]);

  return <div className={`cinema-media ${className}`} role="img" aria-label={label}>
    <div className="cinema-fallback" style={{backgroundImage:`linear-gradient(90deg,rgba(9,12,10,.22),rgba(9,12,10,.04)),url('${poster}')`}} />
    <canvas ref={canvasRef} aria-hidden="true" className={`cinema-canvas${loaded ? ' visible' : ''}`} />
  </div>;
}

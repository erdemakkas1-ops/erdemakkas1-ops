'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';
import { story, filmT, markReady, lerp, smoothstep } from '@/lib/story';

/**
 * Scroll-scrubbed film: one continuous take of the same room (Gemini keyframes K0–K3, Higgsfield clips between
 * them), exported as a frame sequence by scripts/build_film.sh. Every scroll position maps to exactly one
 * frame, so the room builds up and rewinds frame-accurately — no cross-fades between unrelated images.
 *
 * Loading is progressive: the empty room first, then a coarse pass over the whole film, then the gaps.
 * Until a frame arrives, the nearest downloaded frame is shown.
 */

type Manifest = { count: number; fps: number };

/** phones: the film is shown as a zoomed band that pans to where the room is changing */
const PAN: [number, number][] = [
  [0, 0],
  [0.06, 0],
  [0.12, -0.16], // parquet + walnut slats (left)
  [0.26, 0.17], // travertine wall (right)
  [0.36, 0.05],
  [0.44, 0.17], // TV console + TV
  [0.52, -0.15], // sofa
  [0.62, 0],
  [0.72, -0.12], // rug, throw, olive tree
  [0.86, 0.08], // curtains, pendant, decor
  [0.94, 0],
  [1, 0],
];
function pan(p: number) {
  for (let i = 0; i < PAN.length - 1; i++) {
    const [a, va] = PAN[i];
    const [b, vb] = PAN[i + 1];
    if (p <= b) return lerp(va, vb, smoothstep(a, b, p));
  }
  return 0;
}

export default function FilmScrub() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext('2d', { alpha: false })!;
    const small = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches;
    const base = asset(small ? '/film/m/' : '/film/');
    const frames: (HTMLImageElement | null)[] = [];
    let count = 0;
    let loaded = 0;
    let cancelled = false;
    let raf = 0;
    let lastKey = '';
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = cv.clientWidth;
      height = cv.clientHeight;
      cv.width = Math.round(width * dpr);
      cv.height = Math.round(height * dpr);
      lastKey = '';
    };

    const nearest = (i: number) => {
      if (frames[i]) return frames[i];
      for (let d = 1; d < count; d++) {
        if (i - d >= 0 && frames[i - d]) return frames[i - d];
        if (i + d < count && frames[i + d]) return frames[i + d];
      }
      return null;
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!count) return;
      const p = story.p;
      const idx = Math.round(filmT(p) * (count - 1));
      const img = nearest(idx);
      if (!img) return;
      const portrait = width / height < 0.9;
      const px = portrait ? pan(p) : 0;
      const key = `${img.src}|${cv.width}x${cv.height}|${px.toFixed(4)}`;
      if (key === lastKey) return;
      lastKey = key;

      const cw = cv.width;
      const ch = cv.height;
      const sw = img.naturalWidth;
      const sh = img.naturalHeight;
      ctx.fillStyle = '#231E1A';
      ctx.fillRect(0, 0, cw, ch);
      if (!portrait) {
        // cover
        const s = Math.max(cw / sw, ch / sh);
        ctx.drawImage(img, (cw - sw * s) / 2, (ch - sh * s) / 2, sw * s, sh * s);
        return;
      }
      // phone: show ~48% of the film width, full height, as a tall band under the header; pan along the action
      const visible = 0.48;
      const s = cw / (sw * visible);
      const dh = sh * s;
      const maxShift = (sw * s - cw) / 2;
      const dx = (cw - sw * s) / 2 - Math.max(-maxShift, Math.min(maxShift, px * sw * s));
      const dy = Math.max(0, Math.min(ch * 0.125, ch - dh));
      ctx.drawImage(img, dx, dy, sw * s, dh);
      // soften the band edges into the page colour
      const g1 = ctx.createLinearGradient(0, dy, 0, dy + ch * 0.05);
      g1.addColorStop(0, 'rgba(35,30,26,1)');
      g1.addColorStop(1, 'rgba(35,30,26,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, dy, cw, ch * 0.05);
      const g2 = ctx.createLinearGradient(0, dy + dh - ch * 0.08, 0, dy + dh);
      g2.addColorStop(0, 'rgba(35,30,26,0)');
      g2.addColorStop(1, 'rgba(35,30,26,1)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, dy + dh - ch * 0.08, cw, ch * 0.08);
    };

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (frames[i] || cancelled) return resolve();
        const img = new Image();
        img.decoding = 'async';
        img.src = `${base}f${String(i + 1).padStart(4, '0')}.webp`;
        const done = () => {
          if (!cancelled && img.naturalWidth) {
            frames[i] = img;
            loaded += 1;
            story.loaded = loaded / count;
          }
          resolve();
        };
        img.decode().then(done, () => {
          img.onload = done;
          img.onerror = () => resolve();
          if (img.complete) done();
        });
      });

    (async () => {
      const res = await fetch(asset('/film/manifest.json'));
      const m = (await res.json()) as Manifest;
      if (cancelled) return;
      count = m.count;
      for (let i = 0; i < count; i++) frames.push(null);
      await load(0);
      resize();
      markReady();
      // coarse-to-fine: every 16th, 8th, 4th, 2nd, then all; a few requests in flight at once
      const order: number[] = [];
      const seen = new Set<number>([0]);
      for (const step of [16, 8, 4, 2, 1]) {
        for (let i = 0; i < count; i += step) {
          if (seen.has(i)) continue;
          seen.add(i);
          order.push(i);
        }
      }
      if (!seen.has(count - 1)) order.splice(1, 0, count - 1);
      let next = 0;
      const worker = async () => {
        while (!cancelled && next < order.length) await load(order[next++]);
      };
      await Promise.all(Array.from({ length: 6 }, worker));
    })();

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvas} className="film-canvas" aria-label="Boş salonun kaydırdıkça döşenmesini gösteren film" role="img" />;
}

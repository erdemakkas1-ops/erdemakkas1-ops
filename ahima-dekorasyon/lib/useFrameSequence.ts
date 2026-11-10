'use client';

import { useCallback, useEffect, useRef } from 'react';
import { framePos, frameUrl, type Sequence } from './media';

/**
 * Scroll-scrubbed image sequence on a <canvas>. There is no playback clock: the frame is a pure
 * function of the progress you pass to `seek(p)` (0..1), so scrolling back plays the film backwards.
 *
 * - Picks the portrait sequence when the canvas is taller than 4:5, the landscape one otherwise.
 * - Loads frame 1 first, then the timeline coarse-to-fine (every 16th, 8th, 4th ... frame), so the
 *   whole film is scrubbable early and fills in detail as it downloads.
 * - Blends the two frames around the playhead and eases the playhead toward the target, so coarse
 *   wheel steps still read as continuous motion.
 */
export function useFrameSequence(desktop: Sequence, mobile: Sequence, opts: { focusX?: number; eager?: boolean } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    seq: desktop,
    images: [] as (HTMLImageElement | null)[],
    target: 0,
    head: 0,
    raf: 0,
    started: false,
    reduce: false,
    noMobile: false,
    w: 0,
    h: 0,
  });
  const focusX = opts.focusX ?? 0.5;

  const draw = useCallback(() => {
    const s = state.current;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d', { alpha: false });
    if (!ctx) return;
    const n = s.seq.frames;
    const pos = framePos(s.seq, s.head);
    const i0 = Math.floor(pos);
    const frac = pos - i0;
    const nearest = (i: number) => {
      for (let d = 0; d < n; d++) {
        const a = s.images[i - d];
        if (a && a.complete && a.naturalWidth) return a;
        const b = s.images[i + d];
        if (b && b.complete && b.naturalWidth) return b;
      }
      return null;
    };
    const a = nearest(i0);
    if (!a) return;
    const cover = (img: HTMLImageElement, alpha: number) => {
      const scale = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (c.width - w) * focusX, (c.height - h) / 2, w, h);
    };
    cover(a, 1);
    const bImg = s.images[i0 + 1];
    if (frac > 0.02 && bImg && bImg.complete && bImg.naturalWidth && s.images[i0] === a) cover(bImg, frac);
    ctx.globalAlpha = 1;
    c.dataset.ready = '1';
  }, [focusX]);

  const tick = useCallback(() => {
    const s = state.current;
    const d = s.target - s.head;
    s.head = Math.abs(d) < 0.0004 || s.reduce ? s.target : s.head + d * 0.2;
    draw();
    s.raf = s.head !== s.target ? requestAnimationFrame(tick) : 0;
  }, [draw]);

  const seek = useCallback((p: number) => {
    const s = state.current;
    s.target = Math.min(1, Math.max(0, p));
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const s = state.current;
    const c = canvasRef.current;
    if (!c) return;
    s.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;
    let queue: number[] = [];
    let inflight = 0;

    const load = (i: number) => {
      if (s.images[i] !== null && s.images[i] !== undefined) return;
      const img = new Image();
      img.decoding = 'async';
      s.images[i] = img;
      inflight++;
      const done = () => {
        inflight--;
        if (disposed) return;
        const pos = framePos(s.seq, s.head);
        if (Math.abs(i - pos) < 2 || !c.dataset.ready) draw();
        pump();
      };
      img.onload = done;
      img.onerror = () => {
        s.images[i] = null;
        // portrait set unavailable (e.g. not deployed yet): fall back to the landscape film
        if (i === 0 && s.seq === mobile && !s.noMobile) { s.noMobile = true; inflight--; choose(); return; }
        done();
      };
      img.src = frameUrl(s.seq, i);
    };
    const pump = () => {
      while (inflight < 6 && queue.length) {
        const i = queue.shift()!;
        if (!s.images[i]) load(i);
      }
    };
    const plan = (n: number) => {
      const order: number[] = [];
      const seen = new Set<number>();
      for (let step = 16; step >= 1; step = step / 2) {
        for (let i = 0; i < n; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
        if (!seen.has(n - 1)) { seen.add(n - 1); order.push(n - 1); }
      }
      return order;
    };
    const choose = () => {
      const portrait = c.clientHeight / Math.max(1, c.clientWidth) > 1.25;
      const next = portrait && !s.noMobile ? mobile : desktop;
      if (next !== s.seq || !s.started) {
        s.seq = next;
        s.images = new Array(next.frames).fill(undefined);
        queue = [];
        c.dataset.ready = '';
        load(0);
        if (s.started) { queue = plan(next.frames).filter(i => i !== 0); pump(); }
      }
    };
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(c.clientWidth * dpr);
      const h = Math.round(c.clientHeight * dpr);
      if (w !== c.width || h !== c.height) { c.width = w; c.height = h; }
      choose();
      draw();
    };
    const start = () => {
      if (s.started) return;
      s.started = true;
      queue = plan(s.seq.frames).filter(i => !s.images[i]);
      pump();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(c);
    // load the rest of the film once its section is near (or straight away for the hero)
    let io: IntersectionObserver | null = null;
    if (opts.eager) {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
      if (idle) idle(start); else setTimeout(start, 300);
    } else {
      io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { start(); io?.disconnect(); } }, { rootMargin: '150% 0px' });
      io.observe(c);
    }
    return () => {
      disposed = true;
      ro.disconnect();
      io?.disconnect();
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [desktop, mobile, draw, opts.eager]);

  return { canvasRef, seek };
}

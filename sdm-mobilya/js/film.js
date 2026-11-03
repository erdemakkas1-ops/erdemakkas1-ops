// FILM: SDM's kitchen in Gemini keyframes (img/film/, see GEMINI.md), scrubbed by page scroll.
// The stage is pinned; scroll progress maps to film seconds (data-map on #film). Each frame has
// data-in="a,b": it fades in over film seconds a–b on top of the frames before it, or wipes in from
// left to right behind a brass line when it also has data-wipe. Captions use data-from / data-to;
// notes use data-at="u,v", a point on the landscape picture as fractions of its width and height, and
// data-m="u,v" for the portrait pictures shown on tall screens (no data-m: hidden there).
// The frames are laid out by hand (not object-fit) so the notes can follow the picture exactly,
// including the slow push-in over the whole film. Tall screens (max-aspect-ratio 4/5, the same query as
// the <source> elements) get the 1080 x 1920 portrait frames, with the copy over the floor at the bottom.
(function () {
  const film = document.getElementById('film');
  if (!film || film.classList.contains('film--static')) return;

  const stage = film.querySelector('.film__stage');
  const box = film.querySelector('.film__frames');
  const frames = [...film.querySelectorAll('.film__frame')].map(el => {
    const [a, b] = el.dataset.in.split(',').map(Number);
    return { el, a, b, wipe: el.hasAttribute('data-wipe') };
  });
  const line = film.querySelector('.film__wipe');
  const scenes = [...film.querySelectorAll('.film__scene')];
  const notes = [...film.querySelectorAll('.film__dim, .film__label')].map(el => {
    const [u, v] = el.dataset.at.split(',').map(Number);
    const [mu, mv] = el.dataset.m ? el.dataset.m.split(',').map(Number) : [NaN, NaN];
    return { el, u, v, mu, mv, from: +el.dataset.from, to: +el.dataset.to, dim: el.classList.contains('film__dim') };
  });
  const map = film.dataset.map.split(',').map(pair => pair.split(':').map(Number));
  const evening = +film.dataset.evening || 99;
  const tallQuery = matchMedia('(max-aspect-ratio: 4/5)');

  const clamp = v => Math.min(1, Math.max(0, v));
  const smooth = v => (v = clamp(v), v * v * (3 - 2 * v));
  const span = (t, a, b) => b > a ? smooth((t - a) / (b - a)) : +(t >= a);
  const interp = (points, x) => {
    for (let k = 1; k < points.length; k++) {
      const [x0, y0] = points[k - 1], [x1, y1] = points[k];
      if (x <= x1) return y0 + (y1 - y0) * clamp((x - x0) / (x1 - x0));
    }
    return points[points.length - 1][1];
  };

  let cw = 1, ch = 1, tall = false, current = 0, target = 0, animating = false;
  let lay = { x: 0, y: 0, w: 1, h: 1 };

  function layout(t) {
    // the picture covers the stage, pushed in 7% over the film; on tall screens it is pushed in
    // around the kitchen (upper part of the portrait frames) rather than the centre
    const [IW, IH] = tall ? [1080, 1920] : [1920, 1080];
    const zoom = 1.02 + .07 * smooth(t / 12);
    const s = Math.max(cw / IW, ch / IH) * zoom;
    const w = IW * s, h = IH * s;
    const fy = tall ? .3 : .5;
    lay = { x: (cw - w) * .5, y: (ch - h) * fy, w, h };
    box.style.width = w + 'px';
    box.style.height = h + 'px';
    box.style.transform = `translate(${lay.x.toFixed(1)}px, ${lay.y.toFixed(1)}px)`;
  }

  function show(t) {
    for (const f of frames) {
      const k = span(t, f.a, f.b);
      f.el.style.visibility = k > 0 ? 'visible' : 'hidden';
      if (f.wipe) {
        f.el.style.opacity = 1;
        f.el.style.clipPath = `inset(0 ${((1 - k) * 100).toFixed(2)}% 0 0)`;
        if (line) {
          const on = k > 0 && k < 1;
          line.style.opacity = on ? 1 : 0;
          if (on) line.style.transform = `translateX(${(lay.x + k * lay.w).toFixed(1)}px)`;
        }
      } else f.el.style.opacity = k.toFixed(3);
    }
    film.classList.toggle('is-light', t < evening);
  }

  function place(t) {
    for (const n of notes) {
      let o = Math.min(clamp((t - n.from) / .3), clamp((n.to - t) / .3));
      const [u, v] = tall ? [n.mu, n.mv] : [n.u, n.v];
      const x = lay.x + u * lay.w, y = lay.y + v * lay.h;
      if (!(x >= 12 && x <= cw - 12 && y >= 80 && y <= ch * (tall ? .6 : 1) - 12)) o = 0;
      n.el.style.opacity = o.toFixed(3);
      if (o <= 0) continue;
      n.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      if (n.dim) continue;
      n.el.style.setProperty('--o', o.toFixed(3));
      n.el.classList.toggle('film__label--left', x > cw * .62);
    }
  }

  function captions(t) {
    for (const el of scenes) {
      const from = +el.dataset.from, to = +el.dataset.to;
      const o = Math.min(from <= 0 ? 1 : clamp((t - from) / .3), clamp((to - t) / .3));
      el.style.opacity = o;
      el.style.visibility = o < .01 ? 'hidden' : 'visible';
      el.style.filter = o < 1 ? `blur(${((1 - o) * 6).toFixed(1)}px)` : '';
      el.style.transform = o < 1 ? `translateY(${((1 - o) * 16).toFixed(1)}px)` : '';
    }
  }

  function draw() { layout(current); show(current); place(current); captions(current); }

  function resize() {
    cw = stage.clientWidth; ch = stage.clientHeight;
    tall = tallQuery.matches;
    film.classList.toggle('is-tall', tall);
    draw();
  }

  const update = () => {
    const p = clamp(-film.getBoundingClientRect().top / (film.offsetHeight - stage.offsetHeight));
    target = interp(map, p);
    film.classList.toggle('is-scrolled', p > .01);
    if (!animating) { animating = true; requestAnimationFrame(tick); }
  };
  // ease the playhead toward the scroll position so coarse wheel steps still read as motion
  function tick() {
    current += (target - current) * .16;
    if (Math.abs(target - current) < .002) current = target;
    draw();
    if (current !== target) requestAnimationFrame(tick); else animating = false;
  }

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', resize);
  resize();
  update();
  film.classList.add('is-ready');

  // ?capture: __film.seek(t) jumps to a film second (for checks and share images)
  if (/[?&]capture\b/.test(location.search)) window.__film = { seek: t => { current = target = t; draw(); } };
})();

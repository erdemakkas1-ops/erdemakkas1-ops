// Arqli: the scroll film. One living room from js/room.js, scrubbed over film seconds 0–12:
//   0–3   Plan     outlines plot in on a slate drawing board, with dimensions and a 50 cm grid
//   3–5.5 Doku     walls, floor and built-ins take their materials, the board turns to daylight
//   5.5–8.5 Mobilya furniture settles in piece by piece, each outline giving way to the real thing
//   8.5–12 Işık    the sun goes down, hidden LEDs and the ring light come on; closing call to action
// html.live-film is set in the <head>; without WebGL2 the section falls back to its poster.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { build } from './room.js?v=1';

const film = document.getElementById('film');
const html = document.documentElement;
if (html.classList.contains('live-film')) start();

function start() {
  const canvas = document.getElementById('film3d');
  const probe = document.createElement('canvas');
  if (!probe.getContext('webgl2')) { film.classList.add('failed'); return; }

  const $ = (s, r = film) => r.querySelector(s), $$ = (s, r = film) => [...r.querySelectorAll(s)];
  const T_END = 12;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
  const small = innerWidth <= 760;
  const capture = /[?&]capture\b/.test(location.search);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: capture });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = small ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  const camera = new THREE.PerspectiveCamera(32, 16 / 9, .1, 80);

  const room = build({});
  scene.add(room.group);
  const { W, D } = room.size;

  // a 50 cm grid under the drawing, gone once the materials arrive
  const grid = new THREE.GridHelper(16, 32, 0x51626a, 0x34424a);
  grid.position.y = -.005; grid.material.transparent = true; grid.material.depthWrite = false; scene.add(grid);

  // colours of the board: slate drawing, daylight plaster, evening
  const BG = { plan: new THREE.Color('#1d2326'), day: new THREE.Color('#ddd5c9'), eve: new THREE.Color('#15130f') };
  const LINE = { plan: new THREE.Color('#ece3d4'), day: new THREE.Color('#6b5d4f') };
  const bg = new THREE.Color(); scene.background = bg;

  // order inside each stage, for staggering
  const stageIdx = { shell: 0, fit: 0, furn: 0 };
  room.parts.forEach(p => { p.i = stageIdx[p.stage]++; p.lineCount = p.lines.reduce((a, l) => a + l.userData.count, 0); });

  // anchors for the tags
  const anchors = {};
  room.parts.forEach(p => {
    const b = new THREE.Box3().setFromObject(p.obj);
    anchors[p.name] = p.anchor ? p.anchor.clone() : b.getCenter(new THREE.Vector3());
  });
  anchors['zemin'] = new THREE.Vector3(W * .05, 0, D * .05);
  anchors['arka duvar'] = new THREE.Vector3(W * .36, 2.2, -D / 2 + .02);

  // camera path: from almost straight above to a low evening view; positions are relative to the room size
  const keys = [
    { t: 0,    p: [.6, 12.5, 4.4],  l: [0, 0, -.1] },
    { t: 2.4,  p: [6.6, 7.4, 8.6],  l: [-.1, .6, -.2] },
    { t: 5,    p: [7.1, 4.7, 8.0],  l: [-.3, .95, -.45] },
    { t: 8,    p: [5.8, 3.3, 7.2],  l: [-.35, 1.0, -.6] },
    { t: 10.5, p: [4.6, 2.35, 6.3], l: [-.45, 1.15, -.85] },
    { t: 12,   p: [4.2, 2.15, 5.9], l: [-.5, 1.18, -.95] },
  ];
  const posCurve = new THREE.CatmullRomCurve3(keys.map(k => new THREE.Vector3(...k.p)), false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(keys.map(k => new THREE.Vector3(...k.l)), false, 'centripetal');
  function camAt(t) {
    // film time → curve parameter, piecewise by key, eased inside each piece
    let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++;
    const a = keys[i], b = keys[i + 1], k = clamp((t - a.t) / (b.t - a.t));
    const e = k * k * (3 - 2 * k) * .55 + k * .45;
    const u = (i + e) / (keys.length - 1);
    const pos = posCurve.getPoint(u), look = lookCurve.getPoint(u);
    // tall screens: pull back so the whole room fits the width
    const aspect = camera.aspect;
    const fit = aspect < 1.25 ? 1 + (1.25 / aspect - 1) * .5 : 1;
    pos.sub(look).multiplyScalar(fit).add(look);
    camera.position.copy(pos); camera.lookAt(look);
  }

  // UI
  const stage = $('.stage'), intro = $('.intro'), chaps = $$('.chap'), endEl = $('.end'), rail = $('.rail'), railBtns = $$('button', rail);
  const top = document.getElementById('top');
  const tags = $$('.tag').map(el => {
    const dim = el.dataset.dim != null ? room.dims[+el.dataset.dim] : null;
    if (dim) el.querySelector('span').textContent = dim.label;
    return { el, at: dim ? dim.mid : anchors[el.dataset.at], from: +el.dataset.from, to: +el.dataset.to };
  });

  let Wpx = 1, Hpx = 1;
  const v = new THREE.Vector3();
  function apply(t) {
    const day = smooth(3, 4.2, t), eve = smooth(8.9, 10.4, t);
    bg.copy(BG.plan).lerp(BG.day, day).lerp(BG.eve, eve);
    const lineCol = LINE.plan.clone().lerp(LINE.day, day);
    grid.material.opacity = (.45 + .45 * smooth(0, .8, t)) * (1 - smooth(3, 3.8, t));
    grid.visible = grid.material.opacity > .001;
    room.dimMat.opacity = smooth(.5, 1.1, t) * (1 - smooth(3, 3.6, t));
    room.dimGroup.visible = room.dimMat.opacity > .001;

    for (const p of room.parts) {
      let draw, op, lineOp, drop = 0;
      if (p.stage === 'shell') {
        draw = smooth(-1.1 + p.i * .25, .9 + p.i * .25, t);
        op = smooth(3 + p.i * .2, 3.9 + p.i * .2, t);
        lineOp = 1 - smooth(3.5, 4.4, t);
      } else if (p.stage === 'fit') {
        draw = smooth(.9 + p.i * .3, 2.1 + p.i * .3, t);
        op = smooth(3.6 + p.i * .35, 4.6 + p.i * .35, t);
        lineOp = 1 - smooth(4.2 + p.i * .35, 5 + p.i * .35, t);
      } else {
        const s = 5.6 + p.i * .34;
        draw = smooth(1.5 + p.i * .13, 2.7 + p.i * .13, t);
        op = smooth(s, s + .45, t);
        lineOp = (1 - smooth(s + .15, s + .7, t)) * (1 - .45 * day);
        drop = 1 - smooth(s, s + .85, t);
      }
      for (const m of p.mats) { m.opacity = op; m.transparent = op < .999; m.depthWrite = op > .5; m.visible = op > .002; }
      p.lineMat.opacity = lineOp; p.lineMat.color.copy(lineCol);
      // outlines plot in: each part's segments are drawn in order, part by part
      let budget = draw * p.lineCount;
      for (const l of p.lines) {
        const n = Math.max(0, Math.min(l.userData.count, Math.floor(budget / 2) * 2)); budget -= l.userData.count;
        l.geometry.setDrawRange(0, n); l.visible = n > 0 && lineOp > .002;
      }
      p.obj.position.y = p.rest.y + drop * drop * (p.name === 'halı' ? .02 : .9);
    }
    room.setEvening(eve);
    scene.environmentIntensity = 1 - .82 * eve;
    renderer.toneMappingExposure = 1.05 + .1 * eve;

    camAt(t);
    // UI states
    const light = t > 3.55 && t < 9.4;
    stage.classList.toggle('light', light);
    top.classList.toggle('on-light', light);
    intro.classList.toggle('off', t > .35);
    chaps.forEach(c => c.classList.toggle('on', t >= +c.dataset.from && t < +c.dataset.to));
    endEl.classList.toggle('on', t > 11.05);
    rail.classList.toggle('off', t > 11.05);
    const ci = t < 3.05 ? 0 : t < 5.65 ? 1 : t < 8.65 ? 2 : 3;
    railBtns.forEach((b, i) => { b.classList.toggle('on', i === ci); b.setAttribute('aria-current', i === ci ? 'step' : 'false'); });

    renderer.render(scene, camera);

    for (const g of tags) {
      const on = !!g.at && t >= g.from && t < g.to;
      g.el.classList.toggle('on', on);
      if (!on) continue;
      v.copy(g.at).project(camera);
      const x = (v.x + 1) / 2 * Wpx, y = (1 - v.y) / 2 * Hpx;
      const flip = x > Wpx * .72;
      g.el.classList.toggle('flip', flip);
      const left = clamp(x + (flip ? -g.el.offsetWidth + 5 : -5), 8, Wpx - g.el.offsetWidth - 8);
      g.el.style.transform = `translate3d(${left.toFixed(1)}px,${(y - g.el.offsetHeight / 2).toFixed(1)}px,0)`;
    }
  }

  function size() {
    Wpx = stage.clientWidth; Hpx = stage.clientHeight;
    renderer.setSize(Wpx, Hpx, false);
    camera.aspect = Wpx / Hpx;
    // wide screens: the room sits right of centre, clear of the text; tall screens: a little higher
    if (camera.aspect > 1.15) camera.setViewOffset(Wpx, Hpx, -Wpx * .13, 0, Wpx, Hpx);
    else camera.setViewOffset(Wpx, Hpx, 0, Hpx * .1, Wpx, Hpx);
    camera.fov = camera.aspect < 1 ? 38 : 32;
    camera.updateProjectionMatrix();
    apply(cur);
  }

  // ease towards the scroll target so wheel steps glide; stop when settled
  let target = 0, cur = 0, raf = 0, last = 0;
  function tick(now) {
    const dt = Math.min(.1, (now - (last || now - 16)) / 1000); last = now;
    cur += (target - cur) * Math.min(1, dt * 9);
    if (Math.abs(target - cur) < .002) cur = target;
    apply(cur);
    raf = cur === target ? 0 : requestAnimationFrame(tick);
    if (!raf) last = 0;
  }
  function read() {
    const r = film.getBoundingClientRect();
    if (r.bottom < -50 || r.top > innerHeight + 50) return;
    target = clamp(-r.top / Math.max(1, r.height - innerHeight)) * T_END;
    if (capture) { cur = target; apply(cur); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  addEventListener('scroll', read, { passive: true });
  addEventListener('resize', () => { size(); read(); });
  railBtns.forEach(b => b.addEventListener('click', () => {
    scrollTo({ top: film.offsetTop + (+b.dataset.go / T_END) * (film.offsetHeight - innerHeight), behavior: 'smooth' });
  }));
  // textures arrive after the first frame: draw again
  THREE.DefaultLoadingManager.onLoad = () => apply(cur);

  // compile every shader once with everything visible, so the first fade never stalls
  room.parts.forEach(p => p.mats.forEach(m => { m.visible = true; m.transparent = true; }));
  room.setEvening(1);
  size();
  renderer.compileAsync(scene, camera).catch(() => {}).then(() => {
    const r = film.getBoundingClientRect();
    target = cur = clamp(-r.top / Math.max(1, r.height - innerHeight)) * T_END;
    apply(cur);
    film.classList.add('ready');
  });
  // for screenshots and checks: __film.seek(t) jumps to a film second
  window.__film = { seek: t => scrollTo(0, film.offsetTop + t / T_END * (film.offsetHeight - innerHeight)), apply: t => { cur = target = t; apply(t); }, renderer };
}

// Arqli: the cutaway living room, built in code. Shared by the scroll film (js/film.js) and the
// configurator (js/studio.js). Units are metres; the floor is y = 0, the back wall at z = -D/2,
// the left wall at x = -W/2, the room opens to the camera at the front and on the right.
//
// build(cfg) returns { group, parts, lights, dims, anchors, setEvening(k) }.
// Each part: { obj, stage: 'shell' | 'fit' | 'furn', mats, lines, rest } so the film can draw its
// outline, fade its materials in and drop it into place.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// ---------- palettes: four of the studio's directions ----------
export const STYLES = {
  sicak:  { name: 'Sıcak minimal', wall: '#d8cbb8', wall2: '#cbbba5', wood: '#7a5b40', fabric: '#d6cab8', fabric2: '#b9ab96', accent: '#5f6247', metal: '#2c2a27', stone: '#d9cdb9' },
  japandi:{ name: 'Japandi',       wall: '#e7e1d6', wall2: '#dcd4c6', wood: '#b38b60', fabric: '#e2dbcf', fabric2: '#c9bfae', accent: '#7c8169', metal: '#2a2826', stone: '#e0d6c4' },
  luks:   { name: 'Modern lüks',   wall: '#9b8d7e', wall2: '#8b7c6d', wood: '#3f3129', fabric: '#3a3633', fabric2: '#2b2826', accent: '#6d1f2b', metal: '#b08d57', stone: '#e6e1da' },
  toprak: { name: 'Toprak & kil',  wall: '#d2a487', wall2: '#bf8a6c', wood: '#8a5d3b', fabric: '#ece2d3', fabric2: '#d7c6b0', accent: '#a4482f', metal: '#2b2622', stone: '#dccab2' },
};
export const FLOORS = { mese: 'Meşe parke', ceviz: 'Ceviz parke', traverten: 'Traverten', beton: 'Mikro beton' };
export const FEATURES = { kemer: 'Kemerli niş', cita: 'Ahşap çıta', mermer: 'Mermer panel', sade: 'Sade sıva' };
export const LAMPS = { halka: 'Halka avize', sarkit: 'Glob sarkıt', lambader: 'Lambader' };
export const KELVIN = { 2700: '#ffb46b', 3000: '#ffc58a', 4000: '#ffe6c9' };
export const DEFAULT = { W: 5.2, D: 4.2, H: 2.8, style: 'sicak', floor: 'mese', feature: 'kemer', lamp: 'halka', kelvin: 2700 };

// ---------- textures ----------
const loader = new THREE.TextureLoader();
let OAK = null;
function oak() {
  if (OAK) return OAK;
  const t = loader.load(new URL('../img/tex/oak-diff.webp', import.meta.url).href);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  OAK = t; return t;
}
function canvasTex(w, h, draw, repeat = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
// a seeded random, so textures and plant leaves come out the same every time
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const TEX = {};
function plaster() {
  return TEX.plaster ??= canvasTex(512, 512, (g, w, h) => {
    const r = rng(7); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 3400; i++) { const a = r() * .016; g.fillStyle = `rgba(80,60,40,${a})`; const s = 3 + r() * 22; g.beginPath(); g.ellipse(r() * w, r() * h, s, s * (.4 + r() * .6), r() * 3, 0, 7); g.fill(); }
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${r() * .05})`; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3); }
  });
}
function travertine() {
  return TEX.trav ??= canvasTex(512, 512, (g, w, h) => {
    const r = rng(11); g.fillStyle = '#e6dac6'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) { g.fillStyle = `rgba(150,120,85,${r() * .07})`; g.fillRect(0, y, w, 1 + r() * 2); }
    for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(120,95,65,${.08 + r() * .14})`; const x = r() * w, y = r() * h; g.fillRect(x, y, 6 + r() * 40, 1 + r() * 2.5); }
    g.strokeStyle = 'rgba(110,90,70,.35)'; g.lineWidth = 1.5; g.strokeRect(0, 0, w, h); g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  });
}
function concrete() {
  return TEX.conc ??= canvasTex(512, 512, (g, w, h) => {
    const r = rng(3); g.fillStyle = '#c9c4bc'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(${r() < .5 ? '60,55,50' : '255,255,255'},${r() * .06})`; const s = 2 + r() * 30; g.beginPath(); g.arc(r() * w, r() * h, s, 0, 7); g.fill(); }
  });
}
function marble() {
  return TEX.marble ??= canvasTex(512, 1024, (g, w, h) => {
    const r = rng(19); g.fillStyle = '#f1ede6'; g.fillRect(0, 0, w, h);
    // book-matched: draw veins on the left half, mirror them to the right
    g.save(); g.beginPath(); g.rect(0, 0, w / 2, h); g.clip();
    for (let v = 0; v < 22; v++) {
      g.strokeStyle = `rgba(${90 + r() * 40},${80 + r() * 30},${70 + r() * 20},${.12 + r() * .35})`; g.lineWidth = .6 + r() * 2.6;
      g.beginPath(); let x = r() * w * .6, y = -20; g.moveTo(x, y);
      while (y < h + 20) { x += (r() - .45) * 46; y += 20 + r() * 50; g.lineTo(x, y); }
      g.stroke();
    }
    g.restore();
    g.save(); g.translate(w, 0); g.scale(-1, 1); g.drawImage(g.canvas, 0, 0, w / 2, h, 0, 0, w / 2, h); g.restore();
  }, false);
}
function rugTex(col) {
  const key = 'rug' + col;
  return TEX[key] ??= canvasTex(512, 512, (g, w, h) => {
    const r = rng(5); g.fillStyle = col; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${r() < .5 ? '0,0,0' : '255,255,255'},${r() * .05})`; g.fillRect(r() * w, r() * h, 1, 2 + r() * 3); }
    g.strokeStyle = 'rgba(0,0,0,.1)'; g.lineWidth = 10; g.strokeRect(22, 22, w - 44, h - 44);
  }, false);
}

// ---------- geometry helpers ----------
const box = (w, h, d, r = 0) => r > 0 ? new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001)) : new THREE.BoxGeometry(w, h, d);

// a circle of line segments in the x-y plane, for outlines of round things
function ring(r, n = 64) {
  const a = [];
  for (let i = 0; i < n; i++) { const t0 = i / n * Math.PI * 2, t1 = (i + 1) / n * Math.PI * 2; a.push(Math.cos(t0) * r, Math.sin(t0) * r, 0, Math.cos(t1) * r, Math.sin(t1) * r, 0); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); return g;
}
// an arch in the x-y plane: two legs and a half circle on top; t runs from the bottom left leg over the top to the bottom right
class ArchCurve extends THREE.Curve {
  constructor(w, h, z = 0) { super(); this.w = w; this.h = h; this.z = z; const r = w / 2, leg = h - r; this.leg = leg; this.r = r; this.len = 2 * leg + Math.PI * r; }
  getPoint(t, out = new THREE.Vector3()) {
    const { leg, r, len, z } = this; let s = t * len;
    if (s < leg) return out.set(-r, s, z);
    s -= leg;
    if (s < Math.PI * r) { const a = Math.PI - s / r; return out.set(Math.cos(a) * r, leg + Math.sin(a) * r, z); }
    s -= Math.PI * r; return out.set(r, leg - s, z);
  }
}
function archShape(w, h) {
  const r = w / 2, s = new THREE.Shape();
  s.moveTo(-r, 0); s.lineTo(-r, h - r); s.absarc(0, h - r, r, Math.PI, 0, true); s.lineTo(r, 0); s.lineTo(-r, 0);
  return s;
}

export function build(cfg = {}) {
  cfg = { ...DEFAULT, ...cfg };
  const P = STYLES[cfg.style] || STYLES.sicak;
  const { W, D, H } = cfg;
  const x0 = -W / 2, z0 = -D / 2, T = .14; // wall thickness
  const group = new THREE.Group();
  const parts = [];
  const emissive = []; // materials that glow in the evening: { m, k }
  const ledColor = new THREE.Color(KELVIN[cfg.kelvin] || KELVIN[2700]);

  const plasterRep = n => { if (n === 1) return plaster(); const t = plaster().clone(); t.needsUpdate = true; t.repeat.set(n, n * H / W); return t; };
  // materials: each part clones its own, so the film can fade parts one by one
  const M = {
    wall: (rep = 1) => new THREE.MeshStandardMaterial({ color: P.wall, map: plasterRep(rep), roughness: .95 }),
    wall2: (rep = 1) => new THREE.MeshStandardMaterial({ color: P.wall2, map: plasterRep(rep), roughness: .95 }),
    wood: () => { const t = oak().clone(); t.needsUpdate = true; t.repeat.set(.6, .6); return new THREE.MeshStandardMaterial({ color: new THREE.Color(P.wood).lerp(new THREE.Color('#ffffff'), .25), map: t, roughness: .55 }); },
    fabric: (c = P.fabric) => new THREE.MeshStandardMaterial({ color: c, roughness: .98 }),
    metal: (c = P.metal) => new THREE.MeshStandardMaterial({ color: c, roughness: .35, metalness: .85 }),
    stone: () => new THREE.MeshStandardMaterial({ color: '#ffffff', map: travertine(), roughness: .6 }),
    matte: c => new THREE.MeshStandardMaterial({ color: c, roughness: .8 }),
    glow: () => { const m = new THREE.MeshStandardMaterial({ color: '#2a2622', emissive: ledColor.clone(), emissiveIntensity: 0, roughness: .4 }); emissive.push({ m, k: 1 }); return m; },
  };

  // part: a group placed at `rest`; meshes are added with mesh(); each mesh gets an outline for the drawing
  function part(stage, name, rest = new THREE.Vector3()) {
    const obj = new THREE.Group(); obj.name = name; obj.position.copy(rest); group.add(obj);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xe9dfcf, transparent: true, opacity: 1, depthWrite: false });
    const p = { obj, stage, name, mats: [], lines: [], lineMat, rest: rest.clone() };
    parts.push(p); return p;
  }
  function mesh(p, geo, mat, x = 0, y = 0, z = 0, o = {}) {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
    if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz;
    m.castShadow = o.cast !== false; m.receiveShadow = true;
    p.obj.add(m); if (!p.mats.includes(mat)) p.mats.push(mat);
    if (o.edges !== false) {
      const eg = o.edges || new THREE.EdgesGeometry(o.edgeGeo || (geo.type === 'RoundedBoxGeometry' ? new THREE.BoxGeometry(geo.parameters.width, geo.parameters.height, geo.parameters.depth) : geo), 28);
      const l = new THREE.LineSegments(eg, p.lineMat); l.position.copy(m.position); l.rotation.copy(m.rotation); l.scale.copy(m.scale);
      l.userData.count = eg.attributes.position.count; l.renderOrder = 2; p.obj.add(l); p.lines.push(l);
    }
    return m;
  }

  // ===== shell: floor slab, back wall, left wall =====
  {
    const p = part('shell', 'zemin');
    let fm;
    if (cfg.floor === 'mese' || cfg.floor === 'ceviz') {
      const t = oak().clone(); t.needsUpdate = true; t.repeat.set(W / 1.6, D / 1.6);
      fm = new THREE.MeshStandardMaterial({ map: t, color: cfg.floor === 'ceviz' ? '#8a6648' : '#f2e6d6', roughness: .5 });
    } else if (cfg.floor === 'traverten') {
      const t = travertine().clone(); t.needsUpdate = true; t.repeat.set(W / 1.2, D / 1.2);
      fm = new THREE.MeshStandardMaterial({ map: t, roughness: .45 });
    } else {
      const t = concrete().clone(); t.needsUpdate = true; t.repeat.set(W / 3, D / 3);
      fm = new THREE.MeshStandardMaterial({ map: t, color: '#e8e2d8', roughness: .7 });
    }
    // floor top face is the finish; the slab sides are a darker section cut, like an architectural cutaway
    const slab = new THREE.MeshStandardMaterial({ color: '#3b3733', roughness: .9 });
    mesh(p, new THREE.BoxGeometry(W + T, .02, D + T), fm, -T / 2, -.01, -T / 2, { cast: false });
    mesh(p, new THREE.BoxGeometry(W + T, .22, D + T), slab, -T / 2, -.13, -T / 2, { cast: false });
    p.floorMat = fm;
  }
  {
    const p = part('shell', 'arka duvar');
    const wm = M.wall(Math.round(W / 1.4));
    mesh(p, new THREE.BoxGeometry(W + T, H, T), wm, -T / 2, H / 2, z0 - T / 2);
    // section cap on top of the wall: dark, like the cut line in their isometric renders
    const cap = new THREE.MeshStandardMaterial({ color: '#2f2b28', roughness: .9 });
    mesh(p, new THREE.BoxGeometry(W + T, .012, T), cap, -T / 2, H + .006, z0 - T / 2, { edges: false, cast: false });
    // skirting
    mesh(p, new THREE.BoxGeometry(W, .07, .015), M.matte(P.wall2), 0, .035, z0 + .0075, { edges: false });
  }
  {
    const p = part('shell', 'sol duvar');
    const wm = M.wall2(Math.round(D / 1.4));
    mesh(p, new THREE.BoxGeometry(T, H, D), wm, x0 - T / 2, H / 2, 0);
    mesh(p, new THREE.BoxGeometry(T, .012, D + T), new THREE.MeshStandardMaterial({ color: '#2f2b28', roughness: .9 }), x0 - T / 2, H + .006, -T / 2, { edges: false, cast: false });
    // a tall window in the left wall, towards the front: frame, glass and the light it lets in
    const ww = Math.min(1.3, D * .3), wz = D / 2 - ww / 2 - .35;
    const fr = M.metal('#2a2724');
    const g = new THREE.MeshPhysicalMaterial({ color: '#cfdde0', roughness: .05, transmission: .0, transparent: true, opacity: .35, metalness: 0 });
    mesh(p, new THREE.BoxGeometry(.05, 2.15, ww), g, x0 + .002, 1.25, wz, { cast: false, edges: false });
    for (const dz of [-ww / 2, 0, ww / 2]) mesh(p, new THREE.BoxGeometry(.06, 2.15, .04), fr, x0 + .01, 1.25, wz + dz, { edges: false });
    for (const dy of [.175, 2.325, 1.6]) mesh(p, new THREE.BoxGeometry(.06, .04, ww + .04), fr, x0 + .01, dy, wz, { edges: false });
    p.window = { z: wz, w: ww };
  }

  // ===== fit: the back wall feature and the built-in shelving =====
  const fw = Math.min(2.6, W * .5), fx = .15; // feature width and centre x
  if (cfg.feature === 'kemer') {
    const p = part('fit', 'kemerli niş');
    const aw = Math.min(1.25, fw * .52), ah = 2.15, pw = fw + .1, ph = H;
    // a raised plaster panel with an arched opening: the opening shows the recess behind it
    const sh = new THREE.Shape(); sh.moveTo(-pw / 2, 0); sh.lineTo(pw / 2, 0); sh.lineTo(pw / 2, ph); sh.lineTo(-pw / 2, ph); sh.lineTo(-pw / 2, 0);
    const hole = archShape(aw, ah); sh.holes.push(new THREE.Path(hole.getPoints(48).map(v => new THREE.Vector2(v.x, v.y + .36))));
    const geo = new THREE.ExtrudeGeometry(sh, { depth: .16, bevelEnabled: false, curveSegments: 32 });
    const panel = M.wall(); panel.color.set(P.wall).offsetHSL(0, 0, .03);
    mesh(p, geo, panel, 0, 0, 0);
    // recess back, a shade darker, and a floating console
    const back = M.wall2(); back.color.offsetHSL(0, 0, -.04);
    mesh(p, new THREE.ShapeGeometry(archShape(aw, ah), 32), back, 0, .36, .002, { edges: false, cast: false });
    mesh(p, box(aw - .08, .05, .3, .01), M.stone(), 0, 1.08, .17, { edges: false });
    // LED strip following the arch, set back in the reveal
    const led = M.glow();
    mesh(p, new THREE.TubeGeometry(new ArchCurve(aw - .03, ah - .015, 0), 96, .011, 6, false), led, 0, .36, .03, { edges: false, cast: false });
    // decor in the niche: a vase with branches and a bowl
    mesh(p, new THREE.CylinderGeometry(.06, .085, .3, 24), M.matte('#2f2b28'), -.18, 1.255, .17, { edges: false });
    for (let i = 0; i < 5; i++) mesh(p, new THREE.CylinderGeometry(.004, .004, .55, 4), M.matte('#4a3a2c'), -.18 + (i - 2) * .03, 1.6, .17, { rz: (i - 2) * .18, edges: false });
    mesh(p, new THREE.SphereGeometry(.09, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.matte(P.stone), .2, 1.105, .17, { rx: Math.PI, edges: false });
    p.obj.position.set(fx, 0, z0); p.rest.copy(p.obj.position);
    p.led = { at: new THREE.Vector3(fx, 1.9, z0 + .25) };
    p.anchor = new THREE.Vector3(fx + aw / 2, 2.15, z0 + .1);
  } else if (cfg.feature === 'cita') {
    const p = part('fit', 'ahşap çıta');
    const wood = M.wood(); const n = Math.round(fw / .06);
    mesh(p, new THREE.BoxGeometry(fw + .04, H - .1, .02), M.matte('#1f1c19'), 0, (H - .1) / 2, .01, { edges: false });
    for (let i = 0; i < n; i++) mesh(p, new THREE.BoxGeometry(.035, H - .1, .03), wood, -fw / 2 + .03 + i * (fw - .06) / (n - 1), (H - .1) / 2, .035, { edges: i % 4 === 0 ? undefined : false });
    const led = M.glow(); mesh(p, new THREE.BoxGeometry(fw, .015, .015), led, 0, H - .14, .06, { edges: false, cast: false });
    p.obj.position.set(fx, 0, z0); p.rest.copy(p.obj.position);
    p.led = { at: new THREE.Vector3(fx, H - .3, z0 + .35) };
    p.anchor = new THREE.Vector3(fx + fw / 2, 2.1, z0 + .06);
  } else if (cfg.feature === 'mermer') {
    const p = part('fit', 'mermer panel');
    const mm = new THREE.MeshStandardMaterial({ map: marble(), roughness: .18, metalness: 0 });
    mesh(p, new THREE.BoxGeometry(fw, H - .1, .04), mm, 0, (H - .1) / 2, .02);
    const led = M.glow();
    mesh(p, new THREE.BoxGeometry(.012, H - .1, .012), led, -fw / 2 - .02, (H - .1) / 2, .02, { edges: false, cast: false });
    mesh(p, new THREE.BoxGeometry(.012, H - .1, .012), led, fw / 2 + .02, (H - .1) / 2, .02, { edges: false, cast: false });
    p.obj.position.set(fx, 0, z0); p.rest.copy(p.obj.position);
    p.led = { at: new THREE.Vector3(fx, 1.6, z0 + .35) };
    p.anchor = new THREE.Vector3(fx + fw / 2, 2.1, z0 + .05);
  } else {
    const p = part('fit', 'sade duvar');
    // a framed artwork, so the plain wall still has a focus
    mesh(p, new THREE.BoxGeometry(1.1, .8, .03), M.metal('#2a2724'), 0, 1.75, .015);
    mesh(p, new THREE.PlaneGeometry(1.02, .72), M.matte(P.accent), 0, 1.75, .032, { edges: false, cast: false });
    mesh(p, new THREE.CircleGeometry(.2, 32), M.matte(P.stone), .15, 1.8, .034, { edges: false, cast: false });
    p.obj.position.set(fx, 0, z0); p.rest.copy(p.obj.position);
    p.led = null; p.anchor = new THREE.Vector3(fx + .55, 2.1, z0 + .05);
  }
  {
    // built-in shelving on the left wall, at the back: walnut frame, lit niches
    const p = part('fit', 'nişli raf');
    const sd = Math.min(1.5, D * .36), sh = H - .2, dep = .36;
    const wood = M.wood(); const dark = M.matte('#26221f');
    mesh(p, new THREE.BoxGeometry(.02, sh, sd), dark, .01, sh / 2, 0, { edges: false });
    mesh(p, new THREE.BoxGeometry(dep, sh, .04), wood, dep / 2, sh / 2, -sd / 2 + .02);
    mesh(p, new THREE.BoxGeometry(dep, sh, .04), wood, dep / 2, sh / 2, sd / 2 - .02);
    mesh(p, new THREE.BoxGeometry(dep, .04, sd), wood, dep / 2, sh - .02, 0);
    // lower cabinet with fluted doors
    mesh(p, new THREE.BoxGeometry(dep + .02, .62, sd), M.matte(P.accent), dep / 2 + .01, .31, 0);
    for (let i = 0; i < 18; i++) mesh(p, new THREE.CylinderGeometry(.012, .012, .5, 8), M.matte(new THREE.Color(P.accent).offsetHSL(0, 0, .04).getStyle()), dep + .024, .32, -sd / 2 + .06 + i * (sd - .12) / 17, { edges: false, cast: false });
    const led = M.glow();
    const shelves = [.98, 1.38, 1.78, 2.18].filter(y => y < sh - .2);
    shelves.forEach(y => {
      mesh(p, new THREE.BoxGeometry(dep - .02, .035, sd - .08), wood, dep / 2, y, 0);
      mesh(p, new THREE.BoxGeometry(.012, .01, sd - .1), led, dep - .05, y - .022, 0, { edges: false, cast: false });
    });
    // books and objects
    const r = rng(23), cols = ['#2b2723', '#cfc4b2', '#8a7660', '#5d5244', P.accent, '#e7dfd2'];
    [.62, ...shelves].slice(0, -1).forEach((y, si) => {
      let z = -sd / 2 + .1 + r() * .15;
      while (z < sd / 2 - .25) {
        if (r() < .55) { const n = 3 + (r() * 5 | 0); for (let k = 0; k < n && z < sd / 2 - .12; k++) { const bh = .2 + r() * .1, bw = .025 + r() * .02; mesh(p, new THREE.BoxGeometry(.2, bh, bw), M.matte(cols[(r() * cols.length) | 0]), dep / 2 + .02, y + .02 + bh / 2, z, { edges: false }); z += bw + .003; } z += .08 + r() * .1; }
        else { const vh = .14 + r() * .14; mesh(p, new THREE.CylinderGeometry(.04 + r() * .03, .05, vh, 20), M.matte(r() < .5 ? '#ece5da' : '#3a332d'), dep / 2 + .02, y + .02 + vh / 2, z + .06, { edges: false }); z += .2; }
      }
      void si;
    });
    p.obj.position.set(x0, 0, z0 + sd / 2 + .02); p.rest.copy(p.obj.position);
    p.led = { at: new THREE.Vector3(x0 + .5, 1.6, z0 + sd / 2) };
    p.anchor = new THREE.Vector3(x0 + dep, 1.78, z0 + sd / 2 + .1);
  }

  // ===== furniture =====
  const cz = z0 + Math.min(1.55, D * .37); // sofa centre z
  {
    const p = part('furn', 'halı');
    const rw = Math.min(3.2, W * .6), rd = Math.min(2.3, D * .55);
    const m = new THREE.MeshStandardMaterial({ map: rugTex(P.fabric2), roughness: 1 });
    mesh(p, box(rw, .015, rd, .006), m, 0, .0075, 0, { cast: false });
    p.obj.position.set(fx, 0, cz + .55); p.rest.copy(p.obj.position);
  }
  {
    const p = part('furn', 'kanepe');
    const sw = Math.min(2.5, W * .46), f = M.fabric(), f2 = M.fabric(P.fabric2), leg = M.metal();
    mesh(p, box(sw, .2, .95, .05), f2, 0, .2, 0);                                  // base
    mesh(p, box(sw - .3, .17, .72, .07), f, -sw / 4 + .075 / 2, .38, .08);          // seat cushions
    mesh(p, box(sw / 2 - .15, .17, .72, .07), f, sw / 4 - .075 / 2, .38, .08, { edges: false });
    mesh(p, box(sw, .45, .22, .08), f2, 0, .5, -.36);                               // back
    mesh(p, box(sw / 2 - .18, .4, .16, .08), f, -sw / 4 + .02, .66, -.22, { rx: -.12 }); // back cushions
    mesh(p, box(sw / 2 - .18, .4, .16, .08), f, sw / 4 - .02, .66, -.22, { rx: -.12, edges: false });
    mesh(p, box(.18, .5, .95, .08), f2, -sw / 2 + .09, .3, 0);                       // arms
    mesh(p, box(.18, .5, .95, .08), f2, sw / 2 - .09, .3, 0);
    mesh(p, box(.36, .3, .1, .05), M.fabric(P.accent), -sw / 2 + .38, .6, -.14, { rx: -.2, rz: .12, edges: false }); // cushions
    mesh(p, box(.36, .3, .1, .05), M.fabric(P.accent), sw / 2 - .4, .6, -.14, { rx: -.2, rz: -.1, edges: false });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) mesh(p, new THREE.CylinderGeometry(.018, .014, .1, 10), leg, sx * (sw / 2 - .1), .05, sz * .38, { edges: false });
    p.obj.position.set(fx, 0, cz - .25); p.rest.copy(p.obj.position);
    p.anchor = new THREE.Vector3(fx - sw / 2 + .2, .75, cz - .25);
  }
  {
    const p = part('furn', 'sehpa');
    const st = M.stone();
    mesh(p, new THREE.CylinderGeometry(.5, .5, .06, 64), st, 0, .36, 0);
    mesh(p, new THREE.CylinderGeometry(.34, .38, .33, 64), st, 0, .165, 0);
    mesh(p, new THREE.CylinderGeometry(.33, .36, .33, 48), M.matte('#2a2622'), 0, .165, 0, { edges: false, cast: false });
    // objects on top: a tray, books and a small vase
    mesh(p, new THREE.CylinderGeometry(.16, .16, .015, 32), M.metal(P.metal), -.12, .4, .06, { edges: false });
    mesh(p, box(.26, .04, .19, .004), M.matte('#e9e2d5'), .16, .41, -.08, { ry: .3, edges: false });
    mesh(p, box(.24, .03, .17, .004), M.matte('#2f2a26'), .16, .445, -.08, { ry: .5, edges: false });
    mesh(p, new THREE.SphereGeometry(.07, 24, 16), M.matte('#d9cfbf'), -.12, .47, .06, { edges: false });
    p.obj.position.set(fx, 0, cz + .75); p.rest.copy(p.obj.position);
    p.anchor = new THREE.Vector3(fx + .5, .4, cz + .75);
  }
  {
    // lounge chair, front right, turned towards the sofa
    const p = part('furn', 'berjer');
    const f = M.fabric(P.accent), wood = M.wood();
    mesh(p, box(.78, .14, .78, .06), f, 0, .34, 0);
    mesh(p, box(.78, .5, .14, .07), f, 0, .62, -.34, { rx: -.15 });
    mesh(p, box(.12, .24, .7, .05), f, -.37, .48, -.02);
    mesh(p, box(.12, .24, .7, .05), f, .37, .48, -.02);
    mesh(p, box(.8, .06, .8, .02), wood, 0, .24, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) mesh(p, new THREE.CylinderGeometry(.022, .018, .22, 10), wood, sx * .33, .11, sz * .33, { edges: false });
    p.obj.position.set(Math.min(W / 2 - .7, fx + 1.75), 0, cz + 1.25); p.obj.rotation.y = -2.25; p.rest.copy(p.obj.position);
  }
  {
    const p = part('furn', 'yan sehpa');
    mesh(p, new THREE.CylinderGeometry(.22, .22, .03, 40), M.wood(), 0, .55, 0);
    mesh(p, new THREE.CylinderGeometry(.015, .015, .54, 12), M.metal(), 0, .27, 0, { edges: false });
    mesh(p, new THREE.CylinderGeometry(.16, .16, .02, 32), M.metal(), 0, .01, 0, { edges: false });
    // table lamp
    mesh(p, new THREE.CylinderGeometry(.05, .07, .24, 24), M.matte('#e8e0d2'), 0, .69, 0, { edges: false });
    const shade = M.glow(); shade.color.set('#efe3cf'); shade.emissive.set(ledColor);
    mesh(p, new THREE.CylinderGeometry(.11, .15, .17, 32, 1, true), shade, 0, .88, 0, { edges: false, cast: false });
    const sw = Math.min(2.5, W * .46);
    p.obj.position.set(fx - sw / 2 - .38, 0, cz - .35); p.rest.copy(p.obj.position);
    p.led = { at: new THREE.Vector3(fx - sw / 2 - .38, .95, cz - .35), small: true };
  }
  {
    // plant in a ribbed pot, front left by the window
    const p = part('furn', 'bitki');
    mesh(p, new THREE.CylinderGeometry(.2, .16, .42, 32), M.matte('#d9cfc0'), 0, .21, 0);
    const r = rng(41), leaf = new THREE.MeshStandardMaterial({ color: '#4c5a3c', roughness: .8, side: THREE.DoubleSide });
    const lg = new THREE.SphereGeometry(.12, 8, 6); lg.scale(1, .25, .55);
    for (let i = 0; i < 46; i++) {
      const a = r() * Math.PI * 2, h = .5 + r() * 1.05, rad = .08 + r() * .38 * (1 - Math.abs(h - 1) * .6);
      mesh(p, lg, leaf, Math.cos(a) * rad, h, Math.sin(a) * rad, { ry: -a, rz: (r() - .5) * 1.2, rx: (r() - .5) * .8, edges: false });
    }
    mesh(p, new THREE.CylinderGeometry(.012, .016, 1.1, 6), M.matte('#5a4632'), 0, .95, 0, { edges: false });
    p.obj.position.set(x0 + .45, 0, Math.min(D / 2 - .5, cz + 1.2)); p.rest.copy(p.obj.position);
  }
  // ceiling light over the coffee table
  {
    const p = part('furn', LAMPS[cfg.lamp] || 'avize');
    const ly = H - .05, mt = M.metal(cfg.style === 'luks' ? P.metal : '#1f1d1b');
    if (cfg.lamp === 'halka') {
      const glow = M.glow();
      [[.5, 2.05], [.36, 1.85], [.24, 1.68]].forEach(([r, y], i) => {
        const tg = new THREE.TorusGeometry(r, .016, 10, 96);
        mesh(p, tg, mt, 0, y - ly, 0, { rx: Math.PI / 2 + (i - 1) * .06, rz: i * .2, edges: ring(r) });
        mesh(p, new THREE.TorusGeometry(r, .008, 6, 96), glow, 0, y - ly - .014, 0, { rx: Math.PI / 2 + (i - 1) * .06, rz: i * .2, edges: false, cast: false });
      });
      for (const a of [0, 2.1, 4.2]) mesh(p, new THREE.CylinderGeometry(.002, .002, ly - 1.66, 3), mt, Math.cos(a) * .22, (ly - 1.66) / 2 + 1.66 - ly, Math.sin(a) * .22, { edges: false, cast: false });
      mesh(p, new THREE.CylinderGeometry(.09, .09, .03, 32), mt, 0, -.015, 0, { edges: false });
    } else if (cfg.lamp === 'sarkit') {
      const glow = M.glow(); glow.color.set('#f2eadc');
      [[-.35, 1.95], [0, 1.8], [.35, 1.95]].forEach(([dx, y]) => {
        mesh(p, new THREE.SphereGeometry(.13, 32, 20), glow, dx, y - ly, 0, { edges: new THREE.EdgesGeometry(new THREE.CylinderGeometry(.13, .13, .001, 32), 30) });
        mesh(p, new THREE.CylinderGeometry(.003, .003, ly - y, 3), mt, dx, (y - ly) / 2, 0, { edges: false, cast: false });
        mesh(p, new THREE.CylinderGeometry(.035, .035, .05, 16), mt, dx, y - ly + .15, 0, { edges: false });
      });
      mesh(p, box(1, .03, .1, .01), mt, 0, -.015, 0, { edges: false });
    } else {
      // arc floor lamp standing behind the sofa end, reaching over the table: built at floor level below
      const base = M.stone(); const glow = M.glow(); glow.color.set('#efe6d6');
      const ax = -1.15, az = -.75;
      mesh(p, new THREE.CylinderGeometry(.17, .17, .06, 40), base, ax, .03 - ly, az);
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(ax, .06 - ly, az), new THREE.Vector3(ax + .1, 2.6 - ly, az + .2), new THREE.Vector3(0, 1.95 - ly, 0));
      mesh(p, new THREE.TubeGeometry(curve, 48, .012, 8, false), mt, 0, 0, 0, { edges: false });
      mesh(p, new THREE.SphereGeometry(.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), M.metal('#2a2724'), 0, 1.95 - ly, 0, { edges: new THREE.EdgesGeometry(new THREE.CylinderGeometry(.2, .2, .001, 40), 30) });
      mesh(p, new THREE.CircleGeometry(.19, 32), glow, 0, 1.949 - ly, 0, { rx: Math.PI / 2, edges: false, cast: false });
    }
    p.obj.position.set(fx, ly, cz + .75); p.rest.copy(p.obj.position);
    p.led = { at: new THREE.Vector3(fx, 1.7, cz + .75), main: true };
    p.anchor = new THREE.Vector3(fx + .5, 2.05, cz + .75);
  }

  // ===== lights =====
  const lights = {};
  lights.hemi = new THREE.HemisphereLight(0xfff6ea, 0x8a7a68, .9); group.add(lights.hemi);
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
  sun.position.set(W * .9, 5.5, D * 1.1); sun.target.position.set(0, 0, 0);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .02;
  const sc = sun.shadow.camera; const ext = Math.max(W, D) * .75; sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = .5; sc.far = 20;
  sun.shadow.radius = 4;
  group.add(sun, sun.target); lights.sun = sun;
  // window light: a soft fill from the left wall's window
  const win = new THREE.PointLight(0xdfe8ff, 0, 6, 1.6); win.position.set(x0 + .5, 1.6, parts[2].window.z); group.add(win); lights.win = win;
  // warm practical lights, brightened in the evening
  lights.warm = [];
  parts.forEach(p => {
    if (!p.led) return;
    const l = new THREE.PointLight(ledColor, 0, p.led.main ? 6 : p.led.small ? 2.2 : 3.2, 1.8);
    l.position.copy(p.led.at); l.userData.max = p.led.main ? 5 : p.led.small ? 1.3 : 2.4; group.add(l); lights.warm.push(l);
  });

  function setEvening(k) {
    // k: 0 day, 1 evening
    sun.intensity = 2.05 * (1 - k) + .05 * k;
    sun.color.setRGB(1, .94 - .2 * k, .86 - .35 * k);
    lights.hemi.intensity = .7 * (1 - k) + .12 * k;
    win.intensity = 0;
    lights.warm.forEach(l => { l.intensity = l.userData.max * k; });
    emissive.forEach(({ m }) => { m.emissiveIntensity = 3.2 * k; });
  }
  setEvening(0);

  // dimensions for the drawing: along the front edge of the floor and the left wall, and the height
  const dims = [
    { a: new THREE.Vector3(x0, 0, D / 2 + .25), b: new THREE.Vector3(W / 2, 0, D / 2 + .25), label: `${Math.round(W * 100)} cm` },
    { a: new THREE.Vector3(W / 2 + .25, 0, z0), b: new THREE.Vector3(W / 2 + .25, 0, D / 2), label: `${Math.round(D * 100)} cm` },
    { a: new THREE.Vector3(W / 2 + .05, 0, z0 - .2), b: new THREE.Vector3(W / 2 + .05, H, z0 - .2), label: `h ${Math.round(H * 100)}` },
  ];
  const dimGroup = new THREE.Group(); group.add(dimGroup);
  const dimMat = new THREE.LineBasicMaterial({ color: 0xd9a35c, transparent: true, depthWrite: false });
  dims.forEach(d => {
    const dir = d.b.clone().sub(d.a).normalize(), side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(.08);
    if (side.lengthSq() < 1e-6) side.set(.08, 0, 0);
    const pts = [d.a, d.b, d.a.clone().add(side), d.a.clone().sub(side), d.b.clone().add(side), d.b.clone().sub(side)];
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const l = new THREE.LineSegments(g, dimMat); l.renderOrder = 3; dimGroup.add(l);
    d.mid = d.a.clone().add(d.b).multiplyScalar(.5);
  });

  const byName = n => parts.find(p => p.name === n);
  return { group, parts, lights, dims, dimGroup, dimMat, setEvening, cfg, byName, emissive, ledColor, size: { W, D, H } };
}

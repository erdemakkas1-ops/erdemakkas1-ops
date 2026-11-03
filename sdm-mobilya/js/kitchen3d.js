// Mutfağını tasarla, 3D: the kitchen from js/extras.js's layout, built in three.js in metres.
// Adapted for SDM from the D&M Mutfak demo's js/kitchen3d.js: shaker / flat handle-less / gloss lacquer fronts
// with brushed brass bar handles, black or white marble or wood worktops, brass dome pendants.
// x runs along wall A, z goes from wall A into the room, y is up. Base units stand on a 10 cm plinth,
// 72 cm carcass, 4 cm worktop (86 cm in all); wall units hang from 145 cm, 72 cm tall, 35 cm deep.
// It renders on demand: after a change, a drag or a resize. Drag sideways (or arrow keys) to turn it;
// on touch screens a vertical swipe still scrolls the page.
// Realism without losing responsiveness: while the view is moving or a slider is dragged it renders
// the plain pass; ~160 ms after it settles it renders once more with ground-truth ambient occlusion
// (GTAO, desktop only). Floor and walnut use CC0 oak veneer from Poly Haven (img/tex/).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const PLINTH = .1, CARCASS = .72, TOP = .04, BASE_H = PLINTH + CARCASS + TOP;
const WALL_Y = 1.45, WALL_H = .72, WALL_D = .35, TALL_H = WALL_Y + WALL_H, ROOM_H = 2.6;
const GAP = .003, FRONT_T = .019;
const COLORS = { antrasit: '#34312e', krem: '#e6dcc8', gri: '#9a948b', ceviz: '#8a5f40', yesil: '#5b6150' };

export function mount(box) {
  const canvas = box.querySelector('canvas');
  const tagLayer = box.querySelector('.k3d-tags');
  tagLayer.textContent = '';
  const phone = matchMedia('(max-width:760px)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  // full device resolution (capped at 2) so edges stay crisp; the scene is cheap enough for it
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // the sun does not move with the camera: shadows are redrawn only when the kitchen changes
  renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#231e1a');
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = .45;
  // a standing person's view: eye height about 1.6 m, a 35 mm-like field of view
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 60);

  // ---- textures ----
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const finish = (t, srgb, rep) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    if (rep) t.repeat.set(...rep);
    return t;
  };
  // Calacatta-like marble: soft wide veins under thin dark ones, drawn once
  const marbleOf = (base, rgb, boost = 1) => {
    const c = document.createElement('canvas'); c.width = c.height = 1024;
    const k = c.getContext('2d');
    k.fillStyle = base; k.fillRect(0, 0, 1024, 1024);
    const vein = (alpha, width, blur, n) => {
      k.filter = blur ? `blur(${blur}px)` : 'none';
      for (let v = 0; v < n; v++) {
        k.strokeStyle = `rgba(${rgb},${Math.min(1, alpha * boost * (.5 + rnd()))})`; k.lineWidth = width * (.5 + rnd());
        k.beginPath(); let x = rnd() * 1024, y = -20; k.moveTo(x, y);
        while (y < 1044) { const nx = x + (rnd() - .48) * 110, ny = y + 30 + rnd() * 60; k.quadraticCurveTo(x + (rnd() - .5) * 60, (y + ny) / 2, nx, ny); x = nx; y = ny; }
        k.stroke();
      }
    };
    vein(.1, 14, 10, 7); vein(.16, 3, 1.5, 10); vein(.28, 1, 0, 14);
    k.filter = 'none';
    return finish(new THREE.CanvasTexture(c), true);
  };
  const marble = marbleOf('#f2f0ec', '118,110,100');
  const blackMarble = marbleOf('#161514', '214,188,160', 1.8);
  // the oak floor: planks cut from the veneer photo, each with its own offset and tone, joints between
  const floorMap = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 1024;
    const k = c.getContext('2d');
    k.fillStyle = '#c9b597'; k.fillRect(0, 0, 1024, 1024);
    return { canvas: c, tex: finish(new THREE.CanvasTexture(c), true, [12 / 1.44, 12 / 1.44]) };
  })();
  const loader = new THREE.TextureLoader();
  const img = new Image();
  img.onload = () => {
    // 8 rows of 18 cm planks over 1.44 m, plank lengths 0.7–1.4 m, staggered
    const k = floorMap.canvas.getContext('2d'), row = 128;
    for (let r = 0; r < 8; r++) {
      let x = -rnd() * 600;
      while (x < 1024) {
        const len = 500 + rnd() * 500, sx = rnd() * (img.width - 300), sy = rnd() * (img.height - row);
        k.drawImage(img, sx, sy, 300, row, x, r * row, len, row);
        k.fillStyle = `rgba(${rnd() > .5 ? '255,236,210' : '60,40,20'},${rnd() * .12})`; k.fillRect(x, r * row, len, row);
        k.fillStyle = 'rgba(55,38,22,.55)'; k.fillRect(x, r * row, 2, row);
        x += len;
      }
      k.fillStyle = 'rgba(55,38,22,.5)'; k.fillRect(0, r * row, 1024, 2);
    }
    // lighter and less orange, like the light oak in the film
    k.globalCompositeOperation = 'saturation'; k.fillStyle = 'hsl(0,0%,50%)'; k.globalAlpha = .35; k.fillRect(0, 0, 1024, 1024);
    k.globalCompositeOperation = 'screen'; k.fillStyle = '#5a5248'; k.globalAlpha = 1; k.fillRect(0, 0, 1024, 1024);
    k.globalCompositeOperation = 'source-over';
    floorMap.tex.needsUpdate = true;
    settle();
  };
  img.src = 'img/tex/oak-diff.webp';
  const oakNor = finish(loader.load('img/tex/oak-nor.webp', () => settle()), false, [12 / 1.44, 12 / 1.44 * 4]);
  const walnutMap = finish(loader.load('img/tex/oak-diff.webp', () => settle()), true, [.6, .6]);

  // ---- materials ----
  const M = {
    front: new THREE.MeshPhysicalMaterial({ roughness: .62 }),
    carcass: new THREE.MeshStandardMaterial({ color: '#efede8', roughness: .8 }),
    top: null, splash: null,
    plinth: new THREE.MeshStandardMaterial({ color: '#2b2926', roughness: .7 }),
    wall: new THREE.MeshStandardMaterial({ color: '#ebe8e2', roughness: .95 }),
    black: new THREE.MeshStandardMaterial({ color: '#151515', roughness: .35, metalness: .2 }),
    blackGlass: new THREE.MeshPhysicalMaterial({ color: '#0d0d0e', roughness: .08, clearcoat: 1, clearcoatRoughness: .05 }),
    steel: new THREE.MeshStandardMaterial({ color: '#c9ccd0', roughness: .28, metalness: 1 }),
    basin: new THREE.MeshStandardMaterial({ color: '#8d9095', roughness: .35, metalness: 1 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#d9d3c7', roughness: .05, transparent: true, opacity: .25, depthWrite: false }),
    walnut: new THREE.MeshStandardMaterial({ map: walnutMap, color: '#8a6446', roughness: .6 }),
    groove: new THREE.MeshStandardMaterial({ color: '#2a2927', roughness: .6 }),
    knob: new THREE.MeshStandardMaterial({ color: '#c9a36a', roughness: .3, metalness: 1 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c9a36a', roughness: .28, metalness: 1, side: THREE.DoubleSide }),
    led: new THREE.MeshBasicMaterial({ color: '#ffd29a' }),
    seat: new THREE.MeshStandardMaterial({ color: '#1b1b1b', roughness: .55 }),
    shade: new THREE.MeshStandardMaterial({ color: '#c9a36a', roughness: .28, metalness: 1, side: THREE.DoubleSide }),
    bulb: new THREE.MeshBasicMaterial({ color: '#fff1d6' }),
  };

  // worktops: black marble (SDM's signature), white marble, or wood; the splash matches
  const TOPS = {
    siyah: [new THREE.MeshPhysicalMaterial({ map: blackMarble, roughness: .18, clearcoat: .55, clearcoatRoughness: .15 }), new THREE.MeshPhysicalMaterial({ map: blackMarble, roughness: .2, clearcoat: .5, clearcoatRoughness: .18 })],
    beyaz: [new THREE.MeshPhysicalMaterial({ map: marble, roughness: .22, clearcoat: .45, clearcoatRoughness: .18 }), new THREE.MeshPhysicalMaterial({ map: marble, roughness: .25, clearcoat: .4, clearcoatRoughness: .2 })],
    ahsap: [new THREE.MeshStandardMaterial({ map: walnutMap, color: '#b98a5e', roughness: .55 }), new THREE.MeshStandardMaterial({ map: walnutMap, color: '#b98a5e', roughness: .6 })],
  };
  [M.top, M.splash] = TOPS.siyah;

  // ---- fixed set: floor, daylight, sky fill ----
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshStandardMaterial({ map: floorMap.tex, normalMap: oakNor, normalScale: new THREE.Vector2(.35, .35), roughness: .55 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
  scene.add(floor);
  scene.add(new THREE.HemisphereLight('#ffffff', '#b9a68f', .5));
  const sun = new THREE.DirectionalLight('#fff4e4', 1.35);
  sun.castShadow = true;
  sun.shadow.mapSize.set(phone ? 1024 : 2048, phone ? 1024 : 2048);
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .02;
  scene.add(sun, sun.target);

  let group = null, tags = [], lastTip = null, AZ = [-1.2, 1.2];
  const view = { az: 0, el: .1, dist: 6, target: new THREE.Vector3() };

  // a fixed pool of warm lights for the LEDs and the pendants. The number of lights in a scene is
  // compiled into every shader, so lights are moved and dimmed, never added or removed: switching
  // the LEDs or changing a length then costs no shader recompilation (that was a ~1 s freeze).
  const POOL = 8;  // 4 under run A, 1 each for B and C, 2 for the island
  const pool = Array.from({ length: POOL }, () => { const l = new THREE.PointLight('#ffb866', 0, 1.6, 2); scene.add(l); return l; });

  // shared geometries for the round parts, so a rebuild creates no new buffers
  const roundCache = new Map();
  const round = (key, make) => { if (!roundCache.has(key)) roundCache.set(key, make()); return roundCache.get(key); };

  const geoCache = new Map();
  const geo = (w, h, d, r = 0) => {
    const key = `${w.toFixed(3)}|${h.toFixed(3)}|${d.toFixed(3)}|${r}`;
    if (!geoCache.has(key)) geoCache.set(key, r ? new RoundedBoxGeometry(w, h, d, 2, r) : new THREE.BoxGeometry(w, h, d));
    return geoCache.get(key);
  };
  // a box by its min corner and size, so plan coordinates (cm) map straight onto it
  function block(mat, x, y, z, w, h, d, r = 0, shadow = true) {
    const m = new THREE.Mesh(geo(w, h, d, r), mat);
    m.position.set(x + w / 2, y + h / 2, z + d / 2);
    m.castShadow = shadow; m.receiveShadow = true;
    group.add(m);
    return m;
  }

  // a door or drawer front facing +z, -x or +x; klasik gets a raised inner panel and a knob
  function front(o, face, u0, u1, y0, y1, plane, knobAt = 'top') {
    const w = u1 - u0 - 2 * GAP, h = y1 - y0 - 2 * GAP, cy = y0 + GAP;
    const parts = [[w, h, FRONT_T, 0, 0, 0, M.front]];
    if (o.kapak === 'klasik') {
      // shaker: a recessed centre panel inside a frame (the frame stands proud of the panel)
      const m = Math.min(.07, w * .16);
      parts.push([m, h, .008, 0, 0, FRONT_T, M.front], [m, h, .008, w - m, 0, FRONT_T, M.front]);
      parts.push([w - 2 * m, m, .008, m, 0, FRONT_T, M.front], [w - 2 * m, m, .008, m, h - m, FRONT_T, M.front]);
    }
    if (o.kapak !== 'kulpsuz') {
      // a brushed brass bar handle, near the top (base units) or the bottom (wall units)
      const bl = Math.min(.16, w * .5), ky = knobAt === 'top' ? h - .055 : .055;
      parts.push([bl, .012, .016, w / 2 - bl / 2, ky - .006, FRONT_T + (o.kapak === 'klasik' ? .012 : .004), M.knob]);
    }
    for (const [pw, ph, pt, du, dy, dt, mat] of parts) {
      if (face === 'z') block(mat, u0 + GAP + du, cy + dy, plane + dt, pw, ph, pt, .003);
      else if (face === '-x') block(mat, plane - pt - dt, cy + dy, u0 + GAP + du, pt, ph, pw, .003);
      else block(mat, plane + dt, cy + dy, u0 + GAP + du, pt, ph, pw, .003);
    }
  }
  // a flat panel on a run's face, `out` metres in front of the face plane
  function panel(mat, face, u0, u1, y0, y1, plane, t, out = 0) {
    if (face === 'z') block(mat, u0, y0, plane + out, u1 - u0, y1 - y0, t, .003);
    else if (face === '-x') block(mat, plane - out - t, y0, u0, t, y1 - y0, u1 - u0, .003);
    else block(mat, plane + out, y0, u0, t, y1 - y0, u1 - u0, .003);
  }
  // a run of base fronts between u0 and u1 (metres), one drawer stack per ~60 cm; the module under
  // a wall hob (oven: { face, at }) gets a built-in oven over a low drawer instead
  function baseFronts(o, face, u0, u1, plane, oven) {
    const n = Math.max(1, Math.round((u1 - u0) / .6));
    const yTop = PLINTH + CARCASS - (o.kapak === 'kulpsuz' ? .03 : 0);
    for (let i = 0; i < n; i++) {
      const a = u0 + (u1 - u0) * i / n, b = u0 + (u1 - u0) * (i + 1) / n;
      if (oven && oven.face === face && oven.at >= a && oven.at < b) {
        front(o, face, a, b, PLINTH, PLINTH + .16, plane);
        panel(M.blackGlass, face, a + GAP, b - GAP, PLINTH + .16 + GAP, yTop - GAP, plane, FRONT_T + .002);
        panel(M.steel, face, a + .06, b - .06, yTop - .075, yTop - .058, plane, .02, FRONT_T + .002);
        continue;
      }
      // two drawers on even modules, a door on odd ones, like most of their kitchens
      if (i % 2 === 0) { front(o, face, a, b, PLINTH, PLINTH + .36, plane); front(o, face, a, b, PLINTH + .36, yTop, plane); }
      else front(o, face, a, b, PLINTH, yTop, plane);
    }
    // the handle-less grip groove under the worktop
    if (o.kapak === 'kulpsuz') {
      if (face === 'z') block(M.groove, u0, PLINTH + CARCASS - .03, plane - .01, u1 - u0, .03, .012, 0, false);
      else if (face === '-x') block(M.groove, plane - .002, PLINTH + CARCASS - .03, u0, .012, .03, u1 - u0, 0, false);
      else block(M.groove, plane - .01, PLINTH + CARCASS - .03, u0, .012, .03, u1 - u0, 0, false);
    }
  }
  function wallFronts(o, face, u0, u1, plane, glassIndex = -1) {
    const n = Math.max(1, Math.round((u1 - u0) / .6));
    for (let i = 0; i < n; i++) {
      const a = u0 + (u1 - u0) * i / n, b = u0 + (u1 - u0) * (i + 1) / n;
      if (i === glassIndex && face === 'z') {
        // the glass display cabinet with walnut shelves, as in the film
        block(M.walnut, a + .02, WALL_Y + .02, .02, b - a - .04, WALL_H - .04, .01, 0, false);
        for (const s of [.24, .48]) block(M.walnut, a + .02, WALL_Y + s, .02, b - a - .04, .015, WALL_D - .04, 0, false);
        block(M.front, a + GAP, WALL_Y + GAP, plane, b - a - 2 * GAP, WALL_H - 2 * GAP, .004, 0, false);
        block(M.glass, a + .03, WALL_Y + .03, plane + .005, b - a - .06, WALL_H - .06, .004, 0, false);
        continue;
      }
      front(o, face, a, b, WALL_Y, WALL_Y + WALL_H, plane, 'bottom');
    }
  }

  function build(o, p) {
    if (group) scene.remove(group);
    group = new THREE.Group(); scene.add(group);
    // handle-less fronts are matt; classic framed fronts are lacquered, with a soft clear coat
    M.front.color.set(COLORS[o.renk]);
    // shaker and flat fronts are matt, lacquer is glossy
    M.front.roughness = o.kapak === 'lake' ? .14 : o.kapak === 'klasik' ? .6 : .72;
    // (never exactly 0: a clear coat of 0 is a different shader, and switching would recompile)
    M.front.clearcoat = o.kapak === 'lake' ? 1 : .01;
    M.front.clearcoatRoughness = o.kapak === 'lake' ? .06 : .25;
    [M.top, M.splash] = TOPS[o.tezgah] || TOPS.siyah;
    const cm = v => v / 100, A = cm(o.a), B = cm(o.b), C = cm(o.c), D = .6;
    const L = p.L, U = p.U, duz = o.tip === 'duz';
    const t = { x: cm(p.tall.x), z: cm(p.tall.y) };
    const roomD = Math.max(cm(p.depthRoom), 3);

    // walls: A always; B and C when the plan has them, each a little longer than its run
    block(M.wall, -.1, 0, -.1, A + .2, ROOM_H, .1);
    if (L) block(M.wall, -.1, 0, 0, .1, ROOM_H, Math.max(B, 1.2) + .3);
    if (U) block(M.wall, A, 0, 0, .1, ROOM_H, Math.max(C, 1.2) + .3);

    // where the oven goes: under a hob that stands on a wall run (with an island the hob is on the island)
    const oven = p.island ? null : cm(p.hob.y) < .1
      ? { face: 'z', at: cm(p.hob.x + p.hob.w / 2) }
      : { face: cm(p.hob.x) > 1 ? '-x' : '+x', at: cm(p.hob.y + p.hob.h / 2) };

    // run A: carcass, worktop, fronts and the marble splash behind it
    const a0 = duz ? D : 0, a1 = A;
    block(M.plinth, a0, 0, .05, a1 - a0, PLINTH, D - .1);
    block(M.carcass, a0, PLINTH, 0, a1 - a0, CARCASS, D - .02);
    block(M.top, a0, PLINTH + CARCASS, 0, a1 - a0, TOP, D + .02, .004);
    block(M.splash, a0, BASE_H, 0, a1 - a0, WALL_Y - BASE_H, .015, 0, false);
    baseFronts(o, 'z', duz ? D : L ? D : 0, U ? A - D : A, D - .02, oven);
    // run B along the left wall, run C along the right
    if (L) {
      const z1 = B - D;
      block(M.plinth, .05, 0, D, D - .1, PLINTH, z1 - D);
      block(M.carcass, 0, PLINTH, D, D - .02, CARCASS, z1 - D);
      block(M.top, 0, PLINTH + CARCASS, D, D + .02, TOP, z1 - D, .004);
      block(M.splash, 0, BASE_H, D, .015, WALL_Y - BASE_H, z1 - D, 0, false);
      if (z1 - D > .2) baseFronts(o, '+x', D, z1, D - .02, oven);
    }
    if (U) {
      block(M.plinth, A - D + .05, 0, D, D - .1, PLINTH, C - D);
      block(M.carcass, A - D + .02, PLINTH, D, D - .02, CARCASS, C - D);
      block(M.top, A - D - .02, PLINTH + CARCASS, D, D + .02, TOP, C - D, .004);
      block(M.splash, A - .015, BASE_H, D, .015, WALL_Y - BASE_H, C - D, 0, false);
      baseFronts(o, '-x', D, C, A - D + .02, oven);
    }

    // wall units; a cooker hood instead of them over a hob on the wall
    const hobOnWall = !p.island;
    const hob = { x: cm(p.hob.x), z: cm(p.hob.y), w: cm(p.hob.w), d: cm(p.hob.h) };
    const wa0 = duz ? D : L ? WALL_D : 0, wa1 = U ? A - WALL_D : A;
    block(M.carcass, wa0, WALL_Y, 0, wa1 - wa0, WALL_H, WALL_D - .02);
    wallFronts(o, 'z', wa0, wa1, WALL_D - .02, 1);
    if (L && B - D > WALL_D + .3) { block(M.carcass, 0, WALL_Y, WALL_D, WALL_D - .02, WALL_H, B - D - WALL_D); wallFronts(o, '+x', WALL_D, B - D, WALL_D - .02); }
    if (U) { block(M.carcass, A - WALL_D + .02, WALL_Y, WALL_D, WALL_D - .02, WALL_H, C - WALL_D); wallFronts(o, '-x', WALL_D, C, A - WALL_D + .02); }
    if (hobOnWall) {
      // a slim black hood hung under the wall units, centred on the hob
      const hx = hob.x + hob.w / 2, hz = hob.z + hob.d / 2;
      if (hob.z < .1) block(M.black, hx - .3, WALL_Y - .06, 0, .6, .06, .45);
      else block(M.black, hob.x < 1 ? 0 : A - .45, WALL_Y - .06, hz - .3, .45, .06, .6);
    }

    // the fridge column in the door colour, with two doors
    block(M.carcass, t.x, 0, t.z, D, TALL_H, D - .02);
    if (duz) { front(o, 'z', 0, D, PLINTH, 1.1, D - .02); front(o, 'z', 0, D, 1.1, TALL_H, D - .02, 'bottom'); }
    else { front(o, '+x', t.z, t.z + D, PLINTH, 1.1, D - .02); front(o, '+x', t.z, t.z + D, 1.1, TALL_H, D - .02, 'bottom'); }
    block(M.plinth, duz ? 0 : .05, 0, duz ? .05 : t.z, duz ? D : D - .1, PLINTH, duz ? D - .1 : D);

    // sink: a steel rim with the basin sunk below it, and a black gooseneck tap behind
    const s = { x: cm(p.sink.x), w: cm(p.sink.w) };
    block(M.steel, s.x + .02, BASE_H, .08, s.w - .04, .004, .44, .002, false);
    block(M.basin, s.x + .05, BASE_H - .015, .11, s.w - .1, .02, .38, .01, false);
    const tx = s.x + s.w / 2;
    const tap = new THREE.Mesh(round('tap', () => new THREE.CylinderGeometry(.013, .016, .3, 16)), M.black);
    tap.position.set(tx, BASE_H + .15, .06); tap.castShadow = true; group.add(tap);
    const neck = new THREE.Mesh(round('neck', () => new THREE.TorusGeometry(.07, .011, 10, 24, Math.PI)), M.black);
    neck.rotation.y = -Math.PI / 2; neck.position.set(tx, BASE_H + .3, .13); neck.castShadow = true; group.add(neck);

    // the island: fronts towards the kitchen, overhang and stools towards the room, waterfall ends
    let il = null;
    if (p.island) {
      il = { x: cm(p.island.x), z: cm(p.island.y), w: cm(p.island.w), d: cm(p.island.h) };
      const cab = .6;
      block(M.plinth, il.x + .05, 0, il.z + .05, il.w - .1, PLINTH, cab - .1);
      block(M.carcass, il.x + .02, PLINTH, il.z + .02, il.w - .04, CARCASS, cab - .02);
      block(M.top, il.x, PLINTH + CARCASS, il.z, il.w, TOP, il.d, .004);
      for (const ex of [il.x, il.x + il.w - .04]) block(M.top, ex, 0, il.z, .04, BASE_H, il.d, .004);
      // back panel under the overhang, in the door colour
      block(M.front, il.x + .04, 0, il.z + cab, il.w - .08, PLINTH + CARCASS, .02);
      // fronts face the wall run: mirror the +z helper by building them on the island's near face
      const n = Math.max(1, Math.round((il.w - .08) / .6));
      for (let i = 0; i < n; i++) {
        const a = il.x + .04 + (il.w - .08) * i / n, b = il.x + .04 + (il.w - .08) * (i + 1) / n;
        const yTop = PLINTH + CARCASS - (o.kapak === 'kulpsuz' ? .03 : 0);
        for (const [y0, y1] of [[PLINTH, PLINTH + .36], [PLINTH + .36, yTop]]) {
          block(M.front, a + GAP, y0 + GAP, il.z - FRONT_T + .02, b - a - 2 * GAP, y1 - y0 - 2 * GAP, FRONT_T, .003);
          if (o.kapak !== 'kulpsuz') {
            const bl = Math.min(.16, (b - a) * .5);
            block(M.knob, (a + b) / 2 - bl / 2, y1 - .07, il.z - FRONT_T - .016 + .02, bl, .012, .016, .003);
          }
        }
      }
      if (o.kapak === 'kulpsuz') block(M.groove, il.x + .04, PLINTH + CARCASS - .03, il.z + .01, il.w - .08, .03, .012, 0, false);
      // stools under the overhang
      const nStools = Math.max(1, Math.min(4, Math.floor(il.w / .6)));
      for (let i = 0; i < nStools; i++) {
        const sx = il.x + il.w * (i + .5) / nStools, sz = il.z + il.d + .12;
        const seat = new THREE.Mesh(round('seat', () => new THREE.CylinderGeometry(.19, .17, .06, 28)), M.seat);
        seat.position.set(sx, .66, sz); seat.castShadow = true; group.add(seat);
        for (const [dx, dz] of [[-.12, -.12], [.12, -.12], [-.12, .12], [.12, .12]]) {
          const leg = new THREE.Mesh(round('leg', () => new THREE.CylinderGeometry(.01, .012, .64, 8)), M.seat);
          leg.position.set(sx + dx * .9, .32, sz + dz * .9); leg.rotation.set(dz * .5, 0, -dx * .5); leg.castShadow = true; group.add(leg);
        }
      }
    }
    // the hob, on the island or on a wall run: black glass flush with the worktop
    block(M.blackGlass, hob.x, BASE_H, hob.z, hob.w, .006, hob.d, .002, false);

    // pendant lights over the island: cord, black shade, warm bulb; the shade's rim 86 cm above the top
    if (il) {
      const n = il.w >= 1.6 ? 3 : 2, drop = BASE_H + .86;
      for (let i = 0; i < n; i++) {
        const px = il.x + il.w * (i + .5) / n, pz = il.z + il.d / 2;
        const cord = new THREE.Mesh(round('cord', () => new THREE.CylinderGeometry(.003, .003, ROOM_H - drop - .2, 6)), M.black);
        cord.position.set(px, (ROOM_H + drop + .2) / 2, pz); group.add(cord);
        const shade = new THREE.Mesh(round('shade', () => new THREE.SphereGeometry(.15, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2)), M.shade);
        shade.position.set(px, drop + .02, pz); shade.castShadow = true; group.add(shade);
        const bulb = new THREE.Mesh(round('bulb', () => new THREE.SphereGeometry(.035, 16, 12)), M.bulb);
        bulb.position.set(px, drop + .03, pz); group.add(bulb);
      }
    }

    // hidden LED: glowing strips under the wall units and the island overhang, warm lights from the pool
    const lit = [];
    const warm = (x, y, z, k = .6, dist = 1.6, color = '#ffb866') => lit.push([x, y, z, k, dist, color]);
    if (o.led) {
      const glow = (x, z, w, d, y) => block(M.led, x, y, z, w, .008, d, 0, false);
      glow(wa0 + .02, WALL_D - .08, wa1 - wa0 - .04, .03, WALL_Y - .01);
      if (L && B - D > WALL_D + .3) glow(WALL_D - .08, WALL_D + .02, .03, B - D - WALL_D - .04, WALL_Y - .01);
      if (U) glow(A - WALL_D + .05, WALL_D + .02, .03, C - WALL_D - .04, WALL_Y - .01);
      const nA = Math.min(4, Math.max(1, Math.round((wa1 - wa0) / 1.2)));
      for (let i = 0; i < nA; i++) warm(wa0 + (wa1 - wa0) * (i + .5) / nA, WALL_Y - .06, .22);
      if (L && B - D > 1) warm(.22, WALL_Y - .06, (WALL_D + B - D) / 2);
      if (U) warm(A - .22, WALL_Y - .06, (WALL_D + C) / 2);
      if (il) {
        glow(il.x + .05, il.z + il.d - .05, il.w - .1, .02, PLINTH + CARCASS - .01);
        warm(il.x + il.w / 2, .45, il.z + il.d + .15, 1.4);
        // the pendants lit: one wider light under them onto the island top
        warm(il.x + il.w / 2, 1.5, il.z + il.d / 2, 2.2, 2.4, '#ffc98a');
      }
    }
    pool.forEach((l, i) => {
      const s = lit[i];
      l.intensity = s ? s[3] : 0;
      if (s) { l.position.set(s[0], s[1], s[2]); l.distance = s[4]; l.color.set(s[5]); }
    });

    // dimension tags in the room: walls along their top edge, the island over its top
    tags = [[`A · ${o.a} cm`, new THREE.Vector3(A / 2, ROOM_H + .08, -.05)]];
    if (L) tags.push([`B · ${o.b} cm`, new THREE.Vector3(-.05, ROOM_H + .08, B / 2)]);
    if (U) tags.push([`C · ${o.c} cm`, new THREE.Vector3(A + .05, ROOM_H + .08, C / 2)]);
    if (il) tags.push([`Ada · ${p.island.w} × ${p.island.h} cm`, new THREE.Vector3(il.x + il.w / 2, BASE_H + .12, il.z + il.d / 2)]);
    else if (p.islandNote) tags.push([p.islandNote, new THREE.Vector3(A / 2, .05, roomD * .7)]);
    tagLayer.innerHTML = tags.map(([text]) => `<span>${text}</span>`).join('');

    // frame the kitchen from the front at eye level: aim at the middle of the wall run, half room
    // height, and stand back just far enough to see the whole width and height (frame() below)
    const w = A, d = roomD;
    view.target.set(w / 2, 1.15, il ? (il.z + il.d) / 2 : .6);
    view.fit = { halfW: w / 2 + .45, halfH: (ROOM_H + .3) / 2, front: (il ? il.z + il.d + .6 : D + .4) - view.target.z };
    if (o.tip !== lastTip) { view.az = { duz: 0, l: .22, u: 0 }[o.tip]; view.el = .1; lastTip = o.tip; }
    // how far it may turn: never round behind a side wall
    AZ = { duz: [-1, 1], l: [-.15, .9], u: [-.45, .45] }[o.tip];
    frame();
    floor.position.set(w / 2, 0, d / 2);
    sun.position.set(w / 2 + 3, 6, d + 4); sun.target.position.copy(view.target);
    const sc = sun.shadow.camera, ext = Math.max(w, d) / 2 + 1.5;
    sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 1; sc.far = 20; sc.updateProjectionMatrix();
    renderer.shadowMap.needsUpdate = true;
    move();
  }

  // the distance at which the kitchen's width and height both fit the view, kept clear of the island
  function frame() {
    const f = view.fit; if (!f) return;
    const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), th = tv * camera.aspect;
    view.dist = Math.max(f.halfW / th, f.halfH / tv, f.front + 1.2) + .3;
  }

  // a change of options rebuilds the scene at most once per frame, however fast the slider moves
  let pending = null, buildFrame = 0;
  function update(o, p) {
    pending = [o, p];
    if (!buildFrame) buildFrame = requestAnimationFrame(() => { buildFrame = 0; build(...pending); });
  }

  // ambient occlusion on wide screens, loaded after the first plain frame
  let composer = null, settleTimer = 0;
  if (!phone) {
    Promise.all(['EffectComposer', 'RenderPass', 'GTAOPass', 'OutputPass'].map(n => import(`three/addons/postprocessing/${n}.js`)))
      .then(([{ EffectComposer }, { RenderPass }, { GTAOPass }, { OutputPass }]) => {
        const c = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
        c.addPass(new RenderPass(scene, camera));
        const gtao = new GTAOPass(scene, camera, 1, 1);
        gtao.updateGtaoMaterial({ radius: .25, distanceExponent: 1.5, thickness: 1, scale: 1.1, samples: 16 });
        c.addPass(gtao);
        c.addPass(new OutputPass());
        composer = c;
        resize();
      })
      .catch(err => console.warn('Ambient occlusion unavailable', err));
  }
  // while things move: the plain pass, at most once per frame; once still for a moment: the full one
  let moveFrame = 0;
  function move() {
    if (!moveFrame) moveFrame = requestAnimationFrame(() => { moveFrame = 0; render(true); });
    clearTimeout(settleTimer); settleTimer = setTimeout(settle, 180);
  }
  function settle() { clearTimeout(settleTimer); cancelAnimationFrame(moveFrame); moveFrame = 0; render(false); }

  function render(fast = false) {
    const { az, el, dist, target } = view;
    camera.position.set(target.x + Math.sin(az) * Math.cos(el) * dist, target.y + Math.sin(el) * dist, target.z + Math.cos(az) * Math.cos(el) * dist);
    camera.lookAt(target);
    if (composer && !fast) composer.render(); else renderer.render(scene, camera);
    // tags follow their 3D points; one that would overlap a tag already placed steps down below it
    const W = canvas.clientWidth, H = canvas.clientHeight, v = new THREE.Vector3(), placed = [];
    tags.forEach(([, point], i) => {
      const el = tagLayer.children[i];
      if (!el) return;
      v.copy(point).project(camera);
      const w = el.offsetWidth, h = el.offsetHeight;
      const x = Math.min(W - w - 6, Math.max(6, (v.x + 1) / 2 * W - w / 2));
      let y = Math.max(6, (1 - v.y) / 2 * H - h / 2);
      for (const r of placed) if (x < r.x + r.w + 4 && r.x < x + w + 4 && y < r.y + r.h + 4 && r.y < y + h + 4) y = r.y + r.h + 4;
      placed.push({ x, y, w, h });
      el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      el.hidden = v.z > 1;
    });
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    if (composer) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(w, h); }
    camera.aspect = w / h; camera.updateProjectionMatrix();
    frame();
    settle();
  }
  new ResizeObserver(resize).observe(canvas);

  // turning: horizontal drag sets the azimuth; a mouse drag also tilts. AZ (set per plan type in build)
  // keeps the open side towards us.
  const EL = [.03, .6];
  let drag = null;
  canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, az: view.az, el: view.el, id: e.pointerId, mouse: e.pointerType === 'mouse' }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    view.az = Math.min(AZ[1], Math.max(AZ[0], drag.az - (e.clientX - drag.x) * .006));
    if (drag.mouse) view.el = Math.min(EL[1], Math.max(EL[0], drag.el + (e.clientY - drag.y) * .004));
    move();
  });
  const end = () => { drag = null; };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('keydown', e => {
    const k = { ArrowLeft: [.1, 0], ArrowRight: [-.1, 0], ArrowUp: [0, .06], ArrowDown: [0, -.06] }[e.key];
    if (!k) return;
    e.preventDefault();
    view.az = Math.min(AZ[1], Math.max(AZ[0], view.az + k[0]));
    view.el = Math.min(EL[1], Math.max(EL[0], view.el + k[1]));
    move();
  });

  resize();
  return { update };
}

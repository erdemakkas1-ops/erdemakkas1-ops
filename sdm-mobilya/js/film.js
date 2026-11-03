// FILM: an L-shaped kitchen with an island, modelled in three.js and scrubbed by page scroll.
// Same engine as the Maviron Çelik demo: the stage is pinned, scroll progress maps to film seconds
// (data-map on #film), captions use data-from/data-to, notes use data-at (a 3D point in metres).
//
//   0–1.1   hero, the plan plots in on load
//   1.4–3.3 01 Keşif & Ölçü: dimension lines and chips
//   3.6–5.7 02 3D Tasarım: the parts appear as translucent volumes, the camera turns
//   6–8.2   03 Üretim & Montaj: carcasses, fronts, worktops and the island arrive; daylight comes on
//   8.5–10.2 Anatomi: labelled parts
//   10.5–12 evening: LEDs and pendants on, call to action
//
// Coordinates (metres): the back wall is the plane z = 0 and the left wall x = 0, y is up.
// Base units: 10 cm plinth, 72 cm carcass, 4 cm worktop; wall units from 145 to 217 cm.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const film = document.getElementById('film');
if (film && !film.classList.contains('film--static')) start().catch(err => {
  console.error(err);
  film.classList.add('film--static');
});

async function start() {
  const V3 = THREE.Vector3;
  const phone = innerWidth <= 760;
  const stage = film.querySelector('.film__stage');
  const canvas = film.querySelector('.film__canvas');
  const scenes = [...film.querySelectorAll('.film__scene')];
  const notes = [...film.querySelectorAll('.film__dim, .film__label')].map(el => ({
    el, at: new V3(...el.dataset.at.split(',').map(Number)), from: +el.dataset.from, to: +el.dataset.to,
    dim: el.classList.contains('film__dim'),
  }));
  const map = film.dataset.map.split(',').map(pair => pair.split(':').map(Number));

  const breathe = () => new Promise(r => setTimeout(r));
  const clamp = v => Math.min(1, Math.max(0, v));
  const smooth = v => (v = clamp(v), v * v * (3 - 2 * v));
  const span = (t, a, b) => smooth((t - a) / (b - a));
  const interp = (points, x) => {
    for (let k = 1; k < points.length; k++) {
      const [x0, y0] = points[k - 1], [x1, y1] = points[k];
      if (x <= x1) return y0 + (y1 - y0) * clamp((x - x0) / (x1 - x0));
    }
    return points[points.length - 1][1];
  };

  let cw = 1, ch = 1, current = 0, target = 0, animating = false, intro = 0, built = false;
  const tmp = new V3(), look = new V3();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, phone ? 1.25 : 1.5));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = phone ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // redrawn only when the daylight shadows can change

  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
  const DARK = new THREE.Color('#14110f'), LIGHT = new THREE.Color('#e9e3d9'), EVENING = new THREE.Color('#2a221c');
  scene.background = DARK.clone();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 80);

  // ---- textures ----
  const loader = new THREE.TextureLoader();
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const tex = (name, srgb, rep) => {
    const t = loader.load(`img/tex/${name}.webp`, () => { if (built) draw(); });
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = aniso;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    if (rep) t.repeat.set(...rep);
    return t;
  };
  const floorMaps = { map: tex('oak-diff', true, [5, 5]), roughnessMap: tex('oak-rough', false, [5, 5]), normalMap: tex('oak-nor', false, [5, 5]) };
  const walnutMap = tex('oak-diff', true, [.8, .8]);

  // marble drawn once on a canvas: soft wide veins under thin bright ones
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const marble = (base, vein) => {
    const c = document.createElement('canvas'); c.width = c.height = 1024;
    const k = c.getContext('2d');
    k.fillStyle = base; k.fillRect(0, 0, 1024, 1024);
    const draw = (alpha, width, blur, n) => {
      k.filter = blur ? `blur(${blur}px)` : 'none';
      for (let v = 0; v < n; v++) {
        k.strokeStyle = `rgba(${vein},${alpha * (.5 + rnd())})`; k.lineWidth = width * (.5 + rnd());
        k.beginPath(); let x = rnd() * 1024, y = -20; k.moveTo(x, y);
        while (y < 1044) { const nx = x + (rnd() - .45) * 140, ny = y + 30 + rnd() * 70; k.quadraticCurveTo(x + (rnd() - .5) * 80, (y + ny) / 2, nx, ny); x = nx; y = ny; }
        k.stroke();
      }
    };
    draw(.12, 16, 10, 6); draw(.25, 3, 1.5, 9); draw(.5, 1.2, 0, 12);
    k.filter = 'none';
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = aniso;
    return t;
  };
  const blackMarble = marble('#151413', '214,190,168');

  // ---- materials: one set per part, so each part fades on its own ----
  const M = {
    carcass: () => new THREE.MeshStandardMaterial({ color: '#e9e5de', roughness: .85 }),
    front: () => new THREE.MeshStandardMaterial({ color: '#33302d', roughness: .62 }),
    top: () => new THREE.MeshPhysicalMaterial({ map: blackMarble, roughness: .2, clearcoat: phone ? 0 : .5, clearcoatRoughness: .15 }),
    plinth: () => new THREE.MeshStandardMaterial({ color: '#1b1918', roughness: .7 }),
    brass: () => new THREE.MeshStandardMaterial({ color: '#c9a36a', roughness: .28, metalness: 1 }),
    black: () => new THREE.MeshStandardMaterial({ color: '#121212', roughness: .4, metalness: .2 }),
    glass: () => new THREE.MeshPhysicalMaterial({ color: '#0c0c0d', roughness: .06, clearcoat: 1, clearcoatRoughness: .04 }),
    burgundy: () => new THREE.MeshStandardMaterial({ color: '#6a2a25', roughness: .55 }),
    walnut: () => new THREE.MeshStandardMaterial({ map: walnutMap, color: '#8a5f40', roughness: .6 }),
    seat: () => new THREE.MeshStandardMaterial({ color: '#3a332e', roughness: .8 }),
    ceramic: () => new THREE.MeshStandardMaterial({ color: '#efe8dc', roughness: .35 }),
  };
  const ledMat = new THREE.MeshBasicMaterial({ color: '#ffd6a0' });
  const bulbMat = new THREE.MeshBasicMaterial({ color: '#fff0d4' });
  const fade = (m, o) => {
    const see = o < 1;
    if (m.transparent !== see) { m.transparent = see; m.needsUpdate = true; }
    m.opacity = o;
  };

  await breathe();

  // ---- parts ----
  const parts = [];
  const rbox = (w, h, d, r = .004) => new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 3, h / 3, d / 3));
  const mesh = (geo, mat, x, y, z) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.castShadow = m.receiveShadow = true;
    return m;
  };
  // a part is any object that arrives on its own; kind decides when and from where
  const part = (obj, kind, parent = scene) => {
    obj.userData.home = obj.position.clone();
    parent.add(obj);
    const mats = new Set();
    obj.traverse(o => { if (o.material) mats.add(o.material); });
    const p = { obj, kind, mats: [...mats], d: new V3() };
    parts.push(p);
    return p;
  };

  // shaker front, facing +z, centred on (0, 0): rails and stiles around a recessed panel
  const shaker = (w, h, mat) => {
    const g = new THREE.Group(), s = Math.min(.065, w * .16, h * .16), T = .02;
    const piece = (pw, ph, pd, x, y, z) => g.add(mesh(rbox(pw, ph, pd, .002), mat, x, y, z));
    piece(w, s, T, 0, h / 2 - s / 2, 0); piece(w, s, T, 0, -h / 2 + s / 2, 0);
    piece(s, h - 2 * s, T, -w / 2 + s / 2, 0, 0); piece(s, h - 2 * s, T, w / 2 - s / 2, 0, 0);
    piece(w - 2 * s + .004, h - 2 * s + .004, T * .55, 0, 0, -T * .3);
    return g;
  };
  const handle = (len, vertical, mat) => {
    const g = new THREE.Group();
    const bar = mesh(new THREE.CylinderGeometry(.006, .006, len, 12), mat, 0, 0, .032);
    if (!vertical) bar.rotation.z = Math.PI / 2;
    g.add(bar);
    for (const e of [-1, 1]) {
      const post = mesh(new THREE.CylinderGeometry(.004, .004, .03, 8), mat, vertical ? 0 : e * (len / 2 - .015), vertical ? e * (len / 2 - .015) : 0, .017);
      post.rotation.x = Math.PI / 2;
      g.add(post);
    }
    return g;
  };

  // two runs; each is a group whose local x runs along the wall and local +z points into the room
  const runA = new THREE.Group();                      // back wall, x 0 → 4.2
  const runB = new THREE.Group();                      // left wall, local x 0 → 1.8 = world z 2.4 → 0.6
  runB.rotation.y = Math.PI / 2; runB.position.set(0, 0, 2.4);
  scene.add(runA, runB);

  const D = .58, PL = .1, CH = .72, BASE = PL + CH, TOP = .04, WY = 1.45, WH = .72, WD = .35, TALL = WY + WH;
  const brassFor = [];  // brass parts get one shared timing later

  // a door or a drawer front with its handle, placed on a run
  const front = (run, x, y, w, h, z, vertical, handleAt) => {
    const mat = M.front();
    const g = shaker(w - .004, h - .004, mat);
    const hmat = M.brass();
    const hd = handle(vertical ? Math.min(.32, h * .4) : Math.min(.3, w * .5), vertical, hmat);
    hd.position.set(handleAt ? handleAt[0] : 0, handleAt ? handleAt[1] : h / 2 - .07, 0);
    g.add(hd);
    g.position.set(x + w / 2, y + h / 2, z + .01);
    return part(g, 'front', run);
  };
  const carcass = (run, x, w, y = PL, h = CH, d = D) =>
    part(mesh(rbox(w - .003, h, d, .003), M.carcass(), x + w / 2, y + h / 2, d / 2), 'carcass', run);
  const doors = (run, x, w, y, h, z, n = 1) => {
    const dw = w / n;
    for (let i = 0; i < n; i++) front(run, x + i * dw, y, dw, h, z, true, [n === 1 ? -dw / 2 + .05 : (i ? -dw / 2 + .05 : dw / 2 - .05), h / 2 - .2]);
  };
  const drawers = (run, x, w, hs) => {
    let y = PL;
    for (const h of hs) { front(run, x, y, w, h, D, false, [0, h / 2 - .05]); y += h; }
  };

  // run A: corner door, drawers, sink, drawers under the hob, a narrow door, oven and fridge columns
  carcass(runA, 0, .6); doors(runA, 0, .6, PL, CH, D);
  carcass(runA, .6, .6); drawers(runA, .6, .6, [.18, .27, .27]);
  carcass(runA, 1.2, .9); doors(runA, 1.2, .9, PL, CH, D, 2);
  carcass(runA, 2.1, .6); drawers(runA, 2.1, .6, [.24, .24, .24]);
  carcass(runA, 2.7, .3); doors(runA, 2.7, .3, PL, CH, D);
  carcass(runA, 3.0, .6, PL, TALL - PL); carcass(runA, 3.6, .6, PL, TALL - PL);
  doors(runA, 3.0, .6, PL, .74, D); doors(runA, 3.0, .6, 1.47, TALL - 1.47, D);
  {
    const oven = new THREE.Group();
    oven.add(mesh(rbox(.596, .62, .02, .004), M.glass(), 0, 0, 0));
    oven.add(mesh(new THREE.BoxGeometry(.5, .012, .012), M.brass(), 0, .25, .02));
    oven.position.set(3.3, .84 + .31, D + .01);
    part(oven, 'front', runA);
  }
  doors(runA, 3.6, .6, PL, 1.3, D); doors(runA, 3.6, .6, 1.4, TALL - 1.4, D);
  part(mesh(new THREE.BoxGeometry(3.0, PL - .01, D - .06), M.plinth(), 1.5, (PL - .01) / 2, (D - .06) / 2), 'carcass', runA);
  // wall units, the hood between them
  for (const [x, w, n] of [[0, .6, 1], [.6, .6, 1], [1.2, .9, 2], [2.7, .3, 1]]) {
    part(mesh(rbox(w - .003, WH, WD, .003), M.carcass(), x + w / 2, WY + WH / 2, WD / 2), 'wall', runA);
    const dw = w / n;
    for (let i = 0; i < n; i++) {
      const p = front(runA, x + i * dw, WY, dw, WH, WD, true, [n === 1 ? (x < .6 ? dw / 2 - .05 : -dw / 2 + .05) : (i ? -dw / 2 + .05 : dw / 2 - .05), -WH / 2 + .2]);
      p.kind = 'wallfront';
    }
  }
  part(mesh(rbox(.6, .57, .46, .006), M.black(), 2.4, 1.6 + .285, .23), 'wall', runA);
  // worktop, black marble splash, hob, sink, tap
  part(mesh(rbox(3.0, TOP, D + .04, .004), M.top(), 1.5, BASE + TOP / 2, (D + .04) / 2), 'top', runA);
  part(mesh(new THREE.BoxGeometry(3.0, WY - BASE - TOP, .015), M.top(), 1.5, (BASE + TOP + WY) / 2, .0075), 'top', runA);
  part(mesh(rbox(.56, .008, .5, .003), M.glass(), 2.4, BASE + TOP + .004, .3), 'fixture', runA);
  part(mesh(rbox(.6, .006, .42, .003), M.black(), 1.65, BASE + TOP + .003, .3), 'fixture', runA);
  {
    const tap = new THREE.Group(), mat = M.brass();
    tap.add(mesh(new THREE.CylinderGeometry(.016, .02, .3, 16), mat, 0, .15, 0));
    const arc = mesh(new THREE.TorusGeometry(.09, .011, 10, 24, Math.PI), mat, 0, .3, .09);
    arc.rotation.y = Math.PI / 2;
    tap.add(arc);
    tap.add(mesh(new THREE.CylinderGeometry(.011, .011, .07, 12), mat, 0, .265, .18));
    tap.position.set(1.65, BASE + TOP, .06);
    part(tap, 'fixture', runA);
  }
  // LED strip under the wall units
  for (const [x, w] of [[0, 2.1], [2.7, .3]]) part(mesh(new THREE.BoxGeometry(w - .04, .008, .012), ledMat, x + w / 2, WY - .006, WD - .04), 'led', runA);

  // run B: drawers and two doors under a walnut shelf
  carcass(runB, 0, .6); doors(runB, 0, .6, PL, CH, D);
  carcass(runB, .6, .6); doors(runB, .6, .6, PL, CH, D);
  carcass(runB, 1.2, .6); drawers(runB, 1.2, .6, [.18, .27, .27]);
  part(mesh(new THREE.BoxGeometry(1.8, PL - .01, D - .06), M.plinth(), .9, (PL - .01) / 2, (D - .06) / 2), 'carcass', runB);
  part(mesh(rbox(1.8 - .02, TOP, D + .04, .004), M.top(), .9, BASE + TOP / 2, (D + .04) / 2), 'top', runB);
  part(mesh(new THREE.BoxGeometry(1.8, WY - BASE - TOP, .015), M.top(), .9, (BASE + TOP + WY) / 2, .0075), 'top', runB);
  part(mesh(rbox(1.6, .04, .26, .004), M.walnut(), .9, 1.62, .13), 'wall', runB);
  part(mesh(new THREE.BoxGeometry(1.5, .008, .012), ledMat, .9, 1.595, .2), 'led', runB);

  // island: black marble top with waterfall ends, burgundy fluted panels front and back
  const ISL = { x: 2.15, z: 2.15, w: 1.9, d: .95 };
  const island = new THREE.Group();
  island.position.set(ISL.x, 0, ISL.z);
  scene.add(island);
  part(mesh(rbox(ISL.w - .1, BASE - .02, ISL.d - .08, .003), M.carcass(), 0, (BASE - .02) / 2, 0), 'carcass', island);
  for (const side of [-1, 1]) {
    const slats = Math.floor((ISL.w - .1) / .034);
    const geo = rbox(.026, BASE - .03, .022, .008);
    const flute = new THREE.InstancedMesh(geo, M.burgundy(), slats);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < slats; i++) {
      m4.makeTranslation(-(ISL.w - .1) / 2 + .017 + i * .034, (BASE - .03) / 2 + .01, side * (ISL.d / 2 - .03));
      flute.setMatrixAt(i, m4);
    }
    flute.castShadow = flute.receiveShadow = true;
    part(flute, side > 0 ? 'island' : 'islandback', island);
  }
  part(mesh(rbox(ISL.w, TOP, ISL.d, .004), M.top(), 0, BASE + TOP / 2, 0), 'islandtop', island);
  for (const side of [-1, 1]) part(mesh(rbox(TOP, BASE, ISL.d, .004), M.top(), side * (ISL.w / 2 - TOP / 2), BASE / 2, 0), 'islandtop', island);

  // pendants (brass domes on long cords) and their warm lights
  const pendLights = [];
  for (const x of [-.4, .4]) {
    const g = new THREE.Group(), mat = M.brass();
    g.add(mesh(new THREE.CylinderGeometry(.003, .003, .8, 6), M.black(), 0, .4, 0));
    const dome = mesh(new THREE.SphereGeometry(.15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat, 0, 0, 0);
    dome.material.side = THREE.DoubleSide;
    g.add(dome);
    g.add(mesh(new THREE.SphereGeometry(.035, 16, 8), bulbMat, 0, -.01, 0));
    g.position.set(ISL.x + x, 1.95, ISL.z);
    part(g, 'pendant');
    const l = new THREE.PointLight('#ffc98f', 0, 4, 2);
    l.position.set(ISL.x + x, 1.88, ISL.z);
    scene.add(l); pendLights.push(l);
  }
  // stools in front of the island
  for (const x of [-.45, .35]) {
    const g = new THREE.Group(), legMat = M.black();
    g.add(mesh(new THREE.CylinderGeometry(.19, .17, .06, 28), M.seat(), 0, .7, 0));
    for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2 + Math.PI / 4, leg = mesh(new THREE.CylinderGeometry(.012, .012, .7, 8), legMat, Math.cos(a) * .13, .35, Math.sin(a) * .13);
      leg.rotation.set(Math.sin(a) * .1, 0, -Math.cos(a) * .1);
      g.add(leg);
    }
    g.add(mesh(new THREE.TorusGeometry(.14, .008, 8, 32), legMat, 0, .25, 0)).children.at(-1).rotation.x = Math.PI / 2;
    g.position.set(ISL.x + x, 0, ISL.z + ISL.d / 2 + .38);
    part(g, 'stool');
  }
  // a few things on the worktop and island
  {
    const bowl = mesh(new THREE.SphereGeometry(.13, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.ceramic(), ISL.x + .5, BASE + TOP + .12, ISL.z - .1);
    bowl.material.side = THREE.DoubleSide;
    part(bowl, 'decor');
    part(mesh(rbox(.42, .025, .3, .006), M.walnut(), .9, BASE + TOP + .0125, .22), 'decor', runA);
    for (const [x, h] of [[.3, .2], [.42, .15]]) part(mesh(new THREE.CylinderGeometry(.05, .05, h, 24), M.ceramic(), x, BASE + TOP + h / 2, .18), 'decor', runA);
  }

  // LED and under-shelf lights (a fixed pool: lights are dimmed, never added, so no shader recompiles)
  const ledLights = [[.5, .3], [1.6, .3], [2.85, .3]].map(([x, z]) => {
    const l = new THREE.PointLight('#ffcf98', 0, 2.2, 2);
    l.position.set(x, WY - .05, z); scene.add(l); return l;
  });
  {
    const l = new THREE.PointLight('#ffcf98', 0, 2, 2);
    l.position.set(.3, 1.55, 1.5); scene.add(l); ledLights.push(l);
  }

  // ---- room: floor, back and left walls facing inward, a tall window on the back wall ----
  const room = new THREE.Group(), roomMats = [];
  const floorMat = new THREE.MeshStandardMaterial({ ...floorMaps, color: '#f1e4d2', roughness: 1, normalScale: new THREE.Vector2(.5, .5) });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), floorMat);
  floor.rotation.x = -Math.PI / 2; floor.position.set(2.5, 0, 3); floor.receiveShadow = true;
  room.add(floor);
  const wallMat = new THREE.MeshStandardMaterial({ color: '#e7e0d5', roughness: .95 });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(12, 2.7), wallMat);
  back.position.set(4, 1.35, 0); back.receiveShadow = true; room.add(back);
  const left = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.7), wallMat);
  left.rotation.y = Math.PI / 2; left.position.set(0, 1.35, 4); left.receiveShadow = true; room.add(left);
  const frameMat = new THREE.MeshStandardMaterial({ color: '#1b1a19', roughness: .5 });
  const glowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 3.1, 2.9) });
  {
    const win = new THREE.Group(), w = 1.6, h = 2.2, y0 = .3;
    win.add(mesh(new THREE.PlaneGeometry(w, h), glowMat, 0, y0 + h / 2, .002));
    const bar = (bw, bh, x, y) => win.add(mesh(new THREE.BoxGeometry(bw, bh, .05), frameMat, x, y, .025));
    bar(w + .05, .05, 0, y0); bar(w + .05, .05, 0, y0 + h); bar(.035, h, 0, y0 + h / 2);
    bar(.05, h, -w / 2, y0 + h / 2); bar(.05, h, w / 2, y0 + h / 2); bar(w, .035, 0, y0 + h * .7);
    win.position.set(5.3, 0, 0);
    room.add(win);
  }
  roomMats.push(floorMat, wallMat, frameMat, glowMat);
  scene.add(room);

  await breathe();

  // ---- blueprint: each part's box, plotted in build order; and the same boxes as 3D-design volumes ----
  scene.updateMatrixWorld(true);
  const edgeVerts = [], ghostGeos = [];
  const box = new THREE.Box3(), size = new V3(), centre = new V3();
  for (const p of parts) {
    if (p.kind === 'led' || p.kind === 'decor') continue;
    box.setFromObject(p.obj);
    box.getSize(size); box.getCenter(centre);
    const g = new THREE.BoxGeometry(size.x, size.y, size.z).translate(centre.x, centre.y, centre.z);
    edgeVerts.push(...new THREE.EdgesGeometry(g).attributes.position.array);
    if (size.x * size.y * size.z > .004) ghostGeos.push(g);
  }
  const blueGeo = new THREE.BufferGeometry();
  blueGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgeVerts, 3));
  const blueMat = new THREE.LineBasicMaterial({ color: '#e2c391', transparent: true, depthWrite: false });
  const blueprint = new THREE.LineSegments(blueGeo, blueMat);
  blueprint.renderOrder = 2;
  scene.add(blueprint);
  const blueCount = edgeVerts.length / 3;

  const ghostMat = new THREE.MeshStandardMaterial({ color: '#e9d6b4', roughness: .6, transparent: true, opacity: 0, depthWrite: false, emissive: '#5a4126', emissiveIntensity: .6 });
  const ghosts = new THREE.Group();
  for (const g of ghostGeos) ghosts.add(new THREE.Mesh(g, ghostMat));
  scene.add(ghosts);

  const grid = new THREE.GridHelper(14, 56, '#5a4a3a', '#2c241e');
  grid.position.set(2.5, .002, 3);
  grid.material.transparent = true; grid.material.depthWrite = false;
  scene.add(grid);

  // dimension lines with end ticks (Keşif & Ölçü)
  const dimVerts = [];
  const dim = (a, b, tick) => {
    dimVerts.push(...a, ...b);
    for (const q of [a, b]) dimVerts.push(q[0] - tick[0], q[1] - tick[1], q[2] - tick[2], q[0] + tick[0], q[1] + tick[1], q[2] + tick[2]);
  };
  dim([0, 2.75, .05], [4.2, 2.75, .05], [0, .07, 0]);
  dim([.05, 2.75, 0], [.05, 2.75, 2.4], [0, .07, 0]);
  dim([4.45, 0, .05], [4.45, 2.7, .05], [.07, 0, 0]);
  {
    const x0 = ISL.x - ISL.w / 2, x1 = ISL.x + ISL.w / 2, z0 = ISL.z - ISL.d / 2, z1 = ISL.z + ISL.d / 2, y = .01;
    dimVerts.push(x0, y, z0, x1, y, z0, x1, y, z0, x1, y, z1, x1, y, z1, x0, y, z1, x0, y, z1, x0, y, z0);
    dim([x0, y, z1 + .35], [x1, y, z1 + .35], [0, 0, .07]);
  }
  const dimGeo = new THREE.BufferGeometry();
  dimGeo.setAttribute('position', new THREE.Float32BufferAttribute(dimVerts, 3));
  const dimMat = new THREE.LineBasicMaterial({ color: '#f1e3c8', transparent: true, opacity: 0, depthWrite: false });
  scene.add(new THREE.LineSegments(dimGeo, dimMat));

  // ---- light ----
  const hemi = new THREE.HemisphereLight('#f4ece0', '#3a2d22', .6);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff2df', 0);
  sun.position.set(7, 6.5, 6.5); sun.target.position.set(2, .5, 1.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(phone ? 1024 : 2048, phone ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 22 });
  sun.shadow.bias = -.0003; sun.shadow.normalBias = .02;
  scene.add(sun, sun.target);
  const rim = new THREE.DirectionalLight('#ffd9a8', 1.4);
  rim.position.set(-3, 5, 6);
  scene.add(rim);
  const DUSK = new THREE.Color('#ffc9a0');

  // ---- build order (film seconds) and where each kind comes from ----
  const ofKind = k => parts.filter(p => p.kind === k);
  const seq = (list, t0, t1, dur, d) => list.forEach((p, k) => { p.t0 = t0 + k / Math.max(1, list.length) * (t1 - t0); p.dur = dur; p.d.set(...d); });
  seq(ofKind('carcass'), 5.9, 6.9, .45, [0, .6, 0]);
  seq(ofKind('wall'), 6.5, 7.1, .45, [0, .5, 0]);
  seq(ofKind('front'), 6.8, 7.7, .4, [0, 0, .45]);
  seq(ofKind('wallfront'), 7.2, 7.8, .4, [0, 0, .4]);
  seq(ofKind('top'), 7.4, 7.9, .45, [0, .4, 0]);
  seq(ofKind('island'), 7.3, 7.5, .5, [0, 0, .5]);
  seq(ofKind('islandback'), 7.3, 7.5, .5, [0, 0, -.5]);
  seq(ofKind('islandtop'), 7.7, 8, .5, [0, .45, 0]);
  seq(ofKind('fixture'), 7.9, 8.3, .4, [0, .25, 0]);
  seq(ofKind('pendant'), 8, 8.2, .6, [0, .7, 0]);
  seq(ofKind('stool'), 8.1, 8.3, .5, [0, 0, .6]);
  seq(ofKind('decor'), 8.2, 8.4, .4, [0, .15, 0]);
  seq(ofKind('led'), 7.9, 8.1, .3, [0, 0, 0]);

  // ---- camera path: film seconds → position / look-at ----
  const shots = [
    [0, [7.4, 5.4, 7.6], [2.1, .8, 1.3]],
    [2.6, [2.3, 8.2, 5.2], [2.1, 0, 1.4]],
    [5, [-1.6, 3.2, 6.8], [1.9, 1, 1.1]],
    [7.4, [6.6, 2.4, 6.4], [2, 1, 1.1]],
    [9.6, [5.7, 1.95, 6.1], [1.9, 1.05, 1.2]],
    [12, [6.2, 2.05, 6.9], [2, 1.1, 1.1]],
  ];
  const posCurve = new THREE.CatmullRomCurve3(shots.map(s => new V3(...s[1])), false, 'centripetal');
  const tgtCurve = new THREE.CatmullRomCurve3(shots.map(s => new V3(...s[2])), false, 'centripetal');
  const pathU = t => {
    for (let s = 1; s < shots.length; s++)
      if (t <= shots[s][0]) return (s - 1 + smooth((t - shots[s - 1][0]) / (shots[s][0] - shots[s - 1][0]))) / (shots.length - 1);
    return 1;
  };

  let shadowT = -1;
  function frame(t) {
    const u = pathU(t);
    posCurve.getPoint(u, tmp); tgtCurve.getPoint(u, look);
    const aspect = cw / ch;
    const pull = aspect < 1 ? 1 + (1 - aspect) * 1.6 : aspect < 1.5 ? 1.12 : 1;
    camera.position.copy(look).add(tmp.sub(look).multiplyScalar(pull));
    camera.lookAt(look);
    // leave room for the copy: on the left on wide screens, at the bottom on tall ones
    if (aspect < 1) camera.setViewOffset(cw, ch, 0, ch * .2, cw, ch);
    else camera.setViewOffset(cw, ch, -cw * (aspect > 1.3 ? .17 : .08), 0, cw, ch);

    // the plan plots in on load and stays until the room is built
    blueGeo.setDrawRange(0, Math.floor(blueCount * intro / 2) * 2);
    blueMat.opacity = .95 - .7 * span(t, 3.6, 5) - .25 * span(t, 6.5, 8.2);
    grid.material.opacity = (1 - span(t, 6.4, 7.8)) * smooth(intro * 1.5) * .8;
    dimMat.opacity = span(t, 1.3, 1.9) * (1 - span(t, 3.3, 3.8));
    ghostMat.opacity = .3 * span(t, 3.5, 4.4) * (1 - span(t, 6.2, 7.6));
    ghosts.visible = ghostMat.opacity > .001;

    for (const p of parts) {
      const k = span(t, p.t0, p.t0 + p.dur);
      p.obj.visible = k > 0;
      if (!p.obj.visible) continue;
      for (const m of p.mats) if (m !== ledMat && m !== bulbMat) fade(m, k);
      const h = p.obj.userData.home;
      p.obj.position.set(h.x + p.d.x * (1 - k), h.y + p.d.y * (1 - k), h.z + p.d.z * (1 - k));
    }

    // dark plan → daylight → evening
    const day = span(t, 6.6, 8.2), dusk = span(t, 10.1, 11.6);
    scene.background.copy(DARK).lerp(LIGHT, day).lerp(EVENING, dusk * .85);
    for (const m of roomMats) fade(m, day);
    room.visible = day > 0;
    glowMat.color.setRGB(3.2 - 2.4 * dusk, 3.1 - 2.5 * dusk, 2.9 - 2.5 * dusk);
    sun.intensity = (3.6 - 2.9 * dusk) * day;
    sun.color.set('#fff2df').lerp(DUSK, dusk);
    hemi.intensity = .6 + .4 * day - .7 * dusk;
    rim.intensity = 1.4 * (1 - day);
    scene.environmentIntensity = .9 - .2 * day - .45 * dusk;
    const glow = span(t, 8, 8.6) * (.25 + .75 * dusk);
    ledMat.color.setRGB(1 + 2.5 * glow, .84 + 1.9 * glow, .63 + 1.1 * glow);
    bulbMat.color.setRGB(1 + 3 * dusk, .94 + 2.4 * dusk, .83 + 1.6 * dusk);
    for (const l of ledLights) l.intensity = 2.2 * glow;
    for (const l of pendLights) l.intensity = 5 * dusk;
    film.classList.toggle('is-light', day > .55 && dusk < .5);

    renderer.shadowMap.needsUpdate = day > 0 && t !== shadowT;
    if (renderer.shadowMap.needsUpdate) shadowT = t;
    renderer.render(scene, camera);
  }

  // notes follow their 3D points
  function place(t) {
    for (const n of notes) {
      const o = Math.min(clamp((t - n.from) / .3), clamp((n.to - t) / .3));
      n.el.style.opacity = o.toFixed(3);
      if (o <= 0) continue;
      tmp.copy(n.at).project(camera);
      const x = n.dim ? Math.min(cw - 64, Math.max(64, (tmp.x + 1) / 2 * cw)) : (tmp.x + 1) / 2 * cw;
      n.el.style.transform = `translate(${x.toFixed(1)}px, ${((1 - tmp.y) / 2 * ch).toFixed(1)}px)`;
      if (n.dim) continue;
      n.el.style.setProperty('--o', o.toFixed(3));
      n.el.classList.toggle('film__label--left', x > cw * .6);
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

  function draw() { frame(current); place(current); captions(current); }

  const resize = () => {
    cw = canvas.clientWidth; ch = canvas.clientHeight;
    renderer.setSize(cw, ch, false);
    camera.aspect = cw / ch;
    camera.updateProjectionMatrix();
    draw();
  };

  // compile every shader (opaque and fading variants) before the film shows, so nothing stalls mid-scroll
  {
    resize();
    const hidden = [], mats = new Set();
    scene.traverse(o => {
      if (!o.visible) { hidden.push(o); o.visible = true; }
      if (o.material) [].concat(o.material).forEach(m => mats.add(m));
    });
    const was = new Map([...mats].map(m => [m, m.transparent]));
    for (const see of [true, false]) {
      mats.forEach(m => { m.transparent = see; m.needsUpdate = true; });
      await renderer.compileAsync(scene, camera);
    }
    mats.forEach(m => { m.transparent = was.get(m); m.needsUpdate = true; });
    hidden.forEach(o => { o.visible = false; });
    await breathe();
  }
  built = true;

  const update = () => {
    const p = clamp(-film.getBoundingClientRect().top / (film.offsetHeight - stage.offsetHeight));
    target = interp(map, p);
    film.classList.toggle('is-scrolled', p > .01);
    if (!animating) { animating = true; requestAnimationFrame(tick); }
  };
  // ease the playhead toward the scroll position so coarse wheel steps still read as motion
  function tick() {
    current += (target - current) * .18;
    if (Math.abs(target - current) < .002) current = target;
    draw();
    if (current !== target) requestAnimationFrame(tick); else animating = false;
  }

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', resize);
  resize();
  film.classList.add('is-ready');

  // intro: the plan plots in once, on load
  const t0 = performance.now();
  (function plot(now) {
    intro = smooth((now - t0) / 1800);
    if (!animating) draw();
    if (intro < 1) requestAnimationFrame(plot);
  })(t0);
  update();

  // ?capture: __film.seek(t) jumps to a film second (for posters and checks)
  if (/[?&]capture\b/.test(location.search)) window.__film = { seek: t => { current = target = t; intro = 1; draw(); } };
}

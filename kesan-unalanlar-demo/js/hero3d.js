import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';

const H = 2.7; // duvar yüksekliği (m)
const SLAB = 0.35; // zemin betonu kalınlığı
const T = 0.14; // panel kalınlığı

const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...opts });

const M = {
  beton: mat('#a7a39b', { roughness: 0.95 }),
  celik: mat('#9fb0ba', { metalness: 0.65, roughness: 0.35 }),
  panel: mat('#ece6da', { roughness: 0.85 }),
  supurgelik: mat('#3a3d40'),
  cati: mat('#8e4a36', { roughness: 0.7, side: THREE.DoubleSide }),
  catiAlt: mat('#d8d0c2', { side: THREE.DoubleSide }),
  cerceve: mat('#f7f5f0', { roughness: 0.5 }),
  cam: mat('#2b3a4a', { metalness: 0.4, roughness: 0.1, emissive: '#ffc77a', emissiveIntensity: 0 }),
  kapi: mat('#6b4a33', { roughness: 0.6 }),
  ahsap: mat('#a07650', { roughness: 0.75 }),
  ahsapKoyu: mat('#7a5a3e'),
  tas: mat('#bdb6aa', { roughness: 1 }),
  cimen: mat('#4a5a3b', { roughness: 1 }),
  toprak: mat('#6d5a45', { roughness: 1 }),
  govde: mat('#5b4634'),
  yaprak: [mat('#56703f', { flatShading: true }), mat('#6b8048', { flatShading: true }), mat('#47613a', { flatShading: true })],
  lamba: mat('#fff1d6', { emissive: '#ffcf8a', emissiveIntensity: 0 }),
};

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// Açıklıklı duvar: yerel x ekseni boyunca uzunluk, y yukarı, z kalınlık.
function duvar(len, openings) {
  const wall = new THREE.Group();
  const finish = new THREE.Group();
  let cursor = -len / 2;
  const sorted = [...openings].sort((a, b) => a.c - b.c);
  for (const o of sorted) {
    const a = o.c - len / 2 - o.w / 2;
    const b = a + o.w;
    if (a > cursor) wall.add(box(a - cursor, H, T, M.panel, (cursor + a) / 2, SLAB + H / 2));
    if (o.sill > 0) wall.add(box(o.w, o.sill, T, M.panel, (a + b) / 2, SLAB + o.sill / 2));
    const top = o.sill + o.h;
    if (top < H) wall.add(box(o.w, H - top, T, M.panel, (a + b) / 2, SLAB + top + (H - top) / 2));
    cursor = b;

    // Doğrama
    const cx = (a + b) / 2;
    const cy = SLAB + o.sill + o.h / 2;
    const f = 0.06;
    finish.add(box(o.w, f, T + 0.04, M.cerceve, cx, SLAB + o.sill + f / 2));
    finish.add(box(o.w, f, T + 0.04, M.cerceve, cx, SLAB + top - f / 2));
    finish.add(box(f, o.h, T + 0.04, M.cerceve, a + f / 2, cy));
    finish.add(box(f, o.h, T + 0.04, M.cerceve, b - f / 2, cy));
    if (o.kapi) {
      finish.add(box(o.w - 2 * f, o.h - f, 0.05, M.kapi, cx, cy - f / 2, 0.02));
    } else {
      finish.add(box(o.w - 2 * f, o.h - 2 * f, 0.03, M.cam, cx, cy));
      finish.add(box(f * 0.7, o.h - 2 * f, T + 0.03, M.cerceve, cx, cy));
      finish.add(box(o.w + 0.1, 0.05, 0.22, M.cerceve, cx, SLAB + o.sill - 0.02, 0.06));
    }
  }
  if (cursor < len / 2) wall.add(box(len / 2 - cursor, H, T, M.panel, (cursor + len / 2) / 2, SLAB + H / 2));
  // Süpürgelik bandı
  wall.add(box(len + 0.02, 0.28, T + 0.03, M.supurgelik, 0, SLAB + 0.14));
  return { wall, finish };
}

function esitDagit(start, end, n, w) {
  const out = [];
  if (n <= 0) return out;
  const step = (end - start) / n;
  for (let i = 0; i < n; i++) out.push(start + step * (i + 0.5));
  return out.filter((c) => c - w / 2 >= start + 0.25 && c + w / 2 <= end - 0.25);
}

function evOlustur(model) {
  const { w, d } = model;
  const veranda = model.odalar.find((o) => o.disari)?.r[0];
  const stages = Array.from({ length: 5 }, () => new THREE.Group());

  // 0 — Zemin betonu
  stages[0].add(box(w + 0.5, SLAB, d + 0.5, M.beton, 0, SLAB / 2, 0));

  // 1 — Çelik iskelet
  const kolonlar = [];
  const nx = Math.ceil(w / 2.4);
  const nz = Math.ceil(d / 2.4);
  for (let i = 0; i <= nx; i++) {
    const x = -w / 2 + T / 2 + (i * (w - T)) / nx;
    kolonlar.push([x, -d / 2 + T / 2], [x, d / 2 - T / 2]);
  }
  for (let j = 1; j < nz; j++) {
    const z = -d / 2 + T / 2 + (j * (d - T)) / nz;
    kolonlar.push([-w / 2 + T / 2, z], [w / 2 - T / 2, z]);
  }
  for (const [x, z] of kolonlar) stages[1].add(box(0.1, H, 0.1, M.celik, x, SLAB + H / 2, z));
  for (const y of [SLAB + 0.05, SLAB + H - 0.06]) {
    stages[1].add(box(w, 0.12, 0.1, M.celik, 0, y, -d / 2 + T / 2));
    stages[1].add(box(w, 0.12, 0.1, M.celik, 0, y, d / 2 - T / 2));
    stages[1].add(box(0.1, 0.12, d, M.celik, -w / 2 + T / 2, y, 0));
    stages[1].add(box(0.1, 0.12, d, M.celik, w / 2 - T / 2, y, 0));
  }

  // 2 — Paneller (açıklıklarla), 4 — doğramalar
  const vx = veranda ? veranda[0] : 0;
  const vw = veranda ? veranda[2] : 3;
  const onAcik = [
    { c: vx + vw * 0.28, w: 1.9, sill: 0.45, h: 1.75 },
    { c: vx + vw * 0.74, w: 1.0, sill: 0, h: 2.15, kapi: true },
    ...esitDagit(vx + vw, w, Math.round((w - vx - vw) / 3.2), 1.4).map((c) => ({ c, w: 1.4, sill: 0.9, h: 1.3 })),
  ];
  const arkaAcik = esitDagit(0, w, Math.max(2, Math.round(w / 3.4)), 1.1).map((c) => ({ c, w: 1.1, sill: 1.0, h: 1.1 }));
  const yanAcik = esitDagit(0, d - 2 * T, Math.max(1, Math.round(d / 4.5)), 1.2).map((c) => ({ c, w: 1.2, sill: 0.9, h: 1.3 }));

  const cepheler = [
    { len: w, acik: onAcik, pos: [0, d / 2 - T / 2], rot: 0 },
    { len: w, acik: arkaAcik, pos: [0, -d / 2 + T / 2], rot: Math.PI },
    { len: d - 2 * T, acik: yanAcik, pos: [-w / 2 + T / 2, 0], rot: -Math.PI / 2 },
    { len: d - 2 * T, acik: yanAcik, pos: [w / 2 - T / 2, 0], rot: Math.PI / 2 },
  ];
  for (const c of cepheler) {
    const { wall, finish } = duvar(c.len, c.acik);
    for (const [g, s] of [[wall, 2], [finish, 4]]) {
      g.position.set(c.pos[0], 0, c.pos[1]);
      g.rotation.y = c.rot;
      stages[s].add(g);
    }
  }

  // 3 — Çatı
  const o = 0.55;
  const ex = w / 2 + o;
  const ez = d / 2 + o;
  const y0 = SLAB + H;
  if (model.cati === 'tek') {
    const egim = THREE.MathUtils.degToRad(9);
    const rise = 2 * ez * Math.tan(egim);
    const roof = box(2 * ex, 0.14, (2 * ez) / Math.cos(egim), M.cati, 0, y0 + rise / 2 + 0.07, 0);
    roof.rotation.x = egim;
    stages[3].add(roof);
    // Yan üçgenler
    const tri = new THREE.Shape();
    const tan = Math.tan(egim);
    tri.moveTo(-d / 2, 0);
    tri.lineTo(d / 2, 0);
    tri.lineTo(d / 2, o * tan);
    tri.lineTo(-d / 2, (d / 2 + ez) * tan);
    tri.closePath();
    const triGeo = new THREE.ExtrudeGeometry(tri, { depth: T, bevelEnabled: false });
    for (const sx of [-1, 1]) {
      const m = new THREE.Mesh(triGeo, M.panel);
      m.rotation.y = Math.PI / 2;
      m.position.set(sx * (w / 2) - (sx > 0 ? T : 0), y0, 0);
      m.scale.x = -1;
      m.castShadow = true;
      stages[3].add(m);
    }
    for (let i = 0; i <= nx; i++) {
      const x = -w / 2 + (i * w) / nx;
      const r = box(0.08, 0.16, (2 * ez) / Math.cos(egim), M.celik, x, y0 + rise / 2 - 0.05, 0);
      r.rotation.x = egim;
      stages[1].add(r);
    }
  } else {
    const egim = THREE.MathUtils.degToRad(24);
    const h = ez * Math.tan(egim);
    const rx = Math.max(ex - ez, 0.3);
    const v = [
      [-ex, y0, ez], [ex, y0, ez], [ex, y0, -ez], [-ex, y0, -ez],
      [-rx, y0 + h, 0], [rx, y0 + h, 0],
    ];
    const faces = [
      [0, 1, 5], [0, 5, 4], // ön
      [2, 3, 4], [2, 4, 5], // arka
      [1, 2, 5], // sağ
      [3, 0, 4], // sol
    ];
    const pos = [];
    for (const f of faces) for (const i of f) pos.push(...v[i]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.computeVertexNormals();
    const roof = new THREE.Mesh(geo, M.cati);
    roof.castShadow = true;
    roof.receiveShadow = true;
    stages[3].add(roof);
    // Saçak altı
    stages[3].add(box(2 * ex, 0.04, 2 * ez, M.catiAlt, 0, y0 - 0.02, 0));
    // Mahya
    const mahya = box(2 * rx + 0.1, 0.1, 0.18, M.supurgelik, 0, y0 + h + 0.03, 0);
    stages[3].add(mahya);
    // Makas kirişleri (iskelet aşamasında görünür)
    const L = Math.hypot(ez, h);
    for (let i = 0; i <= nx; i++) {
      const x = -w / 2 + T / 2 + (i * (w - T)) / nx;
      if (Math.abs(x) > rx + 0.05) continue;
      for (const s of [-1, 1]) {
        const r = box(0.08, 0.14, L, M.celik, x, y0 + h / 2, (s * ez) / 2);
        r.rotation.x = s * egim;
        stages[1].add(r);
      }
      stages[1].add(box(0.08, h, 0.08, M.celik, x, y0 + h / 2, 0));
    }
    stages[1].add(box(2 * rx, 0.12, 0.1, M.celik, 0, y0 + h - 0.06, 0));
  }

  // 4 — Veranda, basamak, peyzaj
  if (veranda) {
    const [x, y, vw2, vd] = veranda;
    const X = x - w / 2 + vw2 / 2;
    const Z = y - d / 2 + vd / 2;
    const plank = 0.18;
    for (let i = 0; i < Math.floor(vd / plank); i++) {
      stages[4].add(box(vw2, 0.06, plank - 0.025, M.ahsap, X, SLAB - 0.03, y - d / 2 + plank * (i + 0.5)));
    }
    stages[4].add(box(vw2, SLAB - 0.06, vd, M.ahsapKoyu, X, (SLAB - 0.06) / 2, Z));
    const px = [x - w / 2 + 0.1, x - w / 2 + vw2 - 0.1];
    const pz = y - d / 2 + vd - 0.1;
    for (const p of px) stages[4].add(box(0.12, H, 0.12, M.ahsapKoyu, p, SLAB + H / 2, pz));
    stages[4].add(box(vw2 + 0.2, 0.14, 0.14, M.ahsapKoyu, X, SLAB + H, pz));
    for (let i = 0; i < 7; i++) {
      stages[4].add(box(0.06, 0.12, vd + 0.2, M.ahsap, x - w / 2 + 0.15 + (i * (vw2 - 0.3)) / 6, SLAB + H + 0.1, Z));
    }
    // Basamak
    stages[4].add(box(1.4, SLAB / 2, 0.4, M.tas, x - w / 2 + vw2 * 0.74, SLAB / 4, y - d / 2 + vd + 0.2));
    // Patika taşları
    for (let i = 0; i < 6; i++) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.06, 7), M.tas);
      s.position.set(x - w / 2 + vw2 * 0.74 + Math.sin(i * 1.3) * 0.25, 0.03, y - d / 2 + vd + 0.9 + i * 0.85);
      s.receiveShadow = true;
      stages[4].add(s);
    }
    // Aplik
    const lamp = box(0.14, 0.22, 0.1, M.lamba, x - w / 2 + vw2 * 0.74 + 0.85, SLAB + 2.2, d / 2 + 0.06);
    stages[4].add(lamp);
  }
  // Oluk
  stages[4].add(box(2 * ex, 0.1, 0.1, M.supurgelik, 0, y0 - 0.05, ez));
  stages[4].add(box(2 * ex, 0.1, 0.1, M.supurgelik, 0, y0 - 0.05, -ez));

  return stages;
}

function agac(x, z, s, i) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * s, 0.14 * s, 1.4 * s, 6), M.govde);
  trunk.position.y = 0.7 * s;
  trunk.castShadow = true;
  g.add(trunk);
  const canopy = new THREE.Mesh(new THREE.IcosahedronGeometry(1 * s, 0), M.yaprak[i % 3]);
  canopy.position.y = 1.9 * s;
  canopy.scale.y = 1.15;
  canopy.rotation.y = i;
  canopy.castShadow = true;
  g.add(canopy);
  if (i % 2 === 0) {
    const c2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7 * s, 0), M.yaprak[(i + 1) % 3]);
    c2.position.set(0.5 * s, 2.5 * s, 0.2 * s);
    c2.castShadow = true;
    g.add(c2);
  }
  g.position.set(x, 0, z);
  return g;
}

// Gün batımı gökyüzü kubbesi
function gokyuzu() {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {},
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `varying vec3 vDir;
      vec3 hex(float r,float g,float b){ return vec3(r,g,b)/255.0; }
      void main(){
        float h = vDir.y;
        vec3 c = hex(240.,170.,118.);
        c = mix(c, hex(214.,132.,106.), smoothstep(0.0, 0.05, h));
        c = mix(c, hex(122.,86.,112.), smoothstep(0.04, 0.14, h));
        c = mix(c, hex(44.,52.,88.), smoothstep(0.12, 0.3, h));
        c = mix(c, hex(14.,20.,38.), smoothstep(0.28, 0.7, h));
        if (h < 0.0) c = hex(185.,133.,114.);
        gl_FragColor = vec4(pow(c, vec3(2.2)), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(800, 32, 16), material);
  m.renderOrder = -1;
  return m;
}

// Uzak tepeler (siluet)
function tepeler() {
  const g = new THREE.Group();
  const near = new THREE.MeshBasicMaterial({ color: '#5a4660', fog: false });
  const far = new THREE.MeshBasicMaterial({ color: '#7a5866', fog: false });
  for (let i = 0; i < 46; i++) {
    const a = (i / 46) * Math.PI * 2;
    const layer = i % 2;
    const r = layer ? 330 : 290;
    const h = 8 + ((Math.sin(i * 2.7) + 1) * 0.5) * (layer ? 16 : 11);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(60 + (i % 5) * 12, h, 5), layer ? far : near);
    cone.position.set(Math.cos(a) * r, h / 2 - 2, Math.sin(a) * r);
    cone.scale.z = 0.5;
    cone.lookAt(0, h / 2 - 2, 0);
    g.add(cone);
  }
  return g;
}

const easeOutBack = (t) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export function createHero(container, { onStage } = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#b98572', 45, 230);
  scene.add(gokyuzu(), tepeler());

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 1200);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minPolarAngle = Math.PI / 2 - 0.5;
  controls.maxPolarAngle = Math.PI / 2 - 0.08;
  controls.autoRotate = !reduced;
  controls.autoRotateSpeed = 0.45;

  scene.add(new THREE.HemisphereLight('#ffe0bf', '#2d3826', 1.1));
  const sun = new THREE.DirectionalLight('#ffd2a1', 2.4);
  sun.position.set(-14, 16, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 60 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  const fill = new THREE.DirectionalLight('#9fb6ff', 0.35);
  fill.position.set(12, 8, -10);
  scene.add(fill);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(260, 64), M.cimen);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const trees = new THREE.Group();
  scene.add(trees);

  let house = new THREE.Group();
  scene.add(house);
  let stages = [];
  const progress = [0, 0, 0, 0, 0];
  let target = -1;
  let current = null;

  function placeTrees(model) {
    trees.clear();
    const r0 = Math.max(model.w, model.d) * 0.75 + 3;
    const spots = [
      [-1.0, -0.7, 1.3], [-0.85, 0.2, 1.0], [0.95, -0.85, 1.5], [1.15, 0.1, 1.1],
      [-0.3, -1.25, 1.2], [0.45, -1.2, 0.9], [1.6, 0.9, 1.3], [-1.6, 1.1, 1.0],
      [2.2, -1.6, 1.6], [-2.3, -1.4, 1.5], [0.2, -2.1, 1.4],
    ];
    spots.forEach(([a, b, s], i) => trees.add(agac(a * r0, b * r0, s, i)));
  }

  // Kamerayı modele ve ekran oranına göre konumla
  function frameCamera(model) {
    const r = Math.max(model.w, model.d + 2.5) * 0.72;
    const vHalf = THREE.MathUtils.degToRad(camera.fov / 2);
    const hHalf = Math.atan(Math.tan(vHalf) * Math.min(camera.aspect, 1.5));
    const dist = (r / Math.tan(Math.min(vHalf, hHalf))) * 1.2;
    const el = 0.22;
    const az = 0.7;
    controls.target.set(0, 2.1, 0.8);
    camera.position.set(
      Math.sin(az) * Math.cos(el) * dist,
      2.1 + Math.sin(el) * dist,
      0.8 + Math.cos(az) * Math.cos(el) * dist,
    );
    controls.minDistance = dist * 0.55;
    controls.maxDistance = dist * 1.5;
    controls.update();
  }

  function setModel(model, { replay = true } = {}) {
    if (current === model) return;
    current = model;
    scene.remove(house);
    house.traverse((o) => o.geometry?.dispose());
    house = new THREE.Group();
    stages = evOlustur(model);
    stages.forEach((g) => house.add(g));
    scene.add(house);
    placeTrees(model);
    frameCamera(model);
    if (replay) {
      progress.fill(0);
      const final = target < 0 ? 4 : target;
      target = -1;
      playTo(final);
    }
    applyProgress();
  }

  let timers = [];
  function playTo(stage) {
    timers.forEach(clearTimeout);
    timers = [];
    if (reduced) {
      setStage(stage);
      return;
    }
    for (let s = 0; s <= stage; s++) timers.push(setTimeout(() => setStage(s), s * 650));
  }

  function setStage(s) {
    target = s;
    onStage?.(s);
  }

  function applyProgress() {
    stages.forEach((g, i) => {
      const p = progress[i];
      g.visible = p > 0.001;
      const e = easeOutBack(Math.min(p, 1));
      g.position.y = (1 - e) * 3.2;
    });
    const lit = progress[4];
    M.cam.emissiveIntensity = 0.55 * lit;
    M.lamba.emissiveIntensity = 2.2 * lit;
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    camera.aspect = w / h;
    // Geniş ekranda evi sağa kaydır (sol tarafta metin var)
    if (w > 960) camera.setViewOffset(w, h, -w * 0.17, 0, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    if (current) frameCamera(current);
  }
  new ResizeObserver(resize).observe(container);
  resize();

  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(container);

  // Kullanıcı sürükleyince otomatik dönüş bir süre dursun
  let resumeTimer;
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    clearTimeout(resumeTimer);
  });
  controls.addEventListener('end', () => {
    if (!reduced) resumeTimer = setTimeout(() => (controls.autoRotate = true), 6000);
  });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible) return;
    let changed = false;
    for (let i = 0; i < 5; i++) {
      const goal = i <= target ? 1 : 0;
      if (progress[i] !== goal) {
        const speed = reduced ? 100 : 1.8;
        progress[i] = goal > progress[i] ? Math.min(1, progress[i] + dt * speed) : Math.max(0, progress[i] - dt * speed * 1.6);
        changed = true;
      }
    }
    if (changed) applyProgress();
    controls.update(dt);
    renderer.render(scene, camera);
  });

  return {
    setModel,
    setStage: (s) => {
      timers.forEach(clearTimeout);
      setStage(s);
    },
    replay: () => {
      progress.fill(0);
      target = -1;
      applyProgress();
      playTo(4);
    },
  };
}

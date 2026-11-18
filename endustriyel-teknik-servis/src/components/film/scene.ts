/**
 * Scroll filmi – canlı three.js "blueprint" sahnesi (Maviron Çelik filmindeki yaklaşım).
 * Yalnızca masaüstünde ve WebGL2 varken, dinamik import ile yüklenir.
 *
 * Sayfa yüklenirken (intro, zamana bağlı): plan çizgileri ve tüm parçaların blueprint'i plotter gibi çizilir.
 * Film saniyeleri (0–10, scroll'a bağlı):
 *   0.0–1.2  hero, kamera yaklaşır
 *   1.2–3.4  makine gövdesi (taban, yan plakalar, silindirler, besleme, çıkış) yerine oturur
 *   3.6–6.0  kumanda panosu gelir ve vurgulanır (elektrik / PLC / sürücü)
 *   5.8–8.0  servo motor + redüktör gelir, silindirler döner (mekanik / hareket)
 *   8.0–10   geniş kapanış planı
 * Her şey yalnızca t'nin fonksiyonudur; geri kaydırınca film geri sarar.
 */

import * as THREE from 'three';

export { FILM_DURATION } from '@/data/film';

const C = {
  bg: new THREE.Color('#18212d'),
  blue: new THREE.Color('#9cc3ea'),
  oak: new THREE.Color('#c88a4a'),
  fill: new THREE.Color('#22324a'),
  fillHi: new THREE.Color('#34475f'),
  plan: new THREE.Color('#3f6a94'),
};

type Cat = 'base' | 'frame' | 'cyl' | 'feed' | 'panel' | 'drive';

type Part = {
  group: THREE.Group;
  fillMat: THREE.MeshBasicMaterial;
  edgeMat: THREE.LineBasicMaterial;
  cat: Cat;
  t0: number;
  baseY: number;
  spin?: number; // dönen silindirler: +1 / -1
  ghost?: boolean; // ön plakalar: yarı saydam, arkadaki silindirleri kapatmaz
  tag: string; // parça grubu: unit0..3, feed, delivery, console, panel, plc, drive, base
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
/** a..b aralığında yükselip c..d aralığında sönen ağırlık */
const bell = (a: number, b: number, c: number, d: number, t: number) => smooth(a, b, t) * (1 - smooth(c, d, t));

export type FilmHandle = {
  /** Yalnızca verilen gruplardaki parçaları şeffaf arka planla, nesneyi kadrajlayarak çizer (görsel üretimi). */
  capturePart: (tags: string[], dir: [number, number, number], highlight?: string[]) => void;
  setTime: (t: number) => void;
  setCentered: (k: number) => void;
  resize: (w: number, h: number) => void;
  project: (p: [number, number, number]) => { x: number; y: number; behind: boolean };
  intro: (k: number) => void;
  dispose: () => void;
};

export function createFilm(canvas: HTMLCanvasElement): FilmHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: 'high-performance' });
  // Telefonlarda (≤ 760 px) daha düşük çözünürlük: akıcılık için
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= 760 ? 1.25 : 1.5));
  renderer.setClearColor(C.bg, 1);
  let curTag = 'base';

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(C.bg, 30, 72);
  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 200);

  /* ---------------- zemin ---------------- */
  const grid = new THREE.GridHelper(48, 96, '#3b5675', '#2a3b52');
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.55;
  scene.add(grid);

  /* ---------------- parçalar ---------------- */
  const parts: Part[] = [];
  const blueVerts: number[] = [];
  const planVerts: number[] = [];
  const tmpV = new THREE.Vector3();

  function addPart(
    geo: THREE.BufferGeometry,
    pos: [number, number, number],
    cat: Cat,
    t0: number,
    opts: { rot?: [number, number, number]; spin?: number; extraEdges?: number[]; ghost?: boolean } = {},
  ) {
    const group = new THREE.Group();
    group.position.set(pos[0], pos[1], pos[2]);
    if (opts.rot) group.rotation.set(...opts.rot);
    const fillMat = new THREE.MeshBasicMaterial({
      color: C.fill.clone(),
      transparent: true,
      opacity: 0,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      depthWrite: !opts.ghost,
    });
    const mesh = new THREE.Mesh(geo, fillMat);
    group.add(mesh);
    const edgeGeo = new THREE.EdgesGeometry(geo, 25);
    if (opts.extraEdges?.length) {
      const base = Array.from(edgeGeo.attributes.position.array as Float32Array);
      edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute([...base, ...opts.extraEdges], 3));
    }
    const edgeMat = new THREE.LineBasicMaterial({ color: C.blue.clone(), transparent: true, opacity: 0 });
    group.add(new THREE.LineSegments(edgeGeo, edgeMat));
    group.visible = false;
    scene.add(group);

    // blueprint: kenarları dünya koordinatında plotter sırasıyla biriktir
    group.updateMatrixWorld(true);
    const arr = edgeGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      tmpV.set(arr[i], arr[i + 1], arr[i + 2]).applyMatrix4(group.matrixWorld);
      blueVerts.push(tmpV.x, tmpV.y, tmpV.z);
    }
    parts.push({ group, fillMat, edgeMat, cat, t0, baseY: pos[1], spin: opts.spin, ghost: opts.ghost, tag: curTag });
    return group;
  }

  const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
  /** z ekseni boyunca silindir + uçlarda dönüşü gösteren çapraz çizgiler */
  const cylZ = (r: number, len: number, seg = 40) => {
    const g = new THREE.CylinderGeometry(r, r, len, seg, 1);
    g.rotateX(Math.PI / 2);
    return g;
  };
  const cylCross = (r: number, len: number) => {
    const h = len / 2;
    const out: number[] = [];
    for (const z of [-h, h]) out.push(-r, 0, z, r, 0, z, 0, -r, z, 0, r, z);
    for (const a of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      out.push(x, y, -h, x, y, h);
    }
    return out;
  };
  const planRect = (cx: number, cz: number, w: number, d: number) => {
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2, y = 0.005;
    planVerts.push(x0, y, z0, x1, y, z0, x1, y, z0, x1, y, z1, x1, y, z1, x0, y, z1, x0, y, z1, x0, y, z0);
  };

  // Ölçüler (metre). Makine x ekseni boyunca uzanır; kamera +z tarafından bakar.
  const unitX = [-2.4, -0.8, 0.8, 2.4];
  const plateZ = 0.78;
  const cylLen = 1.48;

  // taban
  addPart(box(9.8, 0.22, 1.9), [0, 0.11, 0], 'base', 1.2);
  planRect(0, 0, 9.8, 1.9);

  unitX.forEach((x, i) => {
    curTag = `unit${i}`;
    const t = 1.35 + i * 0.28;
    // yan plakalar (öndeki yarı saydam: kesit görünüş)
    for (const z of [-plateZ, plateZ]) addPart(box(1.34, 2.3, 0.09), [x, 1.37, z], 'frame', t, { ghost: z > 0 });
    // köprü / üst kiriş
    addPart(box(1.34, 0.08, 1.66), [x, 2.56, 0], 'frame', t + 0.08);
    // baskı silindiri, kauçuk, kalıp
    addPart(cylZ(0.31, cylLen), [x, 0.78, 0], 'cyl', t + 0.18, { spin: 1, extraEdges: cylCross(0.31, cylLen) });
    addPart(cylZ(0.25, cylLen), [x + 0.14, 1.33, 0], 'cyl', t + 0.24, { spin: -1, extraEdges: cylCross(0.25, cylLen) });
    addPart(cylZ(0.25, cylLen), [x + 0.06, 1.84, 0], 'cyl', t + 0.3, { spin: 1, extraEdges: cylCross(0.25, cylLen) });
    // mürekkep merdaneleri
    [
      [-0.32, 2.12, 0.08],
      [0.02, 2.2, 0.075],
      [0.34, 2.1, 0.07],
      [-0.16, 2.36, 0.065],
      [0.2, 2.38, 0.065],
    ].forEach(([dx, y, r], k) =>
      addPart(cylZ(r, cylLen - 0.06, 20), [x + dx, y, 0], 'cyl', t + 0.34 + k * 0.03, { spin: k % 2 ? -1 : 1, extraEdges: cylCross(r, cylLen - 0.06) }),
    );
    // rulman yatağı kapakları (ön plaka)
    for (const [dx, y] of [
      [0, 0.78],
      [0.14, 1.33],
      [0.06, 1.84],
    ]) {
      const g = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 24);
      g.rotateX(Math.PI / 2);
      addPart(g, [x + dx, y, plateZ + 0.075], 'frame', t + 0.36);
    }
    // transfer tamburu
    if (i < unitX.length - 1) addPart(cylZ(0.2, cylLen), [x + 0.8, 0.62, 0], 'cyl', t + 0.4, { spin: -1, extraEdges: cylCross(0.2, cylLen) });
    planRect(x, 0, 1.34, 1.66);
  });

  // besleme (feeder)
  curTag = 'feed';
  addPart(box(1.5, 1.7, 1.66), [-4.15, 1.07, 0], 'feed', 1.25, { ghost: true });
  addPart(box(1.1, 0.5, 1.2), [-4.2, 0.47, 0.0], 'feed', 1.35);
  addPart(box(0.7, 0.24, 1.3), [-3.75, 2.04, 0], 'feed', 1.45);
  planRect(-4.15, 0, 1.5, 1.66);

  // çıkış (delivery)
  curTag = 'delivery';
  addPart(box(1.9, 0.12, 1.66), [4.25, 2.3, 0], 'feed', 2.5);
  for (const z of [-0.8, 0.8]) addPart(box(1.9, 2.2, 0.08), [4.25, 1.32, z], 'feed', 2.55, { ghost: z > 0 });
  addPart(box(1.2, 0.55, 1.2), [4.45, 0.5, 0], 'feed', 2.65);
  addPart(cylZ(0.18, 1.6), [3.4, 2.05, 0], 'cyl', 2.7, { spin: 1, extraEdges: cylCross(0.18, 1.6) });
  addPart(cylZ(0.18, 1.6), [5.1, 2.05, 0], 'cyl', 2.75, { spin: 1, extraEdges: cylCross(0.18, 1.6) });
  planRect(4.25, 0, 1.9, 1.66);

  // operatör konsolu
  curTag = 'console';
  addPart(box(0.9, 1.0, 0.6), [5.9, 0.5, 1.5], 'feed', 2.85);
  addPart(box(0.9, 0.06, 0.7), [5.9, 1.06, 1.48], 'feed', 2.9, { rot: [-0.45, 0, 0] });
  planRect(5.9, 1.5, 0.9, 0.6);

  /* ---- kumanda panosu ---- */
  curTag = 'panel';
  const cab = { x: -6.3, z: 0.5 };
  addPart(box(1.2, 2.05, 0.5), [cab.x, 1.03, cab.z], 'panel', 3.7);
  const face = cab.z + 0.27;
  // DIN rayları ve kablo kanalları
  for (const y of [1.7, 1.25, 0.8, 0.42]) addPart(box(1.02, 0.05, 0.03), [cab.x, y, face], 'panel', 3.85);
  // PLC
  curTag = 'plc';
  addPart(box(0.42, 0.22, 0.08), [cab.x - 0.24, 1.7, face + 0.05], 'panel', 3.95);
  for (let k = 0; k < 4; k++) addPart(box(0.07, 0.22, 0.08), [cab.x + 0.02 + k * 0.08, 1.7, face + 0.05], 'panel', 4.0 + k * 0.03);
  // servo sürücüler
  curTag = 'panel';
  for (let k = 0; k < 2; k++) addPart(box(0.13, 0.36, 0.14), [cab.x + 0.3 + k * 0.16, 1.63, face + 0.07], 'panel', 4.1 + k * 0.05);
  // kontaktörler
  for (let k = 0; k < 6; k++) addPart(box(0.1, 0.14, 0.08), [cab.x - 0.42 + k * 0.165, 1.25, face + 0.05], 'panel', 4.18 + k * 0.03);
  // sigortalar
  for (let k = 0; k < 9; k++) addPart(box(0.05, 0.12, 0.07), [cab.x - 0.42 + k * 0.105, 0.8, face + 0.04], 'panel', 4.3 + k * 0.02);
  // klemensler
  addPart(box(0.86, 0.1, 0.05), [cab.x, 0.42, face + 0.03], 'panel', 4.42);
  // kablo kanalı (makineye)
  curTag = 'cable';
  addPart(box(1.3, 0.08, 0.12), [-5.05, 0.04, cab.z], 'panel', 4.5);
  planRect(cab.x, cab.z, 1.2, 0.5);

  /* ---- servo motor + redüktör (3. ünitenin ön tarafı) ---- */
  curTag = 'drive';
  const dr = { x: 0.8, y: 0.78 };
  addPart(box(0.36, 0.34, 0.3), [dr.x, dr.y, plateZ + 0.24], 'drive', 5.95);
  addPart(new THREE.CylinderGeometry(0.11, 0.11, 0.09, 28).rotateX(Math.PI / 2), [dr.x, dr.y, plateZ + 0.43], 'drive', 6.05);
  addPart(box(0.22, 0.22, 0.42), [dr.x - 0.32, dr.y + 0.02, plateZ + 0.26], 'drive', 6.1);
  addPart(cylZ(0.11, 0.42, 28), [dr.x - 0.32, dr.y + 0.02, plateZ + 0.26], 'drive', 6.15, { extraEdges: cylCross(0.11, 0.42) });
  addPart(box(0.12, 0.1, 0.1), [dr.x - 0.32, dr.y + 0.17, plateZ + 0.12], 'drive', 6.25);
  // motor kablosu kanalı
  curTag = 'cable';
  addPart(box(0.06, 0.06, 1.3), [dr.x - 0.32, 0.08, plateZ + 0.95], 'drive', 6.3);

  /* ---------------- blueprint ve plan çizgileri ---------------- */
  const blueGeo = new THREE.BufferGeometry();
  blueGeo.setAttribute('position', new THREE.Float32BufferAttribute(blueVerts, 3));
  const blueMat = new THREE.LineBasicMaterial({ color: C.blue.clone(), transparent: true, opacity: 0.9, depthWrite: false });
  const blueprint = new THREE.LineSegments(blueGeo, blueMat);
  scene.add(blueprint);
  const blueCount = blueVerts.length / 3;

  const planGeo = new THREE.BufferGeometry();
  planGeo.setAttribute('position', new THREE.Float32BufferAttribute(planVerts, 3));
  const planMat = new THREE.LineBasicMaterial({ color: C.plan.clone(), transparent: true, opacity: 0.9, depthWrite: false });
  const plan = new THREE.LineSegments(planGeo, planMat);
  scene.add(plan);
  const planCount = planVerts.length / 3;
  planGeo.setDrawRange(0, 0);

  /* ---------------- kamera yolu ---------------- */
  type Shot = { t: number; pos: [number, number, number]; target: [number, number, number]; focus: [number, number, number]; zoom: number };
  const M: [number, number, number] = [-0.3, 1.1, 0.6]; // makinenin ortası
  const CAB: [number, number, number] = [-6.3, 1.2, 0.7];
  const DRV: [number, number, number] = [0.55, 0.95, 1.05];
  /** target, kameranın göreli konumu, ortalanmış kadrajda bakılacak nokta ve yakınlaşma */
  const T = (x: number, y: number, z: number, dx: number, dy: number, dz: number, focus = M, zoom = 0.62) => ({
    target: [x, y, z] as [number, number, number],
    pos: [x + dx, y + dy, z + dz] as [number, number, number],
    focus,
    zoom,
  });
  const shots: Shot[] = [
    // Geniş planlar: makine ekranın %50–95'inde (16:10'da hesaplandı), sol taraf metne kalır
    { t: 0, ...T(-4.9, 1.0, 4.25, 19.33, 10.52, 21.47) },
    { t: 1.2, ...T(-4.5, 1.0, 4.0, 16.8, 8.9, 19.3) },
    { t: 3.2, ...T(-4.1, 1.0, 3.75, 14.37, 7.26, 17.12) },
    { t: 4.4, ...T(-7.35, 1.2, 0.8, 2.0, 0.7, 5.2, CAB, 1.15) },
    { t: 5.6, ...T(-7.25, 1.2, 0.8, 2.3, 0.75, 5.0, CAB, 1.15) },
    { t: 6.6, ...T(-0.35, 0.95, 1.1, 2.4, 0.75, 4.2, DRV, 1.1) },
    { t: 7.7, ...T(-0.3, 0.95, 1.1, 2.6, 0.8, 4.0, DRV, 1.1) },
    { t: 9.0, ...T(-4.9, 1.0, 4.25, 19.33, 10.52, 21.47) },
    { t: 10, ...T(-5.0, 1.0, 4.4, 20.6, 10.9, 20.4) },
  ];
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), tA = new THREE.Vector3(), tB = new THREE.Vector3();
  const fA = new THREE.Vector3(), fB = new THREE.Vector3(), off = new THREE.Vector3();
  let aspect = 16 / 9;
  /** 0: metin solda, makine sağda (masaüstü). 1: kadraj odağa ortalanır (dikey ekran, kart görselleri). */
  let centerK = 0;
  function placeCamera(t: number) {
    let i = 0;
    while (i < shots.length - 2 && t > shots[i + 1].t) i++;
    const a = shots[i], b = shots[i + 1];
    const k = smooth(a.t, b.t, t);
    vA.set(...a.pos).lerp(vB.set(...b.pos), k);
    tA.set(...a.target).lerp(tB.set(...b.target), k);
    off.copy(vA).sub(tA);
    const c = Math.max(centerK, aspect < 1.2 ? 1 : 0);
    if (c > 0) {
      fA.set(...a.focus).lerp(fB.set(...b.focus), k);
      tA.lerp(fA, c);
      off.multiplyScalar(1 + (a.zoom + (b.zoom - a.zoom) * k - 1) * c);
    }
    // dar ekranlarda geri çekil; dikeyde makine üst yarıda kalsın (metin altta)
    if (aspect < 1.5) off.multiplyScalar(Math.pow(1.5 / aspect, 0.75));
    if (aspect < 1) tA.y -= 2.2 * (1 - aspect);
    camera.position.copy(tA).add(off);
    camera.lookAt(tA);
  }

  /* ---------------- zaman ---------------- */
  let introK = 1;
  let lastT = 0;
  function setTime(t: number) {
    lastT = t;
    // plotter (sayfa yüklenirken): önce plan, sonra blueprint kenarları
    planGeo.setDrawRange(0, Math.floor(planCount * smooth(0, 0.35, introK) * 0.5) * 2);
    blueGeo.setDrawRange(0, Math.floor(blueCount * smooth(0.15, 1, introK) * 0.5) * 2);
    blueMat.opacity = 0.85 - 0.68 * smooth(1.6, 3.6, t);
    planMat.opacity = 0.9 - 0.5 * smooth(1.6, 3.6, t);

    const panelFocus = bell(3.8, 4.5, 5.6, 6.2, t);
    const driveFocus = bell(5.9, 6.5, 7.6, 8.3, t);
    const endGlow = smooth(8.2, 9.2, t) * 0.45;
    const spin = Math.max(0, t - 5.8) * 2.4;

    for (const p of parts) {
      const a = smooth(p.t0, p.t0 + 0.55, t);
      p.group.visible = a > 0.001;
      if (!p.group.visible) continue;
      p.group.position.y = p.baseY + (1 - a) * 0.55;
      const focus = p.cat === 'panel' ? Math.max(panelFocus, endGlow) : p.cat === 'drive' ? Math.max(driveFocus, endGlow) : 0;
      p.fillMat.opacity = a * (p.ghost ? 0.22 : 0.92);
      p.fillMat.color.copy(C.fill).lerp(C.fillHi, focus);
      p.edgeMat.opacity = a * (0.95 - (p.cat === 'base' ? 0.3 : 0) - 0.35 * Math.max(panelFocus, driveFocus) * (focus > 0 ? 0 : 1));
      p.edgeMat.color.copy(C.blue).lerp(C.oak, focus);
      if (p.spin) p.group.rotation.z = spin * p.spin;
    }
    (grid.material as THREE.Material).opacity = 0.55 - 0.15 * smooth(3, 5, t);
    placeCamera(t);
    renderer.render(scene, camera);
  }

  function resize(w: number, h: number) {
    aspect = w / Math.max(1, h);
    renderer.setSize(w, h, false);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    setTime(lastT);
  }

  const pv = new THREE.Vector3();
  function project(p: [number, number, number]) {
    pv.set(...p).project(camera);
    const el = renderer.domElement;
    return {
      x: (pv.x * 0.5 + 0.5) * el.clientWidth,
      y: (-pv.y * 0.5 + 0.5) * el.clientHeight,
      behind: pv.z > 1,
    };
  }

  function intro(k: number) {
    introK = k;
    setTime(lastT);
  }

  // Tüm shader'ları ilk görüntüden önce derle (ilk scroll'da takılma olmasın)
  parts.forEach((p) => (p.group.visible = true));
  renderer.compile(scene, camera);
  parts.forEach((p) => (p.group.visible = false));

  function dispose() {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose?.();
    });
    renderer.dispose();
  }

  function capturePart(tags: string[], dir: [number, number, number], highlight: string[] = []) {
    setTime(10);
    grid.visible = false;
    blueprint.visible = false;
    plan.visible = false;
    const bbox = new THREE.Box3();
    for (const p of parts) {
      const on = tags.includes(p.tag);
      p.group.visible = on;
      if (!on) continue;
      p.group.position.y = p.baseY;
      p.group.rotation.z = 0;
      const hi = highlight.includes(p.tag);
      p.edgeMat.color.copy(hi ? C.oak : C.blue);
      p.edgeMat.opacity = 0.95;
      p.fillMat.color.copy(hi ? C.fillHi : C.fill);
      p.fillMat.opacity = p.ghost ? 0.25 : 0.94;
      bbox.expandByObject(p.group);
    }
    const center = bbox.getCenter(new THREE.Vector3());
    const radius = bbox.getBoundingSphere(new THREE.Sphere()).radius;
    const dist = (radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.02;
    camera.position.copy(center).add(new THREE.Vector3(...dir).normalize().multiplyScalar(dist));
    camera.lookAt(center);
    renderer.setClearColor(C.bg, 0);
    renderer.render(scene, camera);
  }

  const setCentered = (k: number) => {
    centerK = k;
    setTime(lastT);
  };

  return { setTime, setCentered, capturePart, resize, project, intro, dispose };
}

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
 * Gerçekçi görünüm: parçalar yerine oturduktan sonra (≈3.0–4.2 s) blueprint malzemesi gerçek malzemelere
 * (boyalı çelik, krom, kauçuk, pano, motor) döner; ortam ışığı, gün ışığı ve zemine düşen gölge devreye girer.
 * Her şey yalnızca t'nin fonksiyonudur; geri kaydırınca film geri sarar.
 */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export { FILM_DURATION } from '@/data/film';

const C = {
  bg: new THREE.Color('#0f1b2d'),
  blue: new THREE.Color('#6cb8ff'),
  oak: new THREE.Color('#ff7a2f'),
  fill: new THREE.Color('#1a2d4a'),
  fillHi: new THREE.Color('#24426b'),
  plan: new THREE.Color('#3d7fd0'),
};

type Cat = 'base' | 'frame' | 'cyl' | 'feed' | 'panel' | 'drive';

/** Gerçekçi görünümdeki malzeme türleri */
type MatKind =
  | 'paint'
  | 'darkPaint'
  | 'chrome'
  | 'rubber'
  | 'roller'
  | 'metal'
  | 'cabinet'
  | 'plcModule'
  | 'device'
  | 'terminal'
  | 'motor'
  | 'cable'
  | 'paper'
  | 'wood'
  | 'console'
  | 'lamp'
  | 'guard'
  | 'hazard'
  | 'accent'
  | 'print';

const MATS: Record<MatKind, { color: string; roughness: number; metalness: number; emissive?: string }> = {
  paint: { color: '#8e9693', roughness: 0.45, metalness: 0.2 },
  darkPaint: { color: '#3b4149', roughness: 0.65, metalness: 0.2 },
  chrome: { color: '#d3d8dc', roughness: 0.18, metalness: 1 },
  rubber: { color: '#25292e', roughness: 0.85, metalness: 0 },
  roller: { color: '#7a8088', roughness: 0.4, metalness: 0.6 },
  metal: { color: '#9ea5ac', roughness: 0.32, metalness: 0.85 },
  cabinet: { color: '#aeb0aa', roughness: 0.55, metalness: 0.12 },
  plcModule: { color: '#30353c', roughness: 0.45, metalness: 0.2 },
  device: { color: '#e4e4df', roughness: 0.6, metalness: 0.05 },
  terminal: { color: '#8d949b', roughness: 0.6, metalness: 0.1 },
  motor: { color: '#4b5866', roughness: 0.45, metalness: 0.45 },
  cable: { color: '#1f2328', roughness: 0.8, metalness: 0 },
  paper: { color: '#f0eee8', roughness: 0.92, metalness: 0 },
  wood: { color: '#7a6448', roughness: 0.85, metalness: 0 },
  console: { color: '#2b3036', roughness: 0.5, metalness: 0.25 },
  lamp: { color: '#3ddc84', roughness: 0.3, metalness: 0, emissive: '#2fcf73' },
  guard: { color: '#1f62c8', roughness: 0.38, metalness: 0.25 },
  hazard: { color: '#f5c400', roughness: 0.5, metalness: 0.05 },
  accent: { color: '#ff7a2f', roughness: 0.4, metalness: 0.2 },
  print: { color: '#ffffff', roughness: 0.85, metalness: 0 },
};

/* ---------- prosedürel dokular (kanvas) ---------- */
function canvasTexture(size: number, draw: (g: CanvasRenderingContext2D, n: number) => void, repeat = 1) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 4;
  return t;
}
/** Boyalı yüzey: hafif pürüz değişimi */
const paintNoise = () =>
  canvasTexture(
    256,
    (g, n) => {
      const img = g.createImageData(n, n);
      for (let i = 0; i < n * n; i++) {
        const v = 150 + Math.random() * 60;
        img.data.set([v, v, v, 255], i * 4);
      }
      g.putImageData(img, 0, 0);
    },
    3,
  );
/** Fırçalanmış metal: tek yönde ince çizgiler */
const brushed = () =>
  canvasTexture(256, (g, n) => {
    g.fillStyle = '#5a5a5a';
    g.fillRect(0, 0, n, n);
    for (let i = 0; i < 900; i++) {
      const v = 70 + Math.random() * 90;
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(0, Math.random() * n, n, Math.random() < 0.8 ? 1 : 2);
    }
  });
/** Baskılı tabaka: renk blokları ve CMYK kontrol şeridi */
const printedSheet = () =>
  canvasTexture(512, (g, n) => {
    g.fillStyle = '#fbfaf6';
    g.fillRect(0, 0, n, n);
    const cols = ['#00a3e0', '#e6007e', '#ffd500', '#1d1d1b', '#ff7a2f', '#1f62c8'];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 4; c++) {
        g.fillStyle = cols[(r * 4 + c) % cols.length];
        g.globalAlpha = 0.85;
        g.fillRect(40 + c * 112, 50 + r * 130, 96, 108);
      }
    g.globalAlpha = 1;
    for (let i = 0; i < 24; i++) {
      g.fillStyle = ['#00a3e0', '#e6007e', '#ffd500', '#1d1d1b'][i % 4];
      g.fillRect(16 + i * 20, n - 30, 18, 14);
    }
  });

const DEFAULT_MAT: Record<Cat, MatKind> = {
  base: 'darkPaint',
  frame: 'paint',
  cyl: 'chrome',
  feed: 'paint',
  panel: 'cabinet',
  drive: 'motor',
};

type Part = {
  group: THREE.Group;
  fillMat: THREE.MeshBasicMaterial;
  realMat: THREE.MeshStandardMaterial;
  realMesh: THREE.Mesh;
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
  capturePart: (tags: string[], dir: [number, number, number], highlight?: string[], cutaway?: boolean) => void;
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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  let curTag = 'base';

  const scene = new THREE.Scene();
  // Arka plan sahnede tanımlı: ortam gölgelemesi (composer) ile renk dönüşümü doğru kalır
  scene.background = C.bg.clone();
  // Gerçekçi yansımalar için ortam ışığı (krom silindirler, boyalı yüzeyler)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.3;
  const hemi = new THREE.HemisphereLight('#dfe8f5', '#1c222a', 0.35);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff1e2', 1.9);
  sun.position.set(7, 11, 9);
  sun.castShadow = true;
  const small = window.innerWidth <= 760;
  sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  sun.shadow.camera.left = -9;
  sun.shadow.camera.right = 9;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -5;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 40;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 4;
  scene.add(sun);
  const rim = new THREE.DirectionalLight('#6cb8ff', 0.75);
  rim.position.set(-9, 5, -7);
  scene.add(rim);
  scene.fog = new THREE.Fog(C.bg, 30, 72);
  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 200);

  // Ortam gölgelemesi (GTAO) – yalnızca masaüstünde, gerçekçi görünümde
  const useAO = !small;
  let composer: EffectComposer | null = null;
  let aoPass: GTAOPass | null = null;
  if (useAO) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    aoPass = new GTAOPass(scene, camera, 16, 9);
    aoPass.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1, thickness: 1, scale: 1.2, samples: 12 });
    aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
    composer.addPass(aoPass);
    composer.addPass(new OutputPass());
  }

  /* ---------------- zemin ---------------- */
  const grid = new THREE.GridHelper(48, 96, '#2f5f99', '#1f3a5f');
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.55;
  scene.add(grid);
  (grid.material as THREE.Material & { toneMapped: boolean }).toneMapped = false;
  // Gölgeyi alan zemin (yalnızca gerçekçi görünümde)
  const floorMat = new THREE.ShadowMaterial({ opacity: 0, transparent: true });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.001;
  floor.receiveShadow = true;
  scene.add(floor);

  /* ---------------- parçalar ---------------- */
  // dokular: malzeme türüne göre paylaşılır
  const noiseTex = paintNoise();
  const brushTex = brushed();
  const TEX: Partial<Record<MatKind, THREE.Texture>> = {
    paint: noiseTex,
    guard: noiseTex,
    cabinet: noiseTex,
    darkPaint: noiseTex,
    motor: noiseTex,
    chrome: brushTex,
    metal: brushTex,
    roller: brushTex,
  };
  const parts: Part[] = [];
  /** Kendi ışığı olan malzemeler (lambalar): odak ışıltısı uygulanmaz */
  const MATS_EMISSIVE = new Set<THREE.MeshStandardMaterial>();
  const blueVerts: number[] = [];
  const planVerts: number[] = [];
  const tmpV = new THREE.Vector3();

  function addPart(
    geo: THREE.BufferGeometry,
    pos: [number, number, number],
    cat: Cat,
    t0: number,
    opts: { rot?: [number, number, number]; spin?: number; extraEdges?: number[]; ghost?: boolean; mat?: MatKind } = {},
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
    fillMat.toneMapped = false;
    const mesh = new THREE.Mesh(geo, fillMat);
    group.add(mesh);
    const m = MATS[opts.mat ?? DEFAULT_MAT[cat]];
    const kind = opts.mat ?? DEFAULT_MAT[cat];
    const realMat = new THREE.MeshStandardMaterial({
      color: m.color,
      roughness: m.roughness,
      metalness: m.metalness,
      transparent: true,
      opacity: 0,
      ...(m.emissive ? { emissive: new THREE.Color(m.emissive), emissiveIntensity: 1.2 } : {}),
      ...(TEX[kind] ? { roughnessMap: TEX[kind] } : {}),
    });
    if (m.emissive) MATS_EMISSIVE.add(realMat);
    const realMesh = new THREE.Mesh(geo, realMat);
    realMesh.castShadow = true;
    realMesh.receiveShadow = true;
    realMesh.visible = false;
    group.add(realMesh);
    const edgeGeo = new THREE.EdgesGeometry((geo.userData.edgeSource as THREE.BufferGeometry | undefined) ?? geo, 25);
    if (opts.extraEdges?.length) {
      const base = Array.from(edgeGeo.attributes.position.array as Float32Array);
      edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute([...base, ...opts.extraEdges], 3));
    }
    const edgeMat = new THREE.LineBasicMaterial({ color: C.blue.clone(), transparent: true, opacity: 0 });
    edgeMat.toneMapped = false;
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
    parts.push({ group, fillMat, realMat, realMesh, edgeMat, cat, t0, baseY: pos[1], spin: opts.spin, ghost: opts.ghost, tag: curTag });
    return group;
  }

  const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
  /** Yuvarlatılmış köşeli kutu (gövde parçaları için daha gerçekçi) */
  const rbox = (w: number, h: number, d: number, r = 0.03) => {
    const g = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, Math.min(w, h, d) * 0.45));
    // blueprint çizgileri aynı ölçüdeki düz kutudan (yuvarlatılmış yüzeyler temiz kenar vermez)
    g.userData.edgeSource = new THREE.BoxGeometry(w, h, d);
    return g;
  };
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
  /** Dişli çark: z ekseninde ekstrüde */
  const gearGeo = (rOut: number, rIn: number, teeth: number, depth: number) => {
    const sh = new THREE.Shape();
    const step = (Math.PI * 2) / teeth;
    for (let i = 0; i < teeth; i++) {
      const a = i * step;
      const pt = (ang: number, r: number): [number, number] => [Math.cos(ang) * r, Math.sin(ang) * r];
      const p0 = pt(a, rIn), p1 = pt(a + step * 0.15, rOut), p2 = pt(a + step * 0.45, rOut), p3 = pt(a + step * 0.6, rIn);
      if (i === 0) sh.moveTo(...p0);
      else sh.lineTo(...p0);
      sh.lineTo(...p1);
      sh.lineTo(...p2);
      sh.lineTo(...p3);
    }
    sh.closePath();
    const hole = new THREE.Path();
    hole.absarc(0, 0, rIn * 0.3, 0, Math.PI * 2, true);
    sh.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 1 });
    g.translate(0, 0, -depth / 2);
    g.userData.edgeSource = new THREE.CylinderGeometry(rOut, rOut, depth, 24).rotateX(Math.PI / 2);
    return g;
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
  addPart(rbox(9.8, 0.22, 1.9, 0.04), [0, 0.11, 0], 'base', 1.2);
  planRect(0, 0, 9.8, 1.9);

  unitX.forEach((x, i) => {
    curTag = `unit${i}`;
    const t = 1.35 + i * 0.28;
    // yan plakalar (öndeki yarı saydam: kesit görünüş)
    for (const z of [-plateZ, plateZ]) addPart(rbox(1.34, 2.3, 0.09, 0.035), [x, 1.37, z], 'frame', t, { ghost: z > 0 });
    // köprü / üst kiriş ve mavi koruyucu kapak
    addPart(rbox(1.34, 0.08, 1.66, 0.03), [x, 2.56, 0], 'frame', t + 0.08);
    addPart(rbox(1.22, 0.05, 0.05, 0.02), [x, 2.28, plateZ + 0.07], 'frame', t + 0.1, { mat: 'guard' });
    addPart(rbox(1.22, 0.05, 0.05, 0.02), [x, 0.42, plateZ + 0.07], 'frame', t + 0.1, { mat: 'guard' });
    // arka plakadaki büyük dişli (baskı silindiriyle döner)
    addPart(gearGeo(0.36, 0.33, 40, 0.05), [x, 0.78, -plateZ + 0.08], 'cyl', t + 0.2, { spin: -1, mat: 'metal' });
    addPart(gearGeo(0.27, 0.245, 30, 0.05), [x + 0.14, 1.33, -plateZ + 0.08], 'cyl', t + 0.26, { spin: 1, mat: 'metal' });
    // baskı silindiri (krom), kauçuk (blanket), kalıp silindiri
    addPart(cylZ(0.31, cylLen, 48), [x, 0.78, 0], 'cyl', t + 0.18, { spin: 1, extraEdges: cylCross(0.31, cylLen), mat: 'chrome' });
    addPart(cylZ(0.25, cylLen, 48), [x + 0.14, 1.33, 0], 'cyl', t + 0.24, { spin: -1, extraEdges: cylCross(0.25, cylLen), mat: 'rubber' });
    addPart(cylZ(0.25, cylLen, 48), [x + 0.06, 1.84, 0], 'cyl', t + 0.3, { spin: 1, extraEdges: cylCross(0.25, cylLen), mat: 'chrome' });
    // silindir milleri (yataklardan dışarı)
    for (const [dx, y] of [
      [0, 0.78],
      [0.14, 1.33],
      [0.06, 1.84],
    ])
      addPart(cylZ(0.07, cylLen + 0.34, 24), [x + dx, y, 0], 'cyl', t + 0.32, { spin: 1, mat: 'metal' });
    // mürekkep merdaneleri
    [
      [-0.32, 2.12, 0.08],
      [0.02, 2.2, 0.075],
      [0.34, 2.1, 0.07],
      [-0.16, 2.36, 0.065],
      [0.2, 2.38, 0.065],
    ].forEach(([dx, y, r], k) =>
      addPart(cylZ(r, cylLen - 0.06, 28), [x + dx, y, 0], 'cyl', t + 0.34 + k * 0.03, { spin: k % 2 ? -1 : 1, extraEdges: cylCross(r, cylLen - 0.06), mat: k % 2 ? 'rubber' : 'roller' }),
    );
    // rulman yatağı kapakları (ön plaka)
    for (const [dx, y] of [
      [0, 0.78],
      [0.14, 1.33],
      [0.06, 1.84],
    ]) {
      const g = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 24);
      g.rotateX(Math.PI / 2);
      addPart(g, [x + dx, y, plateZ + 0.075], 'frame', t + 0.36, { mat: 'metal' });
    }
    // turuncu tutamak (koruyucu kapak kolu)
    addPart(rbox(0.04, 0.22, 0.05, 0.015), [x + 0.52, 1.6, plateZ + 0.08], 'frame', t + 0.38, { mat: 'accent' });
    // transfer tamburu
    if (i < unitX.length - 1) addPart(cylZ(0.2, cylLen, 40), [x + 0.8, 0.62, 0], 'cyl', t + 0.4, { spin: -1, extraEdges: cylCross(0.2, cylLen), mat: 'metal' });
    // mürekkep haznesi
    addPart(rbox(1.0, 0.16, 0.5, 0.02), [x - 0.05, 2.74, 0.42], 'frame', t + 0.42, { mat: 'darkPaint' });
    planRect(x, 0, 1.34, 1.66);
  });

  // besleme (feeder)
  curTag = 'feed';
  addPart(rbox(1.5, 1.7, 1.66, 0.04), [-4.15, 1.07, 0], 'feed', 1.25, { ghost: true });
  addPart(box(1.15, 0.12, 1.25), [-4.2, 0.28, 0.0], 'feed', 1.3, { mat: 'wood' });
  addPart(box(1.1, 0.45, 1.2), [-4.2, 0.565, 0.0], 'feed', 1.35, { mat: 'paper' });
  addPart(rbox(0.7, 0.24, 1.3, 0.03), [-3.75, 2.04, 0], 'feed', 1.45, { mat: 'guard' });
  // emiş kafası vantuzları
  for (let k = 0; k < 4; k++) addPart(new THREE.CylinderGeometry(0.03, 0.04, 0.14, 12), [-3.75, 1.86, -0.45 + k * 0.3], 'feed', 1.5, { mat: 'rubber' });
  planRect(-4.15, 0, 1.5, 1.66);

  // çıkış (delivery)
  curTag = 'delivery';
  addPart(rbox(1.9, 0.12, 1.66, 0.03), [4.25, 2.3, 0], 'feed', 2.5, { mat: 'guard' });
  for (const z of [-0.8, 0.8]) addPart(rbox(1.9, 2.2, 0.08, 0.03), [4.25, 1.32, z], 'feed', 2.55, { ghost: z > 0 });
  addPart(box(1.25, 0.12, 1.25), [4.45, 0.28, 0], 'feed', 2.6, { mat: 'wood' });
  addPart(box(1.2, 0.5, 1.2), [4.45, 0.59, 0], 'feed', 2.65, { mat: 'paper' });
  addPart(cylZ(0.18, 1.6, 36), [3.4, 2.05, 0], 'cyl', 2.7, { spin: 1, extraEdges: cylCross(0.18, 1.6), mat: 'metal' });
  addPart(cylZ(0.18, 1.6, 36), [5.1, 2.05, 0], 'cyl', 2.75, { spin: 1, extraEdges: cylCross(0.18, 1.6), mat: 'metal' });

  // operatör basamağı ve üst korkuluk
  curTag = 'base';
  addPart(rbox(6.9, 0.06, 0.42, 0.02), [0, 0.34, 1.18], 'base', 2.2, { mat: 'darkPaint' });
  addPart(box(6.9, 0.012, 0.05), [0, 0.375, 1.37], 'base', 2.22, { mat: 'hazard' });
  for (const sx of [-3.2, -1.6, 0, 1.6, 3.2]) addPart(box(0.06, 0.3, 0.06), [sx, 0.16, 1.32], 'base', 2.25, { mat: 'metal' });
  for (const z of [-0.7, 0.7]) addPart(cylZ(0.022, 1, 10).rotateY(Math.PI / 2).scale(6.4, 1, 1), [0, 3.02, z], 'base', 2.35, { mat: 'metal' });
  for (const sx of [-3.2, -1.6, 0, 1.6, 3.2])
    for (const z of [-0.7, 0.7]) addPart(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 8), [sx, 2.81, z], 'base', 2.3, { mat: 'metal' });
  planRect(4.25, 0, 1.9, 1.66);

  // operatör konsolu
  curTag = 'console';
  addPart(rbox(0.9, 1.0, 0.6, 0.04), [5.9, 0.5, 1.5], 'feed', 2.85, { mat: 'console' });
  addPart(rbox(0.9, 0.06, 0.7, 0.02), [5.9, 1.06, 1.48], 'feed', 2.9, { rot: [-0.45, 0, 0], mat: 'console' });
  addPart(box(0.5, 0.02, 0.32), [5.75, 1.1, 1.46], 'feed', 2.95, { rot: [-0.45, 0, 0], mat: 'plcModule' });
  for (let k = 0; k < 3; k++) addPart(new THREE.SphereGeometry(0.025, 12, 8), [6.12, 1.1 - k * 0.0, 1.38 + k * 0.08], 'feed', 3.0, { mat: 'lamp' });
  planRect(5.9, 1.5, 0.9, 0.6);

  /* ---- kumanda panosu ---- */
  curTag = 'panel';
  const cab = { x: -6.3, z: 0.5 };
  addPart(rbox(1.2, 2.05, 0.5, 0.03), [cab.x, 1.03, cab.z], 'panel', 3.7);
  addPart(box(0.06, 0.2, 0.04), [cab.x + 0.52, 1.1, cab.z + 0.27], 'panel', 3.75, { mat: 'metal' });
  const face = cab.z + 0.27;
  // DIN rayları ve kablo kanalları
  for (const y of [1.7, 1.25, 0.8, 0.42]) addPart(box(1.02, 0.05, 0.03), [cab.x, y, face], 'panel', 3.85, { mat: 'metal' });
  // PLC
  curTag = 'plc';
  addPart(box(0.42, 0.22, 0.08), [cab.x - 0.24, 1.7, face + 0.05], 'panel', 3.95, { mat: 'plcModule' });
  for (let k = 0; k < 4; k++) addPart(box(0.07, 0.22, 0.08), [cab.x + 0.02 + k * 0.08, 1.7, face + 0.05], 'panel', 4.0 + k * 0.03, { mat: 'plcModule' });
  // servo sürücüler
  curTag = 'panel';
  for (let k = 0; k < 2; k++) addPart(box(0.13, 0.36, 0.14), [cab.x + 0.3 + k * 0.16, 1.63, face + 0.07], 'panel', 4.1 + k * 0.05, { mat: 'terminal' });
  // kontaktörler
  for (let k = 0; k < 6; k++) addPart(box(0.1, 0.14, 0.08), [cab.x - 0.42 + k * 0.165, 1.25, face + 0.05], 'panel', 4.18 + k * 0.03, { mat: 'device' });
  // sigortalar
  for (let k = 0; k < 9; k++) addPart(box(0.05, 0.12, 0.07), [cab.x - 0.42 + k * 0.105, 0.8, face + 0.04], 'panel', 4.3 + k * 0.02, { mat: 'device' });
  // klemensler
  addPart(box(0.86, 0.1, 0.05), [cab.x, 0.42, face + 0.03], 'panel', 4.42, { mat: 'terminal' });
  // kablo kanalı (makineye)
  curTag = 'cable';
  addPart(box(1.3, 0.08, 0.12), [-5.05, 0.04, cab.z], 'panel', 4.5, { mat: 'cable' });
  planRect(cab.x, cab.z, 1.2, 0.5);

  /* ---- servo motor + redüktör (3. ünitenin ön tarafı) ---- */
  curTag = 'drive';
  const dr = { x: 0.8, y: 0.78 };
  addPart(rbox(0.36, 0.34, 0.3, 0.04), [dr.x, dr.y, plateZ + 0.24], 'drive', 5.95);
  addPart(new THREE.CylinderGeometry(0.11, 0.11, 0.09, 28).rotateX(Math.PI / 2), [dr.x, dr.y, plateZ + 0.43], 'drive', 6.05, { mat: 'metal' });
  addPart(rbox(0.22, 0.22, 0.42, 0.03), [dr.x - 0.32, dr.y + 0.02, plateZ + 0.26], 'drive', 6.1);
  addPart(cylZ(0.11, 0.42, 28), [dr.x - 0.32, dr.y + 0.02, plateZ + 0.26], 'drive', 6.15, { extraEdges: cylCross(0.11, 0.42) });
  addPart(rbox(0.12, 0.1, 0.1, 0.02), [dr.x - 0.32, dr.y + 0.17, plateZ + 0.12], 'drive', 6.25, { mat: 'plcModule' });
  // motor kablosu kanalı
  curTag = 'cable';
  addPart(box(0.06, 0.06, 1.3), [dr.x - 0.32, 0.08, plateZ + 0.95], 'drive', 6.3, { mat: 'cable' });

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

  /* ---------------- akan baskı tabakaları (hareket sahnesi) ---------------- */
  const sheetPath = new THREE.CatmullRomCurve3(
    [
      [-4.2, 0.8, 0],
      [-3.9, 1.35, 0],
      [-3.35, 1.12, 0],
      ...unitX.flatMap((x, i) => [
        [x - 0.32, 1.1, 0],
        [x, 1.12, 0],
        [x + 0.32, 1.02, 0],
        ...(i < unitX.length - 1 ? [[x + 0.8, 0.84, 0]] : []),
      ]),
      [3.3, 1.5, 0],
      [3.6, 2.05, 0],
      [4.6, 2.05, 0],
      [4.9, 1.4, 0],
      [4.45, 0.88, 0],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    'centripetal',
  );
  const sheetGeo = new THREE.BoxGeometry(0.62, 0.006, 1.02);
  const sheetMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85, map: printedSheet(), transparent: true, opacity: 0 });
  sheetMat.map!.repeat.set(1, 1);
  sheetMat.map!.colorSpace = THREE.SRGBColorSpace;
  const SHEETS = 14;
  const sheets: THREE.Mesh[] = [];
  for (let i = 0; i < SHEETS; i++) {
    const m = new THREE.Mesh(sheetGeo, sheetMat);
    m.castShadow = true;
    m.visible = false;
    scene.add(m);
    sheets.push(m);
  }
  const X_AXIS = new THREE.Vector3(1, 0, 0);
  const tan = new THREE.Vector3();
  const sp = new THREE.Vector3();
  function placeSheets(t: number) {
    const show = smooth(5.7, 6.2, t) * (1 - smooth(9.6, 10, t));
    sheetMat.opacity = show;
    for (let i = 0; i < SHEETS; i++) {
      const m = sheets[i];
      m.visible = show > 0.01;
      if (!m.visible) continue;
      const u = (((i / SHEETS + Math.max(0, t - 5.7) * 0.11) % 1) + 1) % 1;
      sheetPath.getPointAt(u, sp);
      sheetPath.getTangentAt(u, tan);
      m.position.copy(sp);
      // yol x-y düzleminde: tabaka yalnızca gidiş yönünde eğilir
      m.quaternion.setFromUnitVectors(X_AXIS, tan.normalize());
    }
  }

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

    // Gerçekçi görünüme geçiş: makine 3.0–4.0 s; sonradan gelen parçalar geldikten hemen sonra
    const realAll = smooth(3.0, 4.0, t);
    for (const p of parts) {
      const a = smooth(p.t0, p.t0 + 0.55, t);
      p.group.visible = a > 0.001;
      if (!p.group.visible) continue;
      p.group.position.y = p.baseY + (1 - a) * 0.55;
      const focus = p.cat === 'panel' ? Math.max(panelFocus, endGlow) : p.cat === 'drive' ? Math.max(driveFocus, endGlow) : 0;
      const r = Math.min(realAll, smooth(p.t0 + 0.45, p.t0 + 1.05, t));
      // blueprint katmanı
      p.fillMat.opacity = a * (p.ghost ? 0.22 : 0.92) * (1 - r);
      p.fillMat.color.copy(C.fill).lerp(C.fillHi, focus);
      p.group.children[0].visible = r < 0.999;
      // gerçek malzeme katmanı
      p.realMesh.visible = r > 0.001;
      p.realMat.opacity = a * r;
      const opaque = r > 0.995;
      if (p.realMat.transparent === opaque) {
        p.realMat.transparent = !opaque;
        p.realMat.needsUpdate = true;
      }
      p.realMat.depthWrite = r > 0.5;
      if (!MATS_EMISSIVE.has(p.realMat)) {
        p.realMat.emissive.copy(C.oak);
        p.realMat.emissiveIntensity = 0.08 * focus;
      }
      // kenar çizgileri: blueprint'te belirgin, gerçek görünümde yalnızca odakta bakır çizgi
      const edgeBase = a * (0.95 - (p.cat === 'base' ? 0.3 : 0) - 0.35 * Math.max(panelFocus, driveFocus) * (focus > 0 ? 0 : 1));
      p.edgeMat.opacity = edgeBase * (1 - r) + r * 0.85 * focus;
      p.edgeMat.color.copy(C.blue).lerp(C.oak, focus);
      if (p.spin) p.group.rotation.z = spin * p.spin;
    }
    (grid.material as THREE.Material).opacity = 0.55 - 0.3 * realAll;
    floorMat.opacity = 0.42 * realAll;
    sun.castShadow = realAll > 0.01;
    placeSheets(t);
    placeCamera(t);
    if (composer && aoPass && realAll > 0.02) {
      aoPass.blendIntensity = realAll;
      composer.render();
    } else renderer.render(scene, camera);
  }

  function resize(w: number, h: number) {
    aspect = w / Math.max(1, h);
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
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
  parts.forEach((p) => {
    p.group.visible = true;
    p.realMesh.visible = true;
  });
  floorMat.opacity = 0.4;
  renderer.compile(scene, camera);
  // opak varyantları da derle (geçiş bitince transparent=false olur)
  parts.forEach((p) => {
    p.realMat.transparent = false;
    p.realMat.needsUpdate = true;
  });
  renderer.compile(scene, camera);
  parts.forEach((p) => {
    p.group.visible = false;
    p.realMesh.visible = false;
    p.realMat.transparent = true;
    p.realMat.needsUpdate = true;
  });
  floorMat.opacity = 0;

  function dispose() {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose?.();
    });
    envTex.dispose();
    noiseTex.dispose();
    brushTex.dispose();
    sheetMat.map?.dispose();
    composer?.dispose();
    pmrem.dispose();
    renderer.dispose();
  }

  function capturePart(tags: string[], dir: [number, number, number], highlight: string[] = [], cutaway = false) {
    setTime(10);
    grid.visible = false;
    blueprint.visible = false;
    plan.visible = false;
    floor.visible = false;
    sheets.forEach((m) => (m.visible = false));
    const bbox = new THREE.Box3();
    for (const p of parts) {
      const on = tags.includes(p.tag) && !(cutaway && p.ghost);
      p.group.visible = on;
      if (!on) continue;
      p.group.position.y = p.baseY;
      p.group.rotation.z = 0;
      const hi = highlight.includes(p.tag);
      p.group.children[0].visible = false;
      p.realMesh.visible = true;
      p.realMat.opacity = 1;
      p.realMat.transparent = false;
      p.realMat.depthWrite = true;
      p.realMat.needsUpdate = true;
      if (!MATS_EMISSIVE.has(p.realMat)) {
        p.realMat.emissive.copy(C.oak);
        p.realMat.emissiveIntensity = hi ? 0.3 : 0;
      }
      p.edgeMat.color.copy(C.oak);
      p.edgeMat.opacity = hi ? 0.9 : 0;
      bbox.expandByObject(p.group);
    }
    const center = bbox.getCenter(new THREE.Vector3());
    const radius = bbox.getBoundingSphere(new THREE.Sphere()).radius;
    const dist = (radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.02;
    camera.position.copy(center).add(new THREE.Vector3(...dir).normalize().multiplyScalar(dist));
    camera.lookAt(center);
    scene.background = null;
    renderer.setClearColor(C.bg, 0);
    renderer.render(scene, camera);
  }

  const setCentered = (k: number) => {
    centerK = k;
    setTime(lastT);
  };

  return { setTime, setCentered, capturePart, resize, project, intro, dispose };
}

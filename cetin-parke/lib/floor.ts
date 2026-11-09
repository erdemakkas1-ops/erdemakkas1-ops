/**
 * Procedural parquet drawing shared by the "Zeminini tasarla" configurator and
 * the pattern swatches in the parquet guide. Everything is in metres on a
 * top-down texture; the configurator then projects it into the salon photo's
 * perspective row by row (same camera as scripts/build-floor-film.py).
 */
export type PatternId = 'duz' | 'capraz' | 'balik' | 'macar' | 'hasir';

export const patterns: { id: PatternId; name: string; note: string; waste: number }[] = [
  { id: 'duz', name: 'Düz', note: 'Klasik, sakin ve zamansız. Uzun tahtalar mekânı derinleştirir; en az fireli dizilimdir.', waste: 0.05 },
  { id: 'capraz', name: 'Çapraz (45°)', note: 'Tahtalar duvara 45° açıyla döşenir. Dar ve küçük odaları olduğundan geniş gösterir.', waste: 0.1 },
  { id: 'balik', name: 'Balıksırtı', note: 'Kısa tahtaların L şeklinde birleştiği zikzak. Zemine hareket ve klasik bir şıklık katar.', waste: 0.1 },
  { id: 'macar', name: 'Macar Kesim', note: 'Uçları açılı kesilmiş tahtalarla kesintisiz “V” çizgileri. Fransız balıksırtı olarak da bilinir.', waste: 0.12 },
  { id: 'hasir', name: 'Hasır Örgü', note: 'Kısa tahtalar kareler hâlinde dikey-yatay sırayla döşenir. Dokulu, el işçiliği hissi verir.', waste: 0.08 },
];

export const tones: { id: string; name: string; hex: string; note: string }[] = [
  { id: 'dogal', name: 'Doğal Meşe', hex: '#c9a173', note: 'Sıcak, her stile uyan en çok tercih edilen ton.' },
  { id: 'acik', name: 'Açık Meşe', hex: '#dcc4a0', note: 'İskandinav ve minimal mekânlarda ferahlık.' },
  { id: 'bal', name: 'Bal Meşe', hex: '#b9864f', note: 'Klasik, sıcak ve davetkâr.' },
  { id: 'beyaz', name: 'Beyaz Yıkama', hex: '#e2d8c8', note: 'Aydınlık, kum rengi; küçük alanları büyütür.' },
  { id: 'gri', name: 'Gri Meşe', hex: '#a39a8e', note: 'Modern ve soğuk tonlarla dengeli.' },
  { id: 'ceviz', name: 'Ceviz', hex: '#6f4d36', note: 'Koyu, asil; açık duvarlarla güçlü kontrast.' },
  { id: 'fume', name: 'Füme', hex: '#4e4842', note: 'Endüstriyel ve çağdaş iç mekânlar için.' },
];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Small deterministic PRNG so the floor does not flicker between renders. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Ctx = CanvasRenderingContext2D;

function plankFill(ctx: Ctx, base: [number, number, number], rand: () => number) {
  const k = 0.9 + rand() * 0.2;
  const w = (rand() - 0.5) * 8;
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${c(base[0] * k + w)},${c(base[1] * k)},${c(base[2] * k - w)})`;
}

/** Draws one plank as polygon (in metres, already in the transformed context). */
function plank(ctx: Ctx, pts: [number, number][], base: [number, number, number], rand: () => number, px: number, grainDir: [number, number]) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fillStyle = plankFill(ctx, base, rand);
  ctx.fill();
  // grain: a few faint lines along the plank
  ctx.save();
  ctx.clip();
  const [gx, gy] = grainDir;
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
  const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  ctx.lineWidth = 1.2 / px;
  for (let i = 0; i < 4; i++) {
    const off = (rand() - 0.5) * 0.14;
    const dark = rand() < 0.5;
    ctx.strokeStyle = dark ? 'rgba(60,35,15,.13)' : 'rgba(255,240,215,.12)';
    ctx.beginPath();
    const nx = -gy, ny = gx;
    ctx.moveTo(cx - gx * 2 + nx * off, cy - gy * 2 + ny * off);
    ctx.bezierCurveTo(cx - gx * 0.6 + nx * (off + 0.01), cy - gy * 0.6 + ny * (off + 0.01), cx + gx * 0.6 + nx * (off - 0.01), cy + gy * 0.6 + ny * (off - 0.01), cx + gx * 2 + nx * off, cy + gy * 2 + ny * off);
    ctx.stroke();
  }
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.lineWidth = 1.1 / px;
  ctx.strokeStyle = 'rgba(40,24,10,.38)';
  ctx.stroke();
}

/**
 * Fill the current context (already scaled to px-per-metre and translated) with
 * the pattern covering a square of half-size `R` metres around the origin.
 */
function drawPatternLocal(ctx: Ctx, id: PatternId, base: [number, number, number], R: number, px: number, seed = 3) {
  const rand = rng(seed);
  if (id === 'duz' || id === 'capraz') {
    const W = 0.19, L = 1.28;
    if (id === 'capraz') ctx.rotate(Math.PI / 4);
    for (let i = Math.floor(-R / W); i < R / W; i++) {
      const x = i * W;
      const off = ((i * 0.37) % 1) * L;
      for (let y = -R - off; y < R; y += L) plank(ctx, [[x, y], [x + W, y], [x + W, y + L], [x, y + L]], base, rand, px, [0, 1]);
    }
  } else if (id === 'balik') {
    const W = 0.11, N = 5;
    ctx.rotate(Math.PI / 4);
    const span = Math.ceil(R / W) + N;
    for (let m = -Math.ceil(span / (2 * N)) - 1; m <= Math.ceil(span / (2 * N)) + 1; m++) {
      for (let k = -span; k <= span; k++) {
        const hx = (k + m * N) * W, hy = (k - m * N) * W;
        if (Math.abs(hx) > R * 1.5 + 1 || Math.abs(hy) > R * 1.5 + 1) continue;
        plank(ctx, [[hx, hy], [hx + N * W, hy], [hx + N * W, hy + W], [hx, hy + W]], base, rand, px, [1, 0]);
        const vy = hy + W;
        plank(ctx, [[hx, vy], [hx + W, vy], [hx + W, vy + N * W], [hx, vy + N * W]], base, rand, px, [0, 1]);
      }
    }
  } else if (id === 'macar') {
    const C = 0.42, h = 0.12 / Math.SQRT1_2 * 0.82;
    for (let i = Math.floor(-R / C) - 1; i < R / C + 1; i++) {
      const x0 = i * C, x1 = x0 + C;
      const s = i % 2 === 0 ? 1 : -1;
      for (let y = -R - C; y < R + C; y += h) {
        const a = s > 0 ? 0 : C, b = s > 0 ? C : 0;
        plank(ctx, [[x0, y + a], [x1, y + b], [x1, y + b + h], [x0, y + a + h]], base, rand, px, [Math.SQRT1_2, s * Math.SQRT1_2]);
      }
    }
  } else {
    const W = 0.1, cell = 3 * W;
    for (let i = Math.floor(-R / cell); i < R / cell; i++) {
      for (let j = Math.floor(-R / cell); j < R / cell; j++) {
        const x = i * cell, y = j * cell;
        const horiz = (i + j) % 2 === 0;
        for (let t = 0; t < 3; t++) {
          if (horiz) plank(ctx, [[x, y + t * W], [x + cell, y + t * W], [x + cell, y + (t + 1) * W], [x, y + (t + 1) * W]], base, rand, px, [1, 0]);
          else plank(ctx, [[x + t * W, y], [x + (t + 1) * W, y], [x + (t + 1) * W, y + cell], [x + t * W, y + cell]], base, rand, px, [0, 1]);
        }
      }
    }
  }
}

/** Top-down swatch (used in the guide). `metres` = visible width. */
export function drawSwatch(canvas: HTMLCanvasElement, id: PatternId, hex: string, metres = 1.6) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const px = canvas.width / metres;
  ctx.save();
  ctx.fillStyle = '#2a2420';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(px, px);
  drawPatternLocal(ctx, id, hexToRgb(hex), metres, px, 11);
  ctx.restore();
}

// Camera of the salon photo (1536 x 869), see scripts/build-floor-film.py
export const CAMERA = { W: 1536, H: 869, CX: 768, YH: 437, F: 1000, CAM_H: 1.35, FLOOR_TOP: 540 };
const TEX = { S: 95, X0: -11.5, X1: 11.5, Z0: 2.4, Z1: 14.5 };

/** Builds the world-space floor texture (metres -> pixels). */
export function buildFloorTexture(id: PatternId, hex: string): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.round((TEX.X1 - TEX.X0) * TEX.S);
  c.height = Math.round((TEX.Z1 - TEX.Z0) * TEX.S);
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  ctx.fillStyle = '#3a2f26';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.save();
  ctx.scale(TEX.S, TEX.S);
  ctx.translate(-TEX.X0, 6 - TEX.Z0); // pattern origin at X=0, Z=6m
  const rgb = hexToRgb(hex).map(v => Math.min(255, v * 1.28)) as [number, number, number];
  drawPatternLocal(ctx, id, rgb, 14, TEX.S, 5);
  ctx.restore();
  return c;
}

/** Projects the texture onto `ctx` (canvas sized CAMERA.W x CAMERA.H). */
export function projectFloor(ctx: Ctx, tex: HTMLCanvasElement) {
  const { W, H, CX, YH, F, CAM_H, FLOOR_TOP } = CAMERA;
  ctx.imageSmoothingEnabled = true;
  for (let y = FLOOR_TOP; y < H; y++) {
    const z = (F * CAM_H) / (y + 0.5 - YH);
    const dz = (F * CAM_H) / (y - YH) - (F * CAM_H) / (y + 1 - YH);
    const xw0 = ((0 - CX) * z) / F;
    const ww = (W * z) / F;
    const sx = (xw0 - TEX.X0) * TEX.S;
    const sy = (z - TEX.Z0) * TEX.S;
    const sh = Math.max(1, dz * TEX.S);
    ctx.drawImage(tex, sx, Math.max(0, sy - sh / 2), ww * TEX.S, sh, 0, y, W, 1);
  }
}

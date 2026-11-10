// Fails the build early if a frame or render listed in lib/media.ts is missing from public/.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const pub = join(process.cwd(), 'public');
const seqs = [['media/bath/d', 96], ['media/kitchen/d', 40]];
// portrait (phone) sets are optional: the player falls back to the landscape film without them
const optional = [['media/bath/m', 60], ['media/kitchen/m', 30]];
const missing = [];
const frame = (dir, i) => join(pub, dir, `${String(i).padStart(4, '0')}.webp`);
for (const [dir, n] of seqs) for (let i = 1; i <= n; i++) if (!existsSync(frame(dir, i))) missing.push(frame(dir, i));
for (const [dir, n] of optional) {
  const have = Array.from({ length: n }, (_, i) => existsSync(frame(dir, i + 1))).filter(Boolean).length;
  if (have === 0) console.warn(`note: ${dir} not present, phones use the landscape film`);
  else if (have < n) missing.push(`${dir}: ${n - have} of ${n} frames missing`);
}
for (const t of ['marble', 'anthra', 'beige']) for (const c of ['ceviz', 'beyaz', 'antrasit']) {
  const f = join(pub, 'media/config', `${t}-${c}.webp`);
  if (!existsSync(f)) missing.push(f);
}
for (const f of ['media/config/once.webp', 'media/og.jpg']) if (!existsSync(join(pub, f))) missing.push(join(pub, f));
if (missing.length) { console.error(`Missing ${missing.length} media files, e.g.\n` + missing.slice(0, 8).join('\n')); process.exit(1); }
console.log('All media present.');

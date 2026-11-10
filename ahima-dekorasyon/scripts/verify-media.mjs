// Fails the build early if a frame or render listed in lib/media.ts is missing from public/.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const pub = join(process.cwd(), 'public');
const seqs = [['media/bath/d', 96], ['media/bath/m', 60], ['media/kitchen/d', 40], ['media/kitchen/m', 30]];
const missing = [];
for (const [dir, n] of seqs) for (let i = 1; i <= n; i++) {
  const f = join(pub, dir, `${String(i).padStart(4, '0')}.webp`);
  if (!existsSync(f)) missing.push(f);
}
for (const t of ['marble', 'anthra', 'beige']) for (const c of ['ceviz', 'beyaz', 'antrasit']) {
  const f = join(pub, 'media/config', `${t}-${c}.webp`);
  if (!existsSync(f)) missing.push(f);
}
for (const f of ['media/config/once.webp', 'media/og.jpg']) if (!existsSync(join(pub, f))) missing.push(join(pub, f));
if (missing.length) { console.error(`Missing ${missing.length} media files, e.g.\n` + missing.slice(0, 8).join('\n')); process.exit(1); }
console.log('All media present.');

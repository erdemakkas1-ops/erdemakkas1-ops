"""Görselleri duyarlı AVIF + WebP setlerine çevirir.
Her görsel için 960, 1600 ve 2400 px genişlikte (kaynaktan büyük olmayanlar) <ad>-<genişlik>.avif/.webp üretir.
Kullanım: python3 scripts/optimize-images.py <kaynak> <hedef-uzantısız-yol> [<kaynak> <hedef> ...]
Örnek:    python3 scripts/optimize-images.py ~/hero.jpg public/images/cinema/hero-baski-makinesi
"""
import sys
from pathlib import Path
from PIL import Image

WIDTHS = [960, 1600, 2400]
args = sys.argv[1:]
for src, dst in zip(args[::2], args[1::2]):
    im = Image.open(src).convert('RGB')
    base = Path(dst)
    base.parent.mkdir(parents=True, exist_ok=True)
    made = []
    for w in WIDTHS:
        if w > im.width and made:
            break
        ww = min(w, im.width)
        r = im if ww == im.width else im.resize((ww, round(im.height * ww / im.width)), Image.LANCZOS)
        r.save(f'{base}-{ww}.webp', 'WEBP', quality=80, method=6)
        r.save(f'{base}-{ww}.avif', 'AVIF', quality=56, speed=4)
        made.append(ww)
    print(base, im.size, 'genişlikler:', made)

"""Filmden çekilen PNG'leri WebP'ye çevirir.
   python3 scripts/png-to-webp.py          -> scripts/.capture/*.png  -> public/images/film/
   python3 scripts/png-to-webp.py --parts  -> scripts/.capture/parts  -> public/images/orbit/ (şeffaf, kırpılmış)
"""
import sys
from pathlib import Path
from PIL import Image

if '--parts' in sys.argv:
    src, dst = Path('scripts/.capture/parts'), Path('public/images/orbit')
    dst.mkdir(parents=True, exist_ok=True)
    for p in sorted(src.glob('*.png')):
        im = Image.open(p).convert('RGBA')
        bbox = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
        if bbox:
            pad = 24
            bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(im.width, bbox[2] + pad), min(im.height, bbox[3] + pad))
            im = im.crop(bbox)
        im.thumbnail((900, 900), Image.LANCZOS)
        out = dst / f'{p.stem}.webp'
        im.save(out, 'WEBP', quality=85, method=6)
        print(out, im.size, out.stat().st_size // 1024, 'KB')
    sys.exit()

src = Path('scripts/.capture')
dst = Path('public/images/film')
dst.mkdir(parents=True, exist_ok=True)
sizes = {'poster': (1600, 900), 'poster-m': (430, 900), 'og': (1200, 630)}
for p in sorted(src.glob('*.png')):
    im = Image.open(p).convert('RGB')
    size = sizes.get(p.stem, (1200, 900))
    im = im.resize(size, Image.LANCZOS)
    out = dst / f'{p.stem}.webp'
    im.save(out, 'WEBP', quality=82, method=6)
    print(out, im.size, out.stat().st_size // 1024, 'KB')

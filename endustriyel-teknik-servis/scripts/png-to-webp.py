"""scripts/.capture/*.png -> public/images/film/*.webp (og -> public/og.jpg değil, public/images/film/og.webp)"""
from pathlib import Path
from PIL import Image

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

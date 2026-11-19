"""Görselleri sitede kullanılacak AVIF + WebP çiftlerine çevirir (en fazla 2400 px genişlik).
Kullanım: python3 scripts/optimize-images.py public/images/cinema/*.png
"""
import sys
from pathlib import Path
from PIL import Image

MAX_W = 2400
for arg in sys.argv[1:]:
    src = Path(arg)
    im = Image.open(src).convert('RGB')
    if im.width > MAX_W:
        im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
    base = src.with_suffix('')
    im.save(base.with_suffix('.webp'), 'WEBP', quality=80, method=6)
    im.save(base.with_suffix('.avif'), 'AVIF', quality=58, speed=4)
    print(base, im.size)

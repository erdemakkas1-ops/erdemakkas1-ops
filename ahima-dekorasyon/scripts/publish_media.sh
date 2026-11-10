#!/bin/bash
# Encode Blender renders (PNG) into the site's WebP media. Usage: scripts/publish_media.sh RENDER_DIR
# RENDER_DIR holds film/, film_m/, kfilm/, kfilm_m/, config/ as written by bathroom.py / kitchen.py.
set -e
R=${1:?render dir}
cd "$(dirname "$0")/.."
enc() { [ -d "$R/$1" ] && python3 scripts/encode_frames.py "$R/$1" "public/media/$2" --quality "${3:-84}" || echo "skip $1"; }
enc film bath/d
enc film_m bath/m 82
enc kfilm kitchen/d
enc kfilm_m kitchen/m 82
if [ -d "$R/config" ]; then
  python3 scripts/encode_frames.py "$R/config" public/media/config --quality 86
  python3 - "$R" <<'PY'
import sys
from PIL import Image
im = Image.open(f'{sys.argv[1]}/config/marble-ceviz.png').convert('RGB')
w, h = im.size
crop = im.crop((0, int(h * 0.08), w, int(h * 0.08) + int(w * 630 / 1200))).resize((1200, 630), Image.LANCZOS)
crop.save('public/media/og.jpg', 'JPEG', quality=86, optimize=True, progressive=True)
print('og.jpg')
PY
fi
du -sh public/media/*

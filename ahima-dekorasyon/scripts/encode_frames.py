"""Encode rendered PNG frames to graded WebP for the site.

  python3 scripts/encode_frames.py SRC_DIR OUT_DIR [--quality 78] [--width 1280] [--no-grade]

Grade (same on every frame so the film never flickers): a gentle S-curve and a soft vignette.
"""
import argparse
import glob
import os

import numpy as np
from PIL import Image


def grade(im, vignette=0.16):
    a = np.asarray(im).astype(np.float32) / 255.0
    # soft S-curve around mid-grey
    a = a + 0.06 * np.sin((a - 0.5) * np.pi) * (1 - np.abs(a - 0.5) * 2) * 2
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) / np.sqrt(2)
    a *= (1 - vignette * np.clip(r - 0.35, 0, 1) ** 1.6 * 2.2)[..., None]
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('out')
    ap.add_argument('--quality', type=int, default=78)
    ap.add_argument('--width', type=int, default=0)
    ap.add_argument('--no-grade', action='store_true')
    ap.add_argument('--ext', default='webp')
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    total = 0
    for p in sorted(glob.glob(os.path.join(args.src, '*.png'))):
        im = Image.open(p).convert('RGB')
        if args.width and im.width != args.width:
            im = im.resize((args.width, round(im.height * args.width / im.width)), Image.LANCZOS)
        if not args.no_grade:
            im = grade(im)
        name = os.path.splitext(os.path.basename(p))[0] + '.' + args.ext
        dst = os.path.join(args.out, name)
        if args.ext == 'webp':
            im.save(dst, 'WEBP', quality=args.quality, method=6)
        else:
            im.save(dst, 'JPEG', quality=args.quality, optimize=True, progressive=True)
        total += os.path.getsize(dst)
    n = len(glob.glob(os.path.join(args.src, '*.png')))
    print(f'{n} frames, {total / 1e6:.1f} MB, {total / max(n, 1) / 1e3:.0f} KB avg -> {args.out}')


if __name__ == '__main__':
    main()

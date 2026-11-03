"""Turn the Gemini film keyframes (gemini/) into the site's images (img/film/) and the share image (img/og.jpg).

  python3 tools/keyframes.py [folder]        # default folder: gemini/

The folder holds 1-olcu, 2-tasarim, 3-govde, 4-gunduz, 5-aksam (landscape) and optionally the same names
with -m (portrait), as .png, .jpg, .jpeg or .webp. See GEMINI.md for how they are made. A missing frame is
skipped and the film leaves its chapter out (1-olcu is optional).

Gemini's edits drift by a percent or so, which shows as ghosting in the cross-fades, so every frame is
first aligned to the frame it was edited from (uniform scale and shift that best match the edges; the
printed match is the edge similarity: about 0.6 or more is the same camera, well below 0.5 means Gemini
moved the camera and the frame should be redone). Gemini delivers about 1024 px, so each frame is then
upscaled 2x with EDSR (OpenCV dnn_superres, model in instagram-raw/models/EDSR_x2.pb, see
tools/instagram.py; Lanczos without it), lightly sharpened, cropped and saved as WebP 1920 x 1080 / 1080 x 1920.
Alignment code: the D&M Mutfak demo's tools/keyframes.py.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, sys.argv[1] if len(sys.argv) > 1 else "gemini")
OUT = os.path.join(ROOT, "img", "film")
MODEL = os.path.join(ROOT, "instagram-raw", "models", "EDSR_x2.pb")
# frame -> the frame it was edited from (None for the reference); parents come first
CHAIN = {"4-gunduz": None, "5-aksam": "4-gunduz", "3-govde": "4-gunduz", "2-tasarim": "4-gunduz", "1-olcu": "3-govde"}


def find(name):
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        path = os.path.join(SRC, name + ext)
        if os.path.exists(path):
            return path
    return None


def edges(im, w):
    small = im.convert("L").resize((w, round(w * im.height / im.width)))
    return np.asarray(small.filter(ImageFilter.FIND_EDGES), dtype=np.float32)


def align(im, ref):
    """Scale and shift im so its edges best match ref's; the gaps at the border are filled from im itself."""
    im = im.resize(ref.size)
    W = 500
    A = edges(ref, W)
    H = A.shape[0]
    best = (-1, 1.0, 0, 0)
    for s in np.arange(.97, 1.0301, .0025):
        w, h = round(W * s), round(H * s)
        B = edges(im.resize((w, h)), w) if w != W else edges(im, W)
        B = B[:h, :w]
        for dx in range(-10, 11):
            for dy in range(-8, 9):
                x0, y0 = (W - w) // 2 + dx, (H - h) // 2 + dy
                xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + w), min(H, y0 + h)
                a, b = A[ya:yb, xa:xb], B[ya - y0:yb - y0, xa - x0:xb - x0]
                score = float((a * b).sum() / (np.sqrt((a * a).sum() * (b * b).sum()) + 1e-6))
                if score > best[0]:
                    best = (score, s, dx, dy)
    score, s, dx, dy = best
    k = ref.width / W
    w, h = round(ref.width * s), round(ref.height * s)
    out = im.copy()  # background for the border, in case the frame shrinks
    out.paste(im.resize((w, h), Image.LANCZOS), ((ref.width - w) // 2 + round(dx * k), (ref.height - h) // 2 + round(dy * k)))
    return out, f"scale {s:.4f}, shift {round(dx * k)},{round(dy * k)} px, match {score:.2f}"


def crop(im, w, h):
    scale = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    left, top = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((left, top, left + w, top + h))


def upscaler():
    try:
        import cv2
        sr = cv2.dnn_superres.DnnSuperResImpl_create()
        sr.readModel(MODEL)
        sr.setModel("edsr", 2)
    except Exception as e:
        print("EDSR unavailable, using Lanczos:", e)
        return lambda im: im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    return lambda im: Image.fromarray(sr.upsample(np.asarray(im)[:, :, ::-1].copy())[:, :, ::-1])


def build(suffix, size, quality, up):
    aligned, done = {}, {}
    for name, parent in CHAIN.items():
        path = find(name + suffix)
        if not path:
            print(f"{name}{suffix}: missing, skipped")
            continue
        im = Image.open(path).convert("RGB")
        note = "reference"
        if parent and parent in aligned:
            im, note = align(im, aligned[parent])
        aligned[name] = im
        big = up(im).filter(ImageFilter.UnsharpMask(radius=1.4, percent=60, threshold=2))
        done[name] = big
        crop(big, *size).save(os.path.join(OUT, name + suffix + ".webp"), "WEBP", quality=quality, method=6)
        print(f"{name}{suffix}: {note}", flush=True)
    return done


def main():
    os.makedirs(OUT, exist_ok=True)
    up = upscaler()
    desktop = build("", (1920, 1080), 82, up)
    build("-m", (1080, 1920), 80, up)
    if "5-aksam" in desktop:
        crop(desktop["5-aksam"], 1200, 630).save(os.path.join(ROOT, "img", "og.jpg"), "JPEG", quality=84, optimize=True, progressive=True)


if __name__ == "__main__":
    main()

"""Turn the Gemini film keyframes (gemini/) into the site's images (img/film/) and the share image (img/og.jpg).

  python3 tools/keyframes.py [folder] [--portrait-only]        # default folder: gemini/

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

Portrait (-m) frames: Gemini reframed these a lot (the evening one is ~23% tighter than the day one), far
beyond the landscape search, so they are matched on the room shell (ceiling cove, wall corners, window)
over a wide scale range, then all are zoomed to the tightest frame so no frame has a gap at its edge
(small leftovers at the very top are filled by repeating the ceiling). Each pair is listed in PORTRAIT
with its allowed scale range; 1-olcu-m is matched to 3-govde-m, the others to 4-gunduz-m.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
SRC = os.path.join(ROOT, ARGS[0] if ARGS else "gemini")
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


# portrait frame -> (parent, scale range); parents first, 4-gunduz-m is the reference
PORTRAIT = {"4-gunduz-m": None, "5-aksam-m": ("4-gunduz-m", (.7, 1.45)), "2-tasarim-m": ("4-gunduz-m", (.7, 1.45)),
            "3-govde-m": ("4-gunduz-m", (.9, 1.1)), "1-olcu-m": ("3-govde-m", (.97, 1.03))}
PW = 180  # matching width in px


def shell_edges(im, w):
    g = im.convert("L").resize((w, round(w * im.height / im.width)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(.8))
    a = np.asarray(g.filter(ImageFilter.FIND_EDGES), dtype=np.float32)
    a[:2] = a[-2:] = 0; a[:, :2] = a[:, -2:] = 0
    return a


def wide_match(im, ref, smin, smax):
    """(score, scale, dx, dy): im scaled by `scale` about the centre and shifted by dx, dy (in PW px) matches ref."""
    A = shell_edges(ref, PW)
    H = A.shape[0]
    A[int(H * .55):] *= .25  # the room shell counts most, the floor little
    cache, best = {}, (-1, 1, 0, 0)

    def score(sc, dx, dy):
        w = round(PW * sc)
        if w not in cache:
            cache[w] = shell_edges(im, w)
        B = cache[w]; h = B.shape[0]
        x0, y0 = (PW - w) // 2 + dx, (H - h) // 2 + dy
        xa, ya, xb, yb = max(0, x0), max(0, y0), min(PW, x0 + w), min(H, y0 + h)
        if xb - xa < PW * .5 or yb - ya < H * .5:
            return -1
        a, b = A[ya:yb, xa:xb], B[ya - y0:yb - y0, xa - x0:xb - x0]
        return float((a * b).sum() / (np.sqrt((a * a).sum() * (b * b).sum()) + 1e-6))

    for sc in np.arange(smin, smax + 1e-9, .02):
        for dx in range(-24, 25, 2):
            for dy in range(-50, 51, 3):
                v = score(sc, dx, dy)
                if v > best[0]:
                    best = (v, sc, dx, dy)
    _, s0, dx0, dy0 = best
    for sc in np.arange(max(smin, s0 - .02), min(smax, s0 + .02) + 1e-9, .004):
        for dx in range(dx0 - 2, dx0 + 3):
            for dy in range(dy0 - 3, dy0 + 4):
                v = score(sc, dx, dy)
                if v > best[0]:
                    best = (v, sc, dx, dy)
    return best


def build_portrait(size, quality, up):
    import cv2
    raw = {n: Image.open(find(n)).convert("RGB") for n in PORTRAIT if find(n)}
    if "4-gunduz-m" not in raw:
        print("portrait frames missing, skipped")
        return
    ref = raw["4-gunduz-m"]
    place = {"4-gunduz-m": (1.0, 0.0, 0.0)}  # frame -> (scale, dx, dy) in the reference's PW-wide coordinates
    for n, link in PORTRAIT.items():
        if not link or n not in raw:
            continue
        parent, (lo, hi) = link
        v, sc, dx, dy = wide_match(raw[n].resize(raw[parent].size), raw[parent], lo, hi)
        ps, pdx, pdy = place[parent]
        place[n] = (ps * sc, pdx + dx * ps, pdy + dy * ps)
        print(f"{n}: scale {sc:.3f}, shift {dx},{dy} vs {parent}, match {v:.2f}", flush=True)
    # zoom so the tightest frame fills the canvas; everything else is scaled up around the same point
    tight = min(place, key=lambda n: place[n][0])
    ts, tdx, tdy = place[tight]
    W, H = size
    k = W / PW
    for n, (sc, dx, dy) in place.items():
        big = up(raw[n].resize(ref.size))
        big = big.resize((W, round(W * big.height / big.width)), Image.LANCZOS)
        S = sc / ts
        cx, cy = big.width / 2, big.height / 2
        M = np.float32([[S, 0, W / 2 - S * cx + (dx - tdx) * k / ts], [0, S, H / 2 - S * cy + (dy - tdy) * k / ts]])
        out = cv2.warpAffine(np.asarray(big), M, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
        Image.fromarray(out).filter(ImageFilter.UnsharpMask(radius=1.4, percent=60, threshold=2)).save(
            os.path.join(OUT, n + ".webp"), "WEBP", quality=quality, method=6)
        print(f"{n}: zoom {S:.3f}", flush=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    up = upscaler()
    desktop = build("", (1920, 1080), 82, up) if "--portrait-only" not in sys.argv else {}
    build_portrait((1080, 1920), 80, up)
    if "5-aksam" in desktop:
        crop(desktop["5-aksam"], 1200, 630).save(os.path.join(ROOT, "img", "og.jpg"), "JPEG", quality=84, optimize=True, progressive=True)


if __name__ == "__main__":
    main()

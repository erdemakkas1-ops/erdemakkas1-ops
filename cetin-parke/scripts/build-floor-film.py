"""Builds the scroll film: bare concrete -> parquet laid plank by plank -> salon furniture.

Everything is derived offline from public/images/cetin-parke-salon-reference.png:
the floor is re-rendered procedurally in the photo's perspective, furniture is
cut out of the photo with hand-traced masks (scripts/polys.py).

    python3 scripts/build-floor-film.py            # writes public/media/film/0001..NNNN.webp
    python3 scripts/build-floor-film.py --preview  # writes a contact sheet only
"""
import os, sys
import numpy as np
import cv2
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from polys import FLOOR_EDGE, RUG, SOFA, TABLE, CHAIR  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'public/images/cetin-parke-salon-reference.png')
OUT = os.path.join(ROOT, 'public/media/film')
OUT_W, OUT_H = 1280, 724
FRAMES = 96
SS = 2  # supersampling for the procedural floor

rng = np.random.default_rng(7)
photo = np.asarray(Image.open(SRC).convert('RGB'), dtype=np.float32) / 255.0
H, W = photo.shape[:2]


def poly_mask(poly, blur=0.0):
    m = np.zeros((H, W), np.uint8)
    cv2.fillPoly(m, [np.array(poly, np.int32)], 255)
    m = m.astype(np.float32) / 255
    if blur:
        m = cv2.GaussianBlur(m, (0, 0), blur)
    return m


def edge_y(x):
    xs = [p[0] for p in FLOOR_EDGE]
    ys = [p[1] for p in FLOOR_EDGE]
    return np.interp(x, xs, ys)


# ---------- masks ----------
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
floor_hard = (yy + 0.5 > edge_y(xx + 0.5)).astype(np.float32)
floor_soft = cv2.GaussianBlur(floor_hard, (0, 0), 0.8)
m_sofa, m_table, m_chair, m_rug = (poly_mask(p) for p in (SOFA, TABLE, CHAIR, RUG))
furniture = np.clip(m_sofa + m_table + m_chair, 0, 1)

# ---------- empty room shell (inpaint furniture that sits above the floor edge) ----------
img8 = (photo * 255).astype(np.uint8)
shell_mask = ((furniture > 0) & (floor_hard < 1)).astype(np.uint8) * 255
shell_mask = cv2.dilate(shell_mask, np.ones((7, 7), np.uint8))
shell = cv2.inpaint(img8, shell_mask, 11, cv2.INPAINT_TELEA).astype(np.float32) / 255

# rug without the furniture standing on it
rug_hole = (cv2.dilate((furniture > 0).astype(np.uint8) * 255, np.ones((31, 31), np.uint8)) > 0) & (m_rug > 0)
rug_layer = cv2.inpaint(img8, rug_hole.astype(np.uint8) * 255, 25, cv2.INPAINT_TELEA).astype(np.float32) / 255
_clean = ((m_rug > 0) & ~rug_hole).astype(np.float32)
_rb = cv2.GaussianBlur(photo * _clean[..., None], (0, 0), 40) / (cv2.GaussianBlur(_clean, (0, 0), 40)[..., None] + 1e-4)
_weave = (photo - cv2.GaussianBlur(photo, (0, 0), 3))[700:770, 980:1280]
_tile = np.tile(_weave, (H // 70 + 1, W // 300 + 1, 1))[:H, :W]
rug_layer = np.where(rug_hole[..., None], _rb * 0.88 + _tile, rug_layer).astype(np.float32)

# ---------- lighting of the floor, taken from the photo (normalized convolution w/o furniture) ----------
valid = floor_hard * (1 - cv2.dilate(np.clip(furniture + m_rug, 0, 1), np.ones((25, 25), np.uint8)))
sig = 45
num = cv2.GaussianBlur(photo * valid[..., None], (0, 0), sig)
den = cv2.GaussianBlur(valid, (0, 0), sig)[..., None] + 1e-4
light = num / den  # low-frequency floor colour incl. window light
# fill gaps where den is tiny with a wider blur
num2 = cv2.GaussianBlur(photo * valid[..., None], (0, 0), 160)
den2 = cv2.GaussianBlur(valid, (0, 0), 160)[..., None] + 1e-4
w = np.clip(den / 0.25, 0, 1)
light = light * w + (num2 / den2) * (1 - w)

# ---------- procedural floor in photo perspective ----------
CX, YH, F, CAM_H = 768.0, 437.0, 1000.0, 1.35
PW, N = 0.12, 5  # plank width (m), length = N * width
ys_ss = (np.arange(H * SS) + 0.5) / SS
xs_ss = (np.arange(W * SS) + 0.5) / SS
Y, X = np.meshgrid(ys_ss, xs_ss, indexing='ij')
Y = np.maximum(Y, YH + 40)
Zw = F * CAM_H / (Y - YH)
Xw = (X - CX) * Zw / F
c45 = np.float32(np.sqrt(0.5))
u = (Xw * c45 - Zw * c45) / PW
v = (Xw * c45 + Zw * c45) / PW

pid = np.full(u.shape, -1, np.int64)
along = np.zeros_like(u)
across = np.zeros_like(u)
cu = np.zeros_like(u)
cv_ = np.zeros_like(u)
d = u - v
m0 = np.floor((d + N) / (2 * N))
for dm in (-1, 0, 1):
    m = m0 + dm
    xs_, ys_ = u - m * N, v + m * N
    free = pid < 0
    k = np.floor(ys_)
    hit = free & (xs_ - k >= 0) & (xs_ - k < N)
    key = ((m.astype(np.int64) * 100003 + k.astype(np.int64)) * 2)
    pid[hit] = key[hit]
    along[hit] = (xs_ - k)[hit]
    across[hit] = (ys_ - k)[hit]
    cu[hit] = (k + N / 2 + m * N)[hit]
    cv_[hit] = (k + 0.5 - m * N)[hit]
    free = pid < 0
    k = np.floor(xs_)
    hit = free & (ys_ - k >= 1) & (ys_ - k < N + 1)
    key = ((m.astype(np.int64) * 100003 + k.astype(np.int64)) * 2 + 1)
    pid[hit] = key[hit]
    along[hit] = (ys_ - k - 1)[hit]
    across[hit] = (xs_ - k)[hit]
    cu[hit] = (k + 0.5 + m * N)[hit]
    cv_[hit] = (k + 1 + N / 2 - m * N)[hit]
pid[pid < 0] = 0


def hash01(a, salt):
    h = (a * 2654435761 + salt * 97531) & 0xFFFFFFFF
    h ^= h >> 15
    h = (h * 2246822519) & 0xFFFFFFFF
    h ^= h >> 13
    return (h & 0xFFFF).astype(np.float32) / 65535.0


r1, r2, r3, r4 = (hash01(pid, s) for s in (1, 2, 3, 4))
tone = 1 + (r1 - 0.5) * 0.30
warm = (r2 - 0.5) * 0.08
grain = (0.045 * np.sin(2 * np.pi * (across * 2.6 + 0.35 * np.sin(along * 1.7 + r3 * 6.28)) + r4 * 6.28)
         + 0.025 * np.sin(2 * np.pi * (across * 9.0 + along * 0.15) + r3 * 3))
fade = np.clip((Zw - 4) / 7, 0, 1)  # far away the grain averages out
grain *= (1 - fade)
seam_w = 0.05 + 0.04 * fade
seam = ((across < seam_w) | (across > 1 - seam_w) | (along < seam_w) | (along > N - seam_w)).astype(np.float32)
alb = tone * (1 + grain) * (1 - 0.32 * seam * (1 - 0.6 * fade))
parq = np.stack([alb * (1 + warm), alb, alb * (1 - warm)], -1).astype(np.float32)

# concrete: multi-octave value noise in world space
def vnoise(scale, seed):
    g = np.random.default_rng(seed).random((64, 64)).astype(np.float32)
    gx = (Xw / scale) % 64
    gz = (Zw / scale) % 64
    return cv2.remap(cv2.resize(g, (64 * 8, 64 * 8), interpolation=cv2.INTER_CUBIC),
                     (gx * 8).astype(np.float32), (gz * 8).astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
conc = (0.45 * vnoise(0.9, 1) + 0.3 * vnoise(0.3, 2) + 0.25 * vnoise(0.07, 3))
conc = 0.9 + (conc - 0.5) * 0.24 * (1 - 0.5 * fade)
conc += (np.random.default_rng(5).random(conc.shape, dtype=np.float32) - 0.5) * 0.06 * (1 - fade)
trowel = 0.012 * np.sin((Xw * 3.1 + np.sin(Zw * 1.3) * 0.8) * 2.0) * (1 - fade)
conc = (conc + trowel).astype(np.float32)

# plank install time: back wall -> camera, row by row with jitter
cz = (cu * c45 + cv_ * c45) * PW  # rotate back: Z = (-u + v) * c45 * PW
cz = (-cu + cv_) * c45 * PW
cx = (cu + cv_) * c45 * PW
zf, zn = 10.5, 2.4
t_inst = np.clip((zf - cz) / (zf - zn), 0, 1) * 0.86 + 0.06 * np.clip((cx + 3) / 6, 0, 1) + 0.08 * r2
t_inst = t_inst.astype(np.float32)


def down(a):
    if a.ndim == 2:
        return a.reshape(H, SS, W, SS).mean((1, 3))
    return a.reshape(H, SS, W, SS, a.shape[-1]).mean((1, 3))


lum = light.mean(-1, keepdims=True)
light_norm = light / np.clip(down(parq).mean() if False else 1.0, 1e-3, None)
conc_rgb = down(conc)[..., None] * (lum * np.array([0.98, 0.97, 0.95], np.float32)) * 0.86
light_p = (lum + (light - lum) * 1.08) * 0.94
mean_alb = down(parq).mean((0, 1))
mean_alb = parq[(Zw < 8)].mean(0)


def floor_parquet(t):
    a = 1 / (1 + np.exp(-(t - t_inst) / 0.006))  # per sample coverage
    fresh = np.exp(-np.clip(t - t_inst, 0, None) / 0.035) * a  # fresh plank glints
    rgb = parq / mean_alb * (1 + 0.18 * fresh[..., None])
    return down(a)[..., None], down(rgb * a[..., None]) / np.clip(down(a)[..., None], 1e-4, None)


def grade(img, k):
    """k=0: raw construction look (cool, flat), k=1: original."""
    g = img.mean(-1, keepdims=True)
    cool = (g + (img - g) * 0.35) * np.array([0.9, 0.93, 0.98], np.float32) * 0.8
    return cool * (1 - k) + img * k


def smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def shifted(layer, mask, dy):
    if dy == 0:
        return layer, mask
    M = np.float32([[1, 0, 0], [0, 1, dy]])
    return (cv2.warpAffine(layer, M, (W, H), borderMode=cv2.BORDER_REPLICATE),
            cv2.warpAffine(mask, M, (W, H)))


feather = {k: cv2.GaussianBlur(m, (0, 0), 2.2) for k, m in
           (('rug', m_rug), ('sofa', m_sofa), ('table', m_table), ('chair', m_chair))}


def frame(i):
    f = i / (FRAMES - 1)
    t_par = smooth(0.12, 0.58, f) * 1.12 - 0.02  # parquet laying progress
    k_room = smooth(0.1, 0.6, f)
    cov, prgb = floor_parquet(t_par)
    floor = conc_rgb * (1 - cov) + (prgb * light_p) * cov
    room = grade(shell, 0.25 + 0.75 * k_room)
    img = room * (1 - floor_soft[..., None]) + floor * floor_soft[..., None]
    # furniture arrives
    for name, layer, a, b, slide in (('rug', rug_layer, 0.58, 0.68, 0), ('sofa', photo, 0.63, 0.75, -26),
                                     ('table', photo, 0.69, 0.80, -18), ('chair', photo, 0.73, 0.85, -22)):
        p = smooth(a, b, f)
        if p <= 0:
            continue
        lay, msk = shifted(layer, feather[name], slide * (1 - p))
        al = (msk * p)[..., None]
        img = img * (1 - al) + lay * al
    img = img * (1 - smooth(0.86, 0.95, f)) + photo * smooth(0.86, 0.95, f)
    out = np.clip(img * 255, 0, 255).astype(np.uint8)
    return Image.fromarray(out).resize((OUT_W, OUT_H), Image.LANCZOS)


if __name__ == '__main__' and '--designer' not in sys.argv:
    if '--preview' in sys.argv:
        picks = [0, 20, 30, 40, 52, 60, 66, 72, 78, 95]
        sheet = Image.new('RGB', (640 * 2, 362 * 5))
        for n, i in enumerate(picks):
            sheet.paste(frame(i).resize((640, 362)), ((n % 2) * 640, (n // 2) * 362))
        sheet.save(sys.argv[-1])
    else:
        os.makedirs(OUT, exist_ok=True)
        for i in range(FRAMES):
            frame(i).save(os.path.join(OUT, f'{i + 1:04d}.webp'), quality=74, method=5)
            print(i + 1, end=' ', flush=True)


def export_designer():
    """Layers for the 'Zeminini tasarla' configurator (floor is drawn live in the browser)."""
    out = os.path.join(ROOT, 'public/images/designer')
    os.makedirs(out, exist_ok=True)
    a_floor = floor_soft
    shell_rgba = np.dstack([shell, 1 - a_floor])
    lum_f = light_p.mean(-1)
    ref = np.percentile(lum_f[floor_hard > 0], 97)
    lm = np.repeat(np.clip(lum_f / ref, 0, 1)[..., None], 3, -1)  # neutral: tone colour stays true
    light_rgba = np.dstack([lm, a_floor])
    fm = np.clip(np.maximum.reduce([feather['sofa'], feather['table'], feather['chair'], feather['rug']]), 0, 1)
    furn = np.where(feather['rug'][..., None] > 0, rug_layer, photo)
    furn = np.where(np.maximum.reduce([m_sofa, m_table, m_chair])[..., None] > 0, photo, furn)
    furn_rgba = np.dstack([furn, fm])
    for name, arr in (('shell', shell_rgba), ('light', light_rgba), ('furniture', furn_rgba)):
        Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8), 'RGBA').save(
            os.path.join(out, f'{name}.webp'), quality=82, method=5)
    print('designer layers written')


if __name__ == '__main__' and '--designer' in sys.argv:
    export_designer()

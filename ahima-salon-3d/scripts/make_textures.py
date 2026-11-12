"""Procedural, seamless PBR textures for the Ahima living-room scene.

Everything here is generated from noise, so there is no third-party licence to track.
    pip install numpy scipy pillow
    python3 scripts/make_textures.py public/textures

Normal maps use the OpenGL convention (+Y up), which is what three.js expects.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "public/textures")
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- helpers
def noise(shape, sigma, seed=None):
    """Seamless gaussian-filtered noise, normalised to 0..1."""
    r = np.random.default_rng(seed) if seed is not None else rng
    n = ndi.gaussian_filter(r.standard_normal(shape), sigma, mode="wrap")
    n -= n.min()
    return n / (n.max() + 1e-9)


def fbm(shape, sigmas, weights, seed=0):
    acc = np.zeros(shape)
    for i, (s, w) in enumerate(zip(sigmas, weights)):
        acc += w * noise(shape, s, seed + i)
    acc -= acc.min()
    return acc / acc.max()


def sample(arr, y, x):
    """Bilinear sample with wrap."""
    return ndi.map_coordinates(arr, [y % arr.shape[0], x % arr.shape[1]], order=1, mode="grid-wrap")


def lerp_color(t, c0, c1):
    c0, c1 = np.array(c0, float), np.array(c1, float)
    return c0 + (c1 - c0) * t[..., None]


def normal_from_height(h, strength):
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5 * strength
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5 * strength
    # image rows grow downward; OpenGL normal maps want +Y up
    n = np.dstack([-dx, dy, np.ones_like(h)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    return n * 0.5 + 0.5


def save(name, arr, quality=88):
    a = np.clip(arr, 0, 1)
    img = Image.fromarray((a * 255 + 0.5).astype(np.uint8))
    img.save(OUT / f"{name}.jpg", quality=quality, optimize=True, progressive=True)
    print("wrote", name, img.size)


def srgb(rgb255):
    return np.array(rgb255, float) / 255.0


# ---------------------------------------------------------------- herringbone oak
def herringbone(size=2048):
    L, W, t = 6, 1, 6  # plank = 6 x 1 units, 1 unit = 0.1 m  -> tile = 12 units = 1.2 m
    a, b = -1, 0  # vertical plank offset found by brute-force tiling search
    period = 2 * t
    px = size / period
    cell_id = -np.ones((period, period), int)
    planks = []  # (x0, y0, w, h, horizontal)
    for k in range(-3 * period, 3 * period):
        for n in range(-3, 4):
            ox, oy = k + t * n, k - t * n
            for (x0, y0, w, h, hor) in [(ox, oy, L, W, True), (ox + a, oy + b, W, L, False)]:
                pid = len(planks)
                planks.append((x0, y0, w, h, hor))
                for cy in range(y0, y0 + h):
                    for cx in range(x0, x0 + w):
                        cell_id[cy % period, cx % period] = pid if cell_id[cy % period, cx % period] < 0 else cell_id[cy % period, cx % period]
    assert (cell_id >= 0).all()
    planks = np.array(planks, float)

    yy, xx = np.mgrid[0:size, 0:size] / px  # in plank units
    cx, cy = np.floor(xx).astype(int) % period, np.floor(yy).astype(int) % period
    pid = cell_id[cy, cx]
    p = planks[pid]
    # local coordinates relative to the plank origin (handle wrap)
    lx = (xx - p[..., 0]) % period
    ly = (yy - p[..., 1]) % period
    hor = p[..., 4] > 0.5
    along = np.where(hor, lx, ly)  # 0..6
    across = np.where(hor, ly, lx)  # 0..1

    # per-plank randomness (stable by plank index modulo pattern)
    uniq = np.unique(pid)
    r = np.random.default_rng(11)
    tone = np.zeros(pid.max() + 1); off = np.zeros((pid.max() + 1, 2)); knot = np.zeros(pid.max() + 1)
    tone[uniq] = r.uniform(-1, 1, len(uniq))
    off[uniq] = r.uniform(0, 4000, (len(uniq), 2))
    knot[uniq] = r.uniform(0, 1, len(uniq))

    G = fbm((256, 2048), [(1.5, 60), (0.6, 20), (3, 200)], [0.55, 0.3, 0.15], seed=3)  # rows=across, cols=along
    fine = fbm((512, 512), [0.7, 2], [0.6, 0.4], seed=9)
    ga = along * 300 + off[pid, 0]
    gc = across * 160 + off[pid, 1]
    grain = sample(G, gc, ga)
    # growth rings: distorted sine across the board
    rings = 0.5 + 0.5 * np.sin((across * 9 + grain * 6 + off[pid, 1] * 0.01) * np.pi)
    rings = rings ** 3
    micro = sample(fine, yy * 90, xx * 90)

    t_col = 0.48 + 0.16 * tone[pid] + 0.38 * (grain - 0.5) - 0.2 * rings + 0.05 * (micro - 0.5)
    light, dark = srgb((205, 165, 118)), srgb((132, 90, 56))
    col = lerp_color(np.clip(t_col, 0, 1), dark, light)

    # bevel / gap at plank edges
    e_al = np.minimum(along, L - along) * 0.1  # metres
    e_ac = np.minimum(across, 1 - across) * 0.1
    edge = np.minimum(e_al, e_ac)
    gap = np.clip(edge / 0.0012, 0, 1)
    bevel = np.clip(edge / 0.004, 0, 1)
    col *= (0.55 + 0.45 * gap)[..., None]
    col *= (0.9 + 0.1 * bevel)[..., None]

    height = 0.6 * bevel + 0.4 * gap - 0.05 * rings + 0.04 * grain + 0.01 * micro
    nrm = normal_from_height(height, 6.0)
    rough = 0.42 + 0.12 * (1 - grain) + 0.08 * rings + 0.25 * (1 - gap)
    save("oak_herringbone_col", col, 90)
    save("oak_herringbone_nrm", nrm, 92)
    save("oak_herringbone_rgh", np.dstack([rough] * 3), 85)


# ---------------------------------------------------------------- walnut (grain runs along +V)
def walnut(size=1024):
    H, Wd = size, size
    G = fbm((H, 192), [(40, 1.2), (10, 0.6), (120, 3)], [0.55, 0.3, 0.15], seed=21)
    G = np.array(Image.fromarray((G * 255).astype(np.uint8)).resize((Wd, H), Image.BICUBIC)) / 255.0
    yy, xx = np.mgrid[0:H, 0:Wd]
    warp = noise((H, Wd), (220, 18), 5)
    rings = 0.5 + 0.5 * np.sin((xx / Wd * 16 + warp * 1.6 + G * 0.6) * 2 * np.pi)
    rings = rings ** 4
    fine = noise((H, Wd), (6, 0.5), 8)
    t = 0.45 + 0.3 * (G - 0.5) - 0.18 * rings + 0.08 * (fine - 0.5)
    col = lerp_color(np.clip(t, 0, 1), srgb((58, 36, 22)), srgb((140, 96, 62)))
    height = 0.4 * G + 0.2 * fine - 0.2 * rings
    save("walnut_col", col)
    save("walnut_nrm", normal_from_height(height, 3.5), 92)
    save("walnut_rgh", np.dstack([0.48 + 0.15 * rings + 0.1 * fine] * 3), 85)


# ---------------------------------------------------------------- travertine (bands run along U)
def travertine(size=1024):
    H, Wd = size, size
    bands = fbm((H, 64), [(3, 6), (12, 20), (1, 3)], [0.5, 0.35, 0.15], seed=31)
    bands = np.array(Image.fromarray((bands * 255).astype(np.uint8)).resize((Wd, H), Image.BICUBIC)) / 255.0
    cloud = fbm((H, Wd), [40, 12, 3], [0.5, 0.3, 0.2], seed=33)
    # pores: elongated small dark pits
    pits = noise((H, Wd), (1.2, 4), 35)
    pits = np.clip((pits - 0.80) / 0.1, 0, 1)
    t = 0.55 + 0.25 * (bands - 0.5) + 0.15 * (cloud - 0.5)
    col = lerp_color(np.clip(t, 0, 1), srgb((176, 156, 130)), srgb((232, 218, 196)))
    col *= (1 - 0.35 * pits)[..., None]
    height = 0.3 * bands + 0.15 * cloud - 0.6 * pits
    save("travertine_col", col)
    save("travertine_nrm", normal_from_height(height, 2.5), 92)
    save("travertine_rgh", np.dstack([0.62 + 0.15 * cloud + 0.2 * pits] * 3), 85)


# ---------------------------------------------------------------- woven fabric (boucle-ish linen)
def fabric(name, c0, c1, size=512, weave=48, slub=0.35, height_strength=5):
    yy, xx = np.mgrid[0:size, 0:size] / size
    wx = np.sin(xx * weave * 2 * np.pi); wy = np.sin(yy * weave * 2 * np.pi)
    sl1 = noise((size, size), (0.6, 12), 41); sl2 = noise((size, size), (12, 0.6), 42)
    warp = (0.5 + 0.5 * wx) * (0.7 + slub * sl1)
    weft = (0.5 + 0.5 * wy) * (0.7 + slub * sl2)
    checker = (np.sin(xx * weave * np.pi) * np.sin(yy * weave * np.pi)) > 0
    h = np.where(checker, warp, weft)
    fuzz = noise((size, size), 0.8, 43)
    loops = noise((size, size), 2.5, 44)
    h = 0.55 * h + 0.25 * fuzz + 0.2 * loops
    tone = noise((size, size), 30, 45)
    t = 0.5 + 0.35 * (h - 0.5) + 0.15 * (tone - 0.5)
    save(f"{name}_col", lerp_color(np.clip(t, 0, 1), c0, c1))
    save(f"{name}_nrm", normal_from_height(h, height_strength), 92)


# ---------------------------------------------------------------- rug pile
def rug(size=1024):
    pile = fbm((size, size), [0.7, 2, 6], [0.5, 0.3, 0.2], seed=51)
    border_pattern = fbm((size, size), [40, 90], [0.6, 0.4], seed=52)
    t = 0.55 + 0.3 * (pile - 0.5) + 0.2 * (border_pattern - 0.5)
    col = lerp_color(np.clip(t, 0, 1), srgb((172, 160, 142)), srgb((226, 216, 200)))
    save("rug_col", col)
    save("rug_nrm", normal_from_height(pile, 7), 92)


# ---------------------------------------------------------------- plaster / concrete / leather
def plaster(size=1024):
    n = fbm((size, size), [1, 6, 40], [0.3, 0.4, 0.3], seed=61)
    save("plaster_nrm", normal_from_height(n, 1.6), 92)
    save("plaster_rgh", np.dstack([0.82 + 0.1 * n] * 3), 85)


def concrete(size=1024):
    base = fbm((size, size), [2, 10, 60, 160], [0.15, 0.25, 0.35, 0.25], seed=71)
    stains = noise((size, size), 90, 72)
    speck = noise((size, size), 0.6, 73)
    t = 0.55 + 0.3 * (base - 0.5) - 0.2 * np.clip(stains - 0.6, 0, 1) + 0.08 * (speck - 0.5)
    col = lerp_color(np.clip(t, 0, 1), srgb((128, 124, 118)), srgb((196, 192, 184)))
    save("concrete_col", col)
    save("concrete_nrm", normal_from_height(0.6 * base + 0.4 * speck, 4), 92)
    save("concrete_rgh", np.dstack([0.75 + 0.15 * speck - 0.1 * stains] * 3), 85)


def leather(size=512):
    cells = noise((size, size), 3, 81)
    crease = np.abs(ndi.laplace(ndi.gaussian_filter(cells, 1, mode="wrap")))
    crease = crease / crease.max()
    tone = fbm((size, size), [20, 60], [0.6, 0.4], seed=82)
    t = 0.5 + 0.35 * (tone - 0.5) - 0.3 * crease
    col = lerp_color(np.clip(t, 0, 1), srgb((96, 52, 28)), srgb((168, 104, 62)))
    save("leather_col", col)
    save("leather_nrm", normal_from_height(cells - crease, 4), 92)


# ---------------------------------------------------------------- garden backdrop seen through the window
def garden(w=2048, h=1024):
    yy, xx = np.mgrid[0:h, 0:w] / np.array([h, w])[:, None, None]
    sky = lerp_color(yy[0] if False else yy, srgb((196, 222, 240)), srgb((245, 240, 228)))
    img = sky.copy()
    # soft clouds
    cl = fbm((h, w), [30, 80], [0.5, 0.5], seed=91)
    img += (np.clip(cl - 0.6, 0, 1) * 0.35)[..., None] * (1 - yy[..., None])
    # three layers of defocused foliage, far -> near
    layers = [(0.50, 0.10, (126, 150, 120), 14, 0.9), (0.60, 0.13, (86, 118, 72), 7, 0.95), (0.74, 0.16, (60, 92, 52), 3, 1.0)]
    for i, (base, amp, c, blur, a) in enumerate(layers):
        prof = fbm((1, w * 2), [(0.1, 60), (0.1, 15)], [0.7, 0.3], seed=100 + i)[0, ::2]
        top = base - amp * prof
        canopy = noise((h, w), 6, 110 + i)
        mask = (yy > top[None, :] + 0.06 * (canopy - 0.5)).astype(float)
        mask = ndi.gaussian_filter(mask, blur, mode="nearest")
        leaf = fbm((h, w), [2, 8, 24], [0.4, 0.35, 0.25], seed=120 + i)
        lit = 0.75 + 0.5 * (leaf - 0.5) + 0.25 * (1 - (yy - base) * 2)
        lc = srgb(c)[None, None, :] * lit[..., None]
        # warm sun glints on the foliage
        lc += (np.clip(leaf - 0.7, 0, 1) * 0.6)[..., None] * srgb((255, 226, 160))
        img = img * (1 - mask[..., None] * a) + lc * mask[..., None] * a
    # lawn at the bottom
    lawn = np.clip((yy - 0.86) / 0.04, 0, 1)
    lawn = ndi.gaussian_filter(lawn, 3, mode="nearest")
    lg = fbm((h, w), [3, 20], [0.5, 0.5], seed=130)
    img = img * (1 - lawn[..., None]) + (srgb((112, 140, 70)) * (0.8 + 0.4 * lg)[..., None]) * lawn[..., None]
    img = ndi.gaussian_filter(img, (1.2, 1.2, 0), mode="nearest")
    save("garden_view", img, 86)


if __name__ == "__main__":
    herringbone()
    walnut()
    travertine()
    fabric("boucle", srgb((198, 186, 168)), srgb((238, 230, 216)), weave=56, slub=0.5, height_strength=6)
    fabric("linen", srgb((196, 184, 164)), srgb((236, 228, 212)), weave=40, slub=0.3, height_strength=3)
    rug()
    plaster()
    concrete()
    leather()
    garden()

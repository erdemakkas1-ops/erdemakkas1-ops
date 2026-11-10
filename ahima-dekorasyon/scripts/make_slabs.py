"""Procedural porcelain-slab textures for the bathroom renders (no third-party imagery).

  python3 scripts/make_slabs.py OUT_DIR

Writes <name>_diff.png, <name>_rough.png, <name>_bump.png for:
  marble   - polished white marble (Calacatta-like grey veins with a faint warm vein)
  anthra   - honed anthracite stone (fine grain, sparse thin pale veins)
  beige    - honed beige natural stone (travertine-like strata and pores)
Each map is 4096 x 2048 = two 120 x 60 cm slabs side by side's worth of material, so neighbouring
tiles can take different windows of it (book-matched look, no visible repeats).
"""
import os, sys
import numpy as np
import cv2

W, H = 4096, 2048
rng = np.random.default_rng(7)


def noise(scale, seed, w=W, h=H):
    r = np.random.default_rng(seed)
    gw, gh = max(2, int(w / scale)) + 3, max(2, int(h / scale)) + 3
    g = r.random((gh, gw)).astype(np.float32)
    big = cv2.resize(g, (int(gw * scale), int(gh * scale)), interpolation=cv2.INTER_CUBIC)
    return big[:h, :w]


def fbm(base, octaves, seed, gain=0.5, w=W, h=H):
    out = np.zeros((h, w), np.float32); amp = 1.0; tot = 0
    for o in range(octaves):
        out += amp * noise(base / (2 ** o), seed + o * 101, w, h); tot += amp; amp *= gain
    return out / tot


yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def save(name, out, diff, rough, bump):
    cv2.imwrite(os.path.join(out, f'{name}_diff.png'), cv2.cvtColor((np.clip(diff, 0, 1) * 255).astype(np.uint8), cv2.COLOR_RGB2BGR))
    cv2.imwrite(os.path.join(out, f'{name}_rough.png'), (np.clip(rough, 0, 1) * 255).astype(np.uint8))
    cv2.imwrite(os.path.join(out, f'{name}_bump.png'), (np.clip(bump, 0, 1) * 255).astype(np.uint8))
    print('wrote', name)


def veins(angle, freq, warp_amt, sharp, seed, warp_scale=1600, jitter=.035):
    # gentle large-scale meander + fine jitter so the edges are natural, never contour-map loops
    wx = fbm(warp_scale, 3, seed) - .5
    wj = fbm(90, 4, seed + 50) - .5
    a = np.deg2rad(angle)
    u = (xx * np.cos(a) + yy * np.sin(a)) / W
    f = np.sin((u * freq + wx * warp_amt + wj * jitter * freq) * np.pi)
    return np.exp(-np.abs(f) * sharp)


def marble(out):
    cloud = fbm(700, 6, 1)
    base = np.dstack([np.full((H, W), c, np.float32) for c in (.925, .918, .905)])
    base *= (0.965 + 0.05 * cloud)[..., None]
    fade = lambda sd, k: np.clip((fbm(1100, 3, sd) - .35) * k, 0, 1)
    main = veins(32, 1.6, .9, 10, 11) * (0.30 + 0.55 * fade(12, 3))
    halo = veins(32, 1.6, .9, 2.2, 11) * .35
    thin = veins(18, 3.4, 1.1, 38, 21) * fade(22, 2.5)
    hair = veins(-48, 7.0, 1.3, 90, 31) * fade(32, 2.0) * .8
    main = main + halo
    grey = np.array([.50, .50, .52], np.float32)
    v = np.clip(main * .85 + thin * .55 + hair * .35, 0, 1)
    v = cv2.GaussianBlur(v, (0, 0), 1.2)
    diff = base * (1 - v[..., None] * 0.40) + grey * (v[..., None] * 0.40 * .45)
    warm = veins(32, 1.6, .9, 45, 11) * fade(13, 2)
    diff = diff * (1 - warm[..., None] * .18) + np.array([.62, .52, .38], np.float32) * warm[..., None] * .18
    rough = 0.10 + 0.05 * fbm(200, 3, 4) + v * 0.04
    save('marble', out, diff, rough, 0.5 + 0.08 * cloud - v * 0.04)


def anthra(out):
    g = fbm(260, 7, 41) * .6 + fbm(18, 4, 47) * .4
    speck = noise(3, 42) ; speck = (speck > .985).astype(np.float32) * .5 + (speck < .02).astype(np.float32) * -.4
    speck = cv2.GaussianBlur(speck, (0, 0), .8)
    lum = 0.115 + 0.05 * (g - .5) + 0.02 * fbm(1200, 3, 43) + speck * .03
    diff = np.dstack([lum * 1.0, lum * 1.02, lum * 1.06])
    v = veins(-26, 2.2, .8, 110, 44) * np.clip((fbm(900, 3, 45) - .45) * 4, 0, 1) * .8
    v = cv2.GaussianBlur(v.astype(np.float32), (0, 0), .9)
    diff = diff * (1 - v[..., None] * .55) + np.array([.62, .62, .60]) * v[..., None] * .55
    rough = 0.42 + 0.12 * fbm(150, 4, 46)
    save('anthra', out, diff, rough, 0.5 + 0.15 * (g - .5) + speck * .1)


def beige(out):
    # strata: noise stretched along x
    s1 = cv2.resize(fbm(60, 5, 61, w=W // 16, h=H), (W, H), interpolation=cv2.INTER_CUBIC)
    s2 = cv2.resize(fbm(25, 4, 62, w=W // 24, h=H), (W, H), interpolation=cv2.INTER_CUBIC)
    warp = fbm(800, 4, 63)
    strata = np.roll(s1, 0, 0) * .7 + s2 * .3
    shift = (warp * 120).astype(np.int32)
    idx = np.clip(yy.astype(np.int32) + shift, 0, H - 1)
    strata = strata[idx, xx.astype(np.int32)]
    lum = 0.80 + 0.16 * (strata - .5) + 0.04 * (fbm(400, 5, 64) - .5)
    diff = np.dstack([lum * 1.0, lum * .905, lum * .755])
    # pores: small elongated dark voids
    p = np.random.default_rng(65).random((H, W)).astype(np.float32)
    pores = (p > .9985).astype(np.float32)
    pores = cv2.dilate(pores, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 3)))
    pores = cv2.GaussianBlur(pores, (0, 0), 1.2) * (0.3 + 0.7 * fbm(700, 3, 66))
    diff = diff * (1 - pores[..., None] * .35)
    rough = 0.33 + 0.08 * fbm(200, 3, 67) + pores * .3
    save('beige', out, diff, rough, 0.5 + 0.12 * (strata - .5) - pores * .3)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'slabs'
    os.makedirs(out, exist_ok=True)
    marble(out); anthra(out); beige(out)

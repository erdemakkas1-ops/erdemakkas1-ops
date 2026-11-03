"""Cut the project photos out of SDM's own Instagram grid (instagram-raw/profil-ekran.jpg, a 1080 x 2400
phone screenshot of @sdm_mobilya_mimarlk). instagram-raw/ is kept out of git.

  python3 tools/instagram.py

Each grid tile is about 356 x 475 px; the top 80 px are dropped to remove the reel / carousel icon
(a third tuple value cuts extra px, e.g. the swatch labels on krem-ceviz-ada).
Sharpening: each tile is upscaled 2x with the EDSR super-resolution model (OpenCV dnn_superres,
`pip install opencv-contrib-python-headless`; model instagram-raw/models/EDSR_x2.pb from
github.com/Saafke/EDSR_Tensorflow) and then given a light unsharp mask. Without OpenCV or the model it
falls back to Lanczos. This only makes the screenshot crops cleaner; it cannot add real detail, so
replace with full-resolution photos from SDM before going live.
"""
import os

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "instagram-raw", "profil-ekran.jpg")
OUT = os.path.join(ROOT, "img", "proje")
COLS = [(0, 356), (362, 718), (724, 1080)]
ROWS = [(1425, 1901), (1907, 2356)]
CUT = 80
TILES = {
    "l-mutfak-3d": (0, 0),          # 3D varyasyon: L mutfak, turuncu vurgu, açık ahşap tezgah
    "tv-citali-panel": (0, 1),      # koyu çıtalı panel, mermer çerçeve, LED'li cam vitrin
    "gri-shaker-mutfak": (0, 2),    # gri shaker kapak, pirinç kulp, altın batarya
    "krem-tv-duvari": (1, 0),       # krem asma ünite, ahşap çıta, cam vitrin
    "siyah-mermer-ada": (1, 1),     # antrasit mutfak, siyah mermer ada, bordo çıta
    "krem-ceviz-ada": (1, 2, 24),   # krem shaker + açık ahşap, bordo mermer tezgahlı ada
}


MODEL = os.path.join(ROOT, "instagram-raw", "models", "EDSR_x2.pb")


def upscaler():
    try:
        import cv2
        sr = cv2.dnn_superres.DnnSuperResImpl_create()
        sr.readModel(MODEL)
        sr.setModel("edsr", 2)
    except Exception as e:  # no OpenCV / no model
        print("EDSR unavailable, using Lanczos:", e)
        return lambda t: t.resize((t.width * 2, t.height * 2), Image.LANCZOS)

    def run(tile):
        bgr = np.asarray(tile)[:, :, ::-1].copy()
        return Image.fromarray(sr.upsample(bgr)[:, :, ::-1])
    return run


def main():
    os.makedirs(OUT, exist_ok=True)
    im = Image.open(SRC).convert("RGB")
    up = upscaler()
    for name, (r, c, *extra) in TILES.items():
        (x0, x1), (y0, y1) = COLS[c], ROWS[r]
        tile = im.crop((x0, y0 + CUT + sum(extra), x1, y1))
        tile = up(tile).filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
        tile.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=88, method=6)
        print(name, tile.size)


if __name__ == "__main__":
    main()

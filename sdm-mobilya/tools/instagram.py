"""Cut the project photos out of SDM's own Instagram grid (instagram-raw/profil-ekran.jpg, a 1080 x 2400
phone screenshot of @sdm_mobilya_mimarlk). instagram-raw/ is kept out of git.

  python3 tools/instagram.py

Each grid tile is about 356 x 475 px; the top 80 px are dropped to remove the reel / carousel icon
(a third tuple value cuts extra px, e.g. the swatch labels on krem-ceviz-ada).
Replace with full-resolution photos from SDM before going live.
"""
import os

from PIL import Image

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


def main():
    os.makedirs(OUT, exist_ok=True)
    im = Image.open(SRC).convert("RGB")
    for name, (r, c, *extra) in TILES.items():
        (x0, x1), (y0, y1) = COLS[c], ROWS[r]
        tile = im.crop((x0, y0 + CUT + sum(extra), x1, y1))
        tile.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=88, method=6)
        print(name, tile.size)


if __name__ == "__main__":
    main()

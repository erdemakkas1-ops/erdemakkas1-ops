"""Make the project photos from Arqli's own Instagram grid (instagram-raw/profil-ekran.jpg, a 1080 x 2400
phone screenshot of @arqli.interiors). Kept out of git: instagram-raw/.

  python3 tools/instagram.py

Each grid tile is about 356 x 474 px. Tiles with the carousel icon in the corner lose their top 80 px.
Replace with full-resolution photos from the studio before going live.
"""
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "instagram-raw", "profil-ekran.jpg")
OUT = os.path.join(ROOT, "img", "proje")
COLS = [(0, 356), (363, 718), (725, 1080)]
ROWS = [(1320, 1794), (1800, 2274)]
TILES = {
    # name: (row, col, cut the top for the carousel icon)
    "banyo-zeytin": (0, 0, False),     # zeytin yeşili lavabo dolabı, kemerli LED ayna, nişler
    "kafe-teras": (0, 1, True),        # kiremit duvarlı kafe, sokak terası
    "ofis-kutuphane": (0, 2, True),    # yönetici ofisi, LED raflı kütüphane duvarı
    "wc-ahsap": (1, 0, True),          # gömme rezervuar, ahşap nişler, bakır detay
    "yatak-halka": (1, 2, True),       # halka avize, bordo yastıklar, kemer gölgeli duvar
}


def main():
    os.makedirs(OUT, exist_ok=True)
    im = Image.open(SRC).convert("RGB")
    for name, (r, c, cut) in TILES.items():
        (x0, x1), (y0, y1) = COLS[c], ROWS[r]
        tile = im.crop((x0, y0 + (80 if cut else 0), x1, y1))
        tile.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=86, method=6)
        print(name, tile.size)


if __name__ == "__main__":
    main()
